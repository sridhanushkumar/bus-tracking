import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // Reusing existing auth store
import { QrCode, ArrowRight, ShieldCheck } from 'lucide-react';

const ScannerLogin = () => {
    const navigate = useNavigate();
    const { login, isLoading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            await login(email, password);
            // Verify if user is admin or staff (assuming only they can scan)
            const user = useAuthStore.getState().user;
            if (user?.role === 'admin' || user?.role === 'staff') {
                navigate('/scanner');
            } else {
                setError("Access Denied: Only Admins/Staff can access the scanner.");
            }
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
                <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/50 rounded-full -ml-10 -mb-10 blur-xl" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-4">
                            <QrCode className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Scanner Access</h1>
                        <p className="text-indigo-100 text-sm mt-1 font-medium">Authorized Personnel Only</p>
                    </div>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Admin ID / Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="admin@college.edu"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Access Scanner'}
                            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-400 text-xs font-bold hover:text-slate-600 transition-colors uppercase tracking-widest"
                        >
                            Back to Main Login
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ScannerLogin;
