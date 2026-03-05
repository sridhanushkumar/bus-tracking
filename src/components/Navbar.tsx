import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, Home, Menu, X, LogOut, User, QrCode, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuthStore();

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        ...(isAuthenticated && user?.role === 'admin' ? [{ name: 'Dashboard', path: '/admin-dashboard', icon: ShieldCheck }] : []),
        ...(!isAuthenticated ? [{ name: 'About Us', path: '/about', icon: Info }] : []),
        { name: 'Bus Route', path: '/routes', icon: MapPin },
        ...(isAuthenticated ? [{ name: 'Attendance', path: '/attendance', icon: QrCode }] : []),
        ...(isAuthenticated && (user?.role === 'admin' || user?.role === 'staff' || user?.role === 'driver')
            ? [{ name: 'Verify', path: '/verify', icon: ShieldCheck }] : []),
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img src="/college_logo.png" alt="St. Peter's College" className="h-10 object-contain" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${location.pathname === link.path
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <link.icon className="h-4 w-4" />
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span className="hidden lg:block">My Account</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-2">
                                        <link.icon className="h-4 w-4" />
                                        {link.name}
                                    </div>
                                </Link>
                            ))}
                            <div className="pt-4 pb-2 border-t border-slate-100 flex flex-col gap-2">
                                {!isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:border-indigo-600"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            to="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 text-center shadow-lg"
                                        >
                                            Register
                                        </Link>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            to="/profile"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 px-3 py-3 rounded-xl text-slate-700 bg-slate-50 font-bold"
                                        >
                                            <User className="w-5 h-5 text-indigo-600" />
                                            My Account
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl text-rose-600 bg-rose-50 font-bold"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
