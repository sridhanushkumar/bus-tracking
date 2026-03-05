import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { Role } from '../types';
import { UserPlus, GraduationCap, Briefcase, Truck } from 'lucide-react';

const roles: { id: Role; label: string; icon: React.ElementType }[] = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'staff', label: 'Staff', icon: Briefcase },
    { id: 'driver', label: 'Driver', icon: Truck },
];

const Register = () => {
    const navigate = useNavigate();
    const { register, isLoading, error } = useAuthStore();
    const [selectedRole, setSelectedRole] = useState<Role>('student');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    // Student fields
    const [registerNo, setRegisterNo] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [dept, setDept] = useState('');
    const [year, setYear] = useState('');
    const [dob, setDob] = useState('');

    // Staff fields
    const [deptName, setDeptName] = useState('');
    const [otherDetails, setOtherDetails] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !name || !password) return;

        try {
            const extraDetails = selectedRole === 'student' ? {
                registerNo,
                mobileNo,
                dept,
                year,
                dob
            } : selectedRole === 'staff' ? {
                deptName,
                otherDetails
            } : {};

            await register(name, email, password, selectedRole, extraDetails);
            // Redirect based on role
            if (selectedRole === 'driver') navigate('/driver-dashboard');
            else if (selectedRole === 'admin') navigate('/admin-dashboard');
            else navigate('/dashboard');
        } catch (err) {
            console.error("Registration failed", err);
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
                        <UserPlus className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Join the smart campus network
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">I am a...</label>
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
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                                Full Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="john@college.edu"
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
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {selectedRole === 'student' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4 pt-4 border-t border-slate-100"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="registerNo" className="block text-sm font-medium text-slate-700">Reg Number</label>
                                        <input
                                            id="registerNo"
                                            type="text"
                                            required
                                            value={registerNo}
                                            onChange={(e) => setRegisterNo(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="2112001"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mobileNo" className="block text-sm font-medium text-slate-700">Mobile Number</label>
                                        <input
                                            id="mobileNo"
                                            type="tel"
                                            required
                                            value={mobileNo}
                                            onChange={(e) => setMobileNo(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="9876543210"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="dept" className="block text-sm font-medium text-slate-700">Department</label>
                                        <input
                                            id="dept"
                                            type="text"
                                            required
                                            value={dept}
                                            onChange={(e) => setDept(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="CSE / IT"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="year" className="block text-sm font-medium text-slate-700">Year</label>
                                        <input
                                            id="year"
                                            type="text"
                                            required
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="III / IV"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="dob" className="block text-sm font-medium text-slate-700">Date of Birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        required
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {selectedRole === 'staff' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4 pt-4 border-t border-slate-100"
                            >
                                <div>
                                    <label htmlFor="deptName" className="block text-sm font-medium text-slate-700">Department Name</label>
                                    <input
                                        id="deptName"
                                        type="text"
                                        required
                                        value={deptName}
                                        onChange={(e) => setDeptName(e.target.value)}
                                        className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Engineering Dept"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="otherDetails" className="block text-sm font-medium text-slate-700">Other Details</label>
                                    <textarea
                                        id="otherDetails"
                                        value={otherDetails}
                                        onChange={(e) => setOtherDetails(e.target.value)}
                                        className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Experience, Specialization, etc."
                                        rows={3}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <p className="text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Register;
