import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, User, Clock, Filter, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAttendance = () => {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'all' | 'student' | 'staff'>('all');

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const attendanceRef = collection(db, "attendance");
            const q = query(attendanceRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAttendance(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAttendance = attendance.filter(record => {
        const matchesSearch = record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.registerNo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || record.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 p-4 md:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin-dashboard')}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-slate-800" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Attendance Logs</h1>
                            <p className="text-sm text-slate-500 font-medium">Daily scan history for students and staff</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search Name or Reg No..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition-all"
                            />
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button
                                onClick={() => setFilterRole('all')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${filterRole === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterRole('student')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${filterRole === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Students
                            </button>
                            <button
                                onClick={() => setFilterRole('staff')}
                                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${filterRole === 'staff' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                            >
                                Staff
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time & Date</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence mode="popLayout">
                                    {filteredAttendance.map((record, i) => (
                                        <motion.tr
                                            key={record.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-slate-50/30 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                        {record.name?.split(' ').map((n: any) => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 leading-none">{record.name}</p>
                                                        <span className={`inline-block text-[10px] font-black uppercase tracking-tight mt-1.5 ${record.role === 'staff' ? 'text-purple-600' :
                                                                record.role === 'admin' ? 'text-rose-600' :
                                                                    record.role === 'driver' ? 'text-amber-600' :
                                                                        'text-indigo-500'
                                                            }`}>
                                                            {record.role || 'Student'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <FileText className="w-3 h-3" />
                                                        <span className="text-xs font-bold font-mono text-slate-700">{record.registerNo || 'N/A'}</span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium">Bus: {record.busDetails || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-slate-700">
                                                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                                                        <span className="text-xs font-black">
                                                            {record.timestamp ? format(record.timestamp.toDate(), 'hh:mm a') : 'Now'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold">
                                                            {record.timestamp ? format(record.timestamp.toDate(), 'dd MMM yyyy') : '--'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{record.status || 'Present'}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {loading && (
                            <div className="p-20 text-center">
                                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Loading Records...</p>
                            </div>
                        )}

                        {!loading && filteredAttendance.length === 0 && (
                            <div className="p-20 text-center">
                                <div className="p-4 bg-slate-50 rounded-full inline-block mb-4">
                                    <Filter className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-slate-800 font-black uppercase">No Attendance Records Found</h3>
                                <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAttendance;
