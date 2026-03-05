import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';
import { Clock, ShieldCheck, Info } from 'lucide-react';

const Attendance = () => {
    const { user } = useAuthStore();
    const today = format(new Date(), 'dd MMM yyyy');

    if (!user) return null;

    // Generate a structured QR data string
    const qrData = JSON.stringify({
        uid: user.id,
        name: user.name,
        role: user.role,
        timestamp: new Date().toISOString()
    });

    // Simple deterministic OTP based on UID and Date for demonstration
    // In a real app, this would be fetched from a server or generated via TOTP
    const generateOTP = () => {
        const seed = user.id + format(new Date(), 'yyyy-MM-dd');
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash % 9000 + 1000).toString();
    };

    const otp = generateOTP();

    return (
        <div className="max-w-md mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-8 text-white text-center">
                    <h1 className="text-2xl font-bold uppercase tracking-wider">Attendance Pass</h1>
                    <p className="opacity-80 text-sm mt-1">{today}</p>
                </div>

                <div className="p-8 text-center">
                    <div className="mb-6">
                        <p className="text-slate-500 font-medium">Hello,</p>
                        <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase mt-2">
                            {user.role}
                        </span>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl inline-block mb-8 relative group">
                        <div className="absolute inset-0 bg-indigo-600/5 scale-0 group-hover:scale-100 transition-transform rounded-2xl duration-500"></div>
                        <QRCodeSVG value={qrData} size={220} level="H" includeMargin={true} className="relative z-10" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                            <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Today's OTP</span>
                            </div>
                            <p className="text-2xl font-black text-indigo-900 tracking-widest">{otp}</p>
                        </div>
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-bold uppercase">Status</span>
                            </div>
                            <p className="text-lg font-black text-emerald-900 tracking-wider">VALID</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl text-left border border-slate-100">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <Info className="w-4 h-4 text-slate-400" />
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                            Show this QR code to the bus driver or staff member. They will scan it and ask for your 4-digit OTP to verify your attendance for today.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Smart Bus Tracking System
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Attendance;
