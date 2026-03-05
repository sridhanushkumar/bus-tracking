import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Loader2, Camera } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Scanner = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [status, setStatus] = useState<'idle' | 'scanning' | 'processing' | 'success' | 'error' | 'permission_needed'>('idle');
    const [message, setMessage] = useState('');
    const [studentDetails, setStudentDetails] = useState<any>(null);
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scannerMounted = useRef(false);

    useEffect(() => {
        // Redirect if not authorized
        if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
            navigate('/scanner/login');
            return;
        }

        const startScanner = async () => {
            if (scannerMounted.current) return;
            scannerMounted.current = true;

            try {
                // Initialize scanner
                const html5QrCode = new Html5Qrcode("reader");
                scannerRef.current = html5QrCode;

                // Request permission and start scanning
                await html5QrCode.start(
                    { facingMode: "environment" }, // Prefer back camera
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                        aspectRatio: 1
                    },
                    onScanSuccess,
                    (errorMessage) => {
                        // ignore scan errors (too noisy)
                    }
                );

                setStatus('scanning');
            } catch (err: any) {
                console.error("Error starting scanner:", err);
                if (err.name === 'NotAllowedError' || err.message?.includes('permission')) {
                    setStatus('permission_needed');
                    setMessage("Camera permission denied. Please allow camera access.");
                } else {
                    setStatus('error');
                    setMessage("Failed to start camera. " + (err.message || ""));
                }
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            startScanner();
        }, 500);

        return () => {
            clearTimeout(timer);
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                    scannerRef.current?.clear();
                    scannerMounted.current = false;
                }).catch(err => console.error("Failed to stop scanner", err));
            }
        };
    }, []);

    const onScanSuccess = async (decodedText: string, _decodedResult: any) => {
        if (status === 'processing' || status === 'success') return;

        // Pause scanning visually (the library keeps scanning, but we ignore results)
        if (scannerRef.current) {
            scannerRef.current.pause();
        }

        setStatus('processing');

        try {
            let studentData = null;
            let queryValue = decodedText.trim();
            const scannedText = decodedText.trim();

            console.log("Scanned Text:", scannedText);

            // Attempt to parse JSON if the QR code contains a JSON object
            try {
                if (scannedText.startsWith('{') || scannedText.startsWith('[')) {
                    // Replace single quotes with double quotes if needed (common in some QR generators)
                    const jsonString = scannedText.replace(/'/g, '"');
                    const parsedData = JSON.parse(jsonString);

                    // Prioritize Register Number, then Email, then ID
                    if (parsedData.registerNo) queryValue = parsedData.registerNo;
                    else if (parsedData.email) queryValue = parsedData.email;
                    else if (parsedData.uid) {
                        // Special case: Direct UID lookup
                        const docRef = await getDoc(doc(db, "users", parsedData.uid));
                        if (docRef.exists()) {
                            studentData = docRef.data();
                        }
                    }
                }
            } catch (e) {
                console.log("Failed to parse as JSON, treating as raw string.");
            }

            // If we haven't found data via UID direct lookup yet, search by fields
            if (!studentData) {
                // 1. Check by Register No
                const q = query(collection(db, "users"), where("registerNo", "==", queryValue));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    studentData = querySnapshot.docs[0].data();
                } else {
                    // 2. Check by Email
                    const qEmail = query(collection(db, "users"), where("email", "==", queryValue));
                    const emailSnapshot = await getDocs(qEmail);
                    if (!emailSnapshot.empty) {
                        studentData = emailSnapshot.docs[0].data();
                    }
                }
            }

            if (!studentData) {
                throw new Error(`Student not found for: ${queryValue}`);
            }

            // --- 4-HOUR COOLDOWN CHECK ---
            // Simplified query to avoid needing a composite index
            const lastScanQuery = query(
                collection(db, "attendance"),
                where("studentId", "==", studentData.id)
            );
            const lastScanSnapshot = await getDocs(lastScanQuery);

            if (!lastScanSnapshot.empty) {
                // Sort in memory to find the most recent scan
                const scans = lastScanSnapshot.docs
                    .map(doc => doc.data())
                    .filter(data => data.timestamp)
                    .sort((a, b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime());

                if (scans.length > 0) {
                    const lastScan = scans[0];
                    const lastScanTime = lastScan.timestamp.toDate().getTime();
                    const now = new Date().getTime();
                    const hoursPassed = (now - lastScanTime) / (1000 * 60 * 60);

                    if (hoursPassed < 4) {
                        const remaining = (4 - hoursPassed).toFixed(1);
                        throw new Error(`Already scanned. Please wait ${remaining} more hours.`);
                    }
                }
            }
            // -----------------------------

            // Extract correct identification (avoid JSON string)
            const identification = studentData.registerNo || studentData.email || queryValue;

            const attendanceData = {
                studentId: studentData.id,
                name: studentData.name,
                role: studentData.role || (parsedData && parsedData.role) || 'member',
                registerNo: identification,
                timestamp: serverTimestamp(),
                scannedBy: user?.email,
                status: 'Present',
                busDetails: 'Bus 1 (Mocked)'
            };

            await addDoc(collection(db, "attendance"), attendanceData);

            setStudentDetails(studentData);
            setStatus('success');
            setMessage(`Attendance Marked for ${studentData ? studentData.name : queryValue}`);

            setTimeout(() => {
                setStatus('scanning');
                setStudentDetails(null);
                setMessage('');
                if (scannerRef.current) {
                    scannerRef.current.resume();
                }
            }, 3000);

        } catch (error) {
            console.error("Error logging attendance:", error);
            setStatus('error');
            setMessage(error instanceof Error ? error.message : "Failed to log attendance. Try again.");
            setTimeout(() => {
                setStatus('scanning');
                if (scannerRef.current) {
                    scannerRef.current.resume();
                }
            }, 3000);
        }
    };

    const handleManualRetry = () => {
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            <div className="bg-white p-4 flex items-center justify-between shadow-md z-10 sticky top-0">
                <button onClick={() => navigate('/admin-dashboard')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-800" />
                </button>
                <h1 className="font-bold text-lg text-slate-800 uppercase tracking-tight">QR Scanner</h1>
                <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 relative">

                {/* Status Overlay */}
                {(status === 'processing' || status === 'success' || status === 'error' || status === 'permission_needed') && (
                    <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-8 text-center`}>
                        {status === 'processing' && (
                            <>
                                <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
                                <h3 className="text-white text-xl font-bold">Processing...</h3>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <CheckCircle className="w-20 h-20 text-emerald-500 mb-4" />
                                <h3 className="text-white text-2xl font-black mb-2">Success!</h3>
                                <p className="text-emerald-200 font-medium text-lg">{message}</p>
                                {studentDetails && (
                                    <div className="mt-6 bg-white/10 p-6 rounded-2xl border border-white/20 w-full max-w-sm text-center">
                                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                            {studentDetails.role || 'Member'}
                                        </p>
                                        <p className="text-white text-xl font-black tracking-tight">{studentDetails.name}</p>
                                        <p className="text-indigo-300 font-mono mt-1 text-sm bg-indigo-500/10 py-1 rounded-lg">
                                            {studentDetails.registerNo || studentDetails.email}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <XCircle className="w-20 h-20 text-red-500 mb-4" />
                                <h3 className="text-white text-2xl font-black mb-2">Error</h3>
                                <p className="text-red-200 font-medium mb-4">{message}</p>
                                <button onClick={handleManualRetry} className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold">
                                    Retry
                                </button>
                            </>
                        )}
                        {status === 'permission_needed' && (
                            <>
                                <Camera className="w-20 h-20 text-slate-400 mb-4" />
                                <h3 className="text-white text-2xl font-black mb-2">Permission Required</h3>
                                <p className="text-slate-300 font-medium mb-6">We need access to your camera to scan QR codes.</p>
                                <button onClick={handleManualRetry} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                    Request Full Permissions
                                </button>
                            </>
                        )}
                    </div>
                )}

                <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl relative min-h-[300px] bg-slate-800">
                    <div id="reader" className="w-full h-full" />
                    {status === 'idle' && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <Loader2 className="w-8 h-8 animate-spin" />
                            <span className="ml-2">Starting Camera...</span>
                        </div>
                    )}
                </div>

                <p className="text-slate-500 text-sm mt-6 font-medium text-center">
                    Point camera at student QR code
                </p>
            </div>
        </div>
    );
};

export default Scanner;
