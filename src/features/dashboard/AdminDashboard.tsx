import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, Truck, AlertTriangle, TrendingUp, X, Mail, Phone, GraduationCap, Hash, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { User as UserType } from '../../types';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [showStudentList, setShowStudentList] = useState(false);
    const [showBusList, setShowBusList] = useState(false);
    const [selectedBus, setSelectedBus] = useState<any>(null);

    // Bus data from image
    const activeBusesData = [
        {
            id: 'B1',
            busNo: 'TN-24-T-4834',
            route: 'UTHUKKOTTAI',
            routeNo: '102',
            driver: 'V. Raju',
            phone: '8610814101',
            status: 'On Track',
            delay: 'None',
            color: 'bg-indigo-600',
            schedule: [
                { stop: 'UTHUKKOTTAI', time: '6.00 AM' },
                { stop: 'PONDAVAKKAM', time: '6.10 AM' },
                { stop: 'PERINJERI', time: '6.15 AM' },
                { stop: 'SEETHANJERI', time: '6.25 AM' },
                { stop: 'MYLAPURE MAIN', time: '6.30 AM' },
                { stop: 'ODHAPPAI', time: '6.40 AM' },
                { stop: 'POONDI', time: '6.45 AM' },
                { stop: 'PULLARAMBAKKAM', time: '6.50 AM' },
                { stop: 'THIRUVALLUR COLLETOR OFFICE', time: '6.55 AM' },
                { stop: 'KAKKALUR', time: '7.05 AM' },
                { stop: 'RAMAPURAM', time: '7.07 AM' },
                { stop: 'THOZHUR', time: '7.10 AM' },
                { stop: 'SEVVAPET', time: '7.12 AM' },
                { stop: 'VEPPAMPATTU', time: '7.20 AM' },
                { stop: 'TIRUNINRAVUR', time: '7.25 AM' },
                { stop: 'JAYA COLLEGE', time: '7.30 AM' },
                { stop: 'NEMILICHERY', time: '7.35 AM' },
                { stop: 'THANDURAI', time: '7.40 AM' },
                { stop: 'PATTABIRAM', time: '7.49 AM' },
                { stop: 'HINDU COLLEGE', time: '7.53 AM' },
                { stop: 'AVADI SEKKADU', time: '7.55 AM' },
                { stop: 'AVADI MARKET', time: '8.00 AM' },
                { stop: 'COLLEGE', time: '8.10 AM' },
            ]
        },
        {
            id: 'B2',
            busNo: 'TN-12-T-4648',
            route: 'MANALI',
            routeNo: '103',
            driver: 'R. Pandian',
            phone: '8939207141',
            status: 'On Track',
            delay: 'None',
            color: 'bg-white',
            schedule: [
                { stop: 'MANALI PUDHU NAGAR', time: '5.30 AM' },
                { stop: 'MANALI', time: '6.00 AM' },
                { stop: 'CHINNA MATHUR', time: '6.05 AM' },
                { stop: 'MADHAVARAM MILK COLONY', time: '6.10 AM' },
                { stop: 'THABAL PETTI', time: '6.15 AM' },
                { stop: 'M.R. NAGAR', time: '6.25 AM' },
                { stop: 'BHARATHI NAGAR', time: '6.30 AM' },
                { stop: 'MOOLAKADAI', time: '6.40 AM' },
                { stop: 'BRINDHA THEATRE', time: '6.42 AM' },
                { stop: 'ESWARI KALYANA MANDAPAM', time: '6.45 AM' },
                { stop: 'PERAMBUR RAILWAY STATION', time: '6.50 AM' },
                { stop: 'VENUS', time: '6.52 AM' },
                { stop: 'PERIYAR NAGAR', time: '6.55 AM' },
                { stop: 'KOLATHUR', time: '7.05 AM' },
                { stop: 'RETTARI', time: '7.20 AM' },
                { stop: 'THANTHAN KUPPAM', time: '7.35 AM' },
                { stop: 'COLLEGE', time: '8.10 AM' },
            ]
        },
        {
            id: 'B3',
            busNo: 'TN-24-AC-7365',
            route: 'CHINTADRIPET',
            routeNo: '101',
            driver: 'D. Sankaran',
            phone: '9710303124',
            status: 'On Track',
            delay: 'None',
            color: 'bg-white',
            schedule: [
                { stop: 'CHINTADRIPET', time: '6.30 AM' },
                { stop: 'EGMORE', time: '6.40 AM' },
                { stop: 'CHETPET', time: '6.55 AM' },
                { stop: 'LOYOLA COLLEGE', time: '6.55 AM' },
                { stop: 'CHOOLAIMEDU', time: '7.00 AM' },
                { stop: 'ANNA ARCH', time: '7.05 AM' },
                { stop: 'THIRUMANGALAM', time: '7.10 AM' },
                { stop: 'PARK ROAD', time: '7.15 AM' },
                { stop: 'COLLECTOR NAGAR', time: '7.17 AM' },
                { stop: 'MMM HOSPITAL', time: '7.19 AM' },
                { stop: 'MOGAPPAIR EAST', time: '7.20 AM' },
                { stop: 'MOGAPPAIR', time: '7.22 AM' },
                { stop: 'MOGAPPAIR WEST', time: '7.30 AM' },
                { stop: 'AMBATTUR TELEPHONE EX', time: '7.35 AM' },
                { stop: 'AMBATTUR OT', time: '7.40 AM' },
                { stop: 'SRI IVAN STEDEFORD', time: '7.42 AM' },
                { stop: 'MANIKANDAPURAM', time: '7.45 AM' },
                { stop: 'THIRUMULLAIVOYAL', time: '7.47 AM' },
                { stop: 'VAISHNAVI TEMPLE', time: '7.50 AM' },
                { stop: 'MURUGAPPA POLYTECHNIC', time: '7.52 AM' },
                { stop: 'AVADI BUS DEPO', time: '7.57 AM' },
                { stop: 'COLLEGE', time: '8.10 AM' },
            ]
        },
    ];

    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    const fetchStudents = async () => {
        setLoading(true);
        console.log("Fetching students with role 'student'...");
        try {
            const q = query(collection(db, "users"), where("role", "==", "student"));
            const querySnapshot = await getDocs(q);
            const studentData = querySnapshot.docs.map(doc => doc.data() as UserType);
            console.log(`Found ${studentData.length} students:`, studentData);
            setStudents(studentData);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();

        // Subscribe to attendance updates
        const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"), limit(5));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activities = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert timestamp to relative time (simplified)
                timeAgo: doc.data().timestamp ? formatDistanceToNow(doc.data().timestamp.toDate(), { addSuffix: true }) : 'Just now'
            }));
            setRecentActivity(activities);
        });

        return () => unsubscribe();
    }, []);

    const stats = [
        { label: 'Total Students', val: loading ? '...' : students.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', clickable: true, type: 'students' },
        { label: 'Active Buses', val: '3', icon: Truck, color: 'text-green-600', bg: 'bg-green-100', clickable: true, type: 'buses' },
        { label: 'Alerts', val: '3', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
        { label: 'Avg Attendance', val: '94%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">Admin Overview</h1>
                <button
                    onClick={() => navigate('/admin/attendance')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                    <FileText className="w-4 h-4" />
                    Attendance Logs
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            if (stat.type === 'students') setShowStudentList(true);
                            if (stat.type === 'buses') setShowBusList(true);
                        }}
                        className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 transition-all ${stat.clickable ? 'cursor-pointer hover:shadow-md hover:border-blue-200 group' : ''}`}
                    >
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color} ${stat.clickable ? 'group-hover:scale-110 transition-transform' : ''}`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-slate-900">{stat.val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                    <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-slate-400 text-sm italic">Loading activity...</p>
                        ) : (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                            {(activity.name || 'UK').split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {activity.name || 'Unknown User'} Marked Attendance
                                            </p>
                                            <p className="text-xs text-slate-500">Bus #{Math.floor(Math.random() * 50)} • {activity.timeAgo || 'Just now'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">{activity.status || 'Entry'}</span>
                                </div>
                            ))
                        )}
                        {!loading && students.length === 0 && (
                            <p className="text-slate-400 text-sm italic">No recent student activity.</p>
                        )}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <Truck className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="font-bold text-slate-500">Fleet Management Module</h3>
                    <p className="text-sm text-slate-400">Map view available in main tracker.</p>
                </div>
            </div>

            {/* Student List Modal */}
            <AnimatePresence>
                {showStudentList && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 overflow-y-auto py-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowStudentList(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Registered Students</h2>
                                    <p className="text-sm text-slate-500 font-medium">Total: {students.length}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={fetchStudents}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
                                    >
                                        Refresh List
                                    </button>
                                    <button
                                        onClick={() => setShowStudentList(false)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto p-6">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Student</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Reg No</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Department</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Year</th>
                                            <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {students.map((student) => (
                                            <tr key={student.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="py-4 px-4 leading-none">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                            <img
                                                                src={student.avatar || `https://ui-avatars.com/api/?name=${student.name}&background=random`}
                                                                alt={student.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${student.name}&background=random`;
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                                                            <div className="flex items-center gap-1.5 mt-1 text-slate-400">
                                                                <Mail className="w-3 h-3" />
                                                                <span className="text-[10px] font-medium">{student.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-sm font-bold tracking-wider">{student.registerNo || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-sm font-bold">{student.dept || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-sm font-bold">{student.year || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                        <span className="text-sm font-bold tracking-tight">{student.mobileNo || 'N/A'}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {students.length === 0 && !loading && (
                                    <div className="py-20 text-center">
                                        <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                                            <Users className="w-10 h-10 text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No students registered yet</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bus List Modal */}
            <AnimatePresence>
                {showBusList && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 overflow-y-auto py-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBusList(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Active Bus Fleet</h2>
                                    <p className="text-sm text-slate-500 font-medium">Status: Live Updates Enabled</p>
                                </div>
                                <button
                                    onClick={() => setShowBusList(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 grid gap-6 bg-slate-50/50">
                                {activeBusesData.map((bus, idx) => (
                                    <div
                                        key={bus.id}
                                        onClick={() => setSelectedBus(bus)}
                                        className={`p-8 rounded-[2.5rem] shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:scale-[1.02] ${idx === 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-800 border border-slate-100'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="space-y-4">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide uppercase ${idx === 0 ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-indigo-50 text-indigo-600'
                                                    }`}>
                                                    Route {bus.routeNo}
                                                </span>
                                                <div>
                                                    <h4 className={`text-3xl font-black tracking-tight uppercase ${idx === 0 ? 'text-white' : 'text-slate-900'}`}>{bus.route}</h4>
                                                    <p className={`text-sm font-bold mt-1 opacity-70 ${idx === 0 ? 'text-white' : 'text-slate-500'}`}>{bus.busNo}</p>
                                                </div>
                                            </div>
                                            <div className={`${idx === 0 ? 'bg-white/20' : 'bg-slate-50'} p-4 rounded-2xl`}>
                                                <Truck className={`w-8 h-8 ${idx === 0 ? 'text-white' : 'text-slate-400'}`} />
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${idx === 0 ? 'bg-white/20' : 'bg-slate-100'}`}>
                                                    {bus.driver.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase opacity-60">Driver</p>
                                                    <p className="text-sm font-bold">{bus.driver}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase opacity-60">Status</p>
                                                <div className="flex items-center gap-1.5 justify-end">
                                                    <div className={`w-2 h-2 rounded-full animate-pulse ${bus.delay === 'None' ? 'bg-emerald-400' : 'bg-orange-400'}`} />
                                                    <span className="text-sm font-bold uppercase tracking-widest">{bus.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Background Decor */}
                                        {idx === 0 && (
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-8 -mt-8 rounded-full blur-2xl" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Detailed Bus Schedule Modal */}
            <AnimatePresence>
                {selectedBus && (
                    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 overflow-y-auto py-10">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedBus(null)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-[#f8faff] w-full max-w-6xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row min-h-[80vh]"
                        >
                            {/* Left Panel: Driver Details */}
                            <div className="w-full md:w-1/3 bg-white p-12 flex flex-col border-r border-slate-100">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Driver Details</h3>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-4xl font-black text-slate-900 tracking-tight">{selectedBus.driver}</h4>
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl">
                                        <Phone className="w-5 h-5" />
                                        {selectedBus.phone}
                                    </div>
                                </div>

                                <div className="mt-auto pt-10">
                                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Current Bus</p>
                                        <p className="text-lg font-bold text-slate-800">{selectedBus.busNo}</p>
                                        <p className="text-sm font-medium text-slate-500">{selectedBus.route}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Panel: Schedule */}
                            <div className="flex-1 p-12 overflow-y-auto">
                                <div className="flex items-center justify-between mb-10">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Full Schedule - Route {selectedBus.routeNo}</h3>
                                    </div>
                                    <button
                                        onClick={() => setSelectedBus(null)}
                                        className="p-3 hover:bg-white hover:shadow-lg rounded-2xl transition-all group"
                                    >
                                        <X className="w-6 h-6 text-slate-400 group-hover:text-slate-600" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                                    {selectedBus.schedule.map((item: any, i: number) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-transparent hover:border-indigo-100 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors" />
                                                <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{item.stop}</span>
                                            </div>
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black tracking-tighter">
                                                {item.time} {item.time.includes('AM') || item.time.includes('PM') ? '' : 'AM'}
                                            </span>
                                        </div>
                                    ))}
                                    {selectedBus.schedule.length === 0 && (
                                        <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                                            <p className="text-slate-400 font-bold italic">No schedule data available for this route.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
