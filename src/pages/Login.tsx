import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types';
import { User, Shield, GraduationCap, Briefcase, Truck, QrCode } from 'lucide-react';

const roles: { id: Role; label: string; icon: React.ElementType }[] = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'staff', label: 'Staff', icon: Briefcase },
    { id: 'driver', label: 'Driver', icon: Truck },
    { id: 'admin', label: 'Admin', icon: Shield },
];

const Login = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const [selectedRole, setSelectedRole] = useState<Role>('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            await login(email, password);
            // Get the user from the store state to ensure we have the correct role from Firestore
            const user = useAuthStore.getState().user;

            if (user?.role === 'driver') navigate('/driver-dashboard');
            else if (user?.role === 'admin') navigate('/admin-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100"
            >
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to access your dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    {/* Role Selection is less relevant for Login if auth is generic, 
                        but kept if user wants to pre-select dashboard or if needed for specific logic (though auth usually determines role). 
                        If the user exists in firebase, their role is in the DB. 
                        However, the user request implied specific registration. 
                        Let's keep it for now as UI preference but rely on backend role later ideally. */}

                    {/* ... (Role selection code kept same) ... */}

                    {/* Email Input - kept similiar but inside the larger block context */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Select your role</label>
                        <div className="grid grid-cols-2 gap-3">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`flex flex-col items-center p-3 rounded-xl border transition-all ${selectedRole === role.id
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600'
                                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    <role.icon className="h-6 w-6 mb-1" />
                                    <span className="text-xs font-semibold">{role.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                                    placeholder="you@college.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>


                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500 uppercase tracking-wider text-[10px] font-bold">Debug Tools</span>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    await useAuthStore.getState().seedAdmin();
                                    navigate('/admin-dashboard');
                                } catch (err: any) {
                                    console.error("Seeding failed", err);
                                    alert("Failed to create/login as admin: " + err.message);
                                }
                            }}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-2 px-4 border-2 border-dashed border-indigo-200 text-xs font-bold rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                        >
                            <Shield className="h-4 w-4 mr-2" />
                            {isLoading ? 'Processing...' : 'Seed & Login as Admin'}
                        </button>
                        <p className="mt-1 text-[10px] text-center text-slate-400">
                            Uses: admin@test.com / password123
                        </p>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={() => navigate('/scanner/login')}
                            className="w-full flex justify-center items-center py-3 px-4 border border-slate-200 shadow-sm text-sm font-bold rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group"
                        >
                            <QrCode className="h-5 w-5 mr-2 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                            Access Scanner Mode
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <p className="text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Register now
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div >
    );
};

export default Login;
