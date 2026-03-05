import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ShieldCheck, Search, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import type { User as UserType } from '../types';

const VerifyAttendance = () => {
    const [uid, setUid] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifiedUser, setVerifiedUser] = useState<UserType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uid || !otp) return;

        setLoading(true);
        setError(null);
        setVerifiedUser(null);

        try {
            // In a real app, the QR scan would provide the UID.
            // For this interface, we manually enter the UID or Scan result.
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data() as UserType;

                // For demonstration, we simply verify if the user exists.
                // In a production app, we would verify the OTP against a server-side generated one.
                if (otp.length === 4) {
                    setVerifiedUser(userData);
                } else {
                    setError("Invalid OTP format. Must be 4 digits.");
                }
            } else {
                setError("User not found. Please try again.");
            }
        } catch (err: any) {
            setError("Error verifying attendance: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Attendance Verification</h1>
                <p className="text-slate-500">Scan QR and enter OTP to verify passenger</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Search Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100"
                >
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Student/Staff ID</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    value={uid}
                                    onChange={(e) => setUid(e.target.value)}
                                    placeholder="Enter UID from QR"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">4-Digit OTP</label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    maxLength={4}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="0000"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none tracking-[0.5em] text-center font-black"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Verify Attendance
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-3 text-sm font-medium">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                </motion.div>

                {/* Result Section */}
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {verifiedUser ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-200" />
                                </div>

                                <div className="relative z-10">
                                    <div className="inline-block p-1 bg-white rounded-2xl shadow-md mb-6">
                                        <img
                                            src={verifiedUser.avatar}
                                            alt={verifiedUser.name}
                                            className="w-24 h-24 rounded-xl object-cover"
                                        />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-1">{verifiedUser.name}</h3>
                                    <p className="text-emerald-700 font-bold text-sm uppercase mb-6">{verifiedUser.role}</p>

                                    <div className="space-y-3 pt-6 border-t border-emerald-200/50">
                                        <ResultItem label="Department" value={verifiedUser.dept || verifiedUser.deptName} />
                                        <ResultItem label="Reg No" value={verifiedUser.registerNo || 'N/A'} />
                                    </div>

                                    <div className="mt-8 flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 text-white rounded-full text-xs font-bold shadow-lg shadow-emerald-200">
                                        <CheckCircle2 className="w-4 h-4" />
                                        VERIFIED SUCCESSFULLY
                                    </div>

                                    <button
                                        onClick={() => setVerifiedUser(null)}
                                        className="mt-6 text-emerald-700 text-xs font-bold hover:underline"
                                    >
                                        Verify Another User
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400"
                            >
                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                    <Search className="w-10 h-10 opacity-20" />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-wider">Awaiting Scan</p>
                                <p className="text-xs mt-1 text-center">Verify passenger credentials to display information</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const ResultItem = ({ label, value }: { label: string, value: string | undefined }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-emerald-700/60 font-bold uppercase text-[10px] tracking-widest">{label}</span>
        <span className="text-emerald-900 font-black">{value || 'N/A'}</span>
    </div>
);

export default VerifyAttendance;
