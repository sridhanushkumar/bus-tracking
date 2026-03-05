import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import ChatBot from './ChatBot';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Navbar />

            {/* Spacer for fixed navbar */}
            <div className="h-16"></div>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">St. Peter's College</h3>
                            <p className="text-sm">
                                Autonomous Institution | AICTE Approved | Anna University Affiliated
                            </p>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                                <li><Link to="/routes" className="hover:text-white transition">Routes</Link></li>
                                <li><a href="#" className="hover:text-white transition">Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <div>
                                <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
                                <p className="text-sm">St. Peter's College of Engineering and Technology</p>
                                <p className="text-sm">Avadi, Chennai, Tamil Nadu, India</p>
                                <p className="text-sm">Pin Code - 600 054</p>
                                <div className="mt-4">
                                    <p className="text-sm"><span className="text-slate-500">Email:</span> spcet2008@gmail.com</p>
                                    <p className="text-sm font-bold text-indigo-400 mt-2">Counseling Code: 1127</p>
                                </div>
                            </div>            </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
                        <p>© 2026 St. Peter's College of Engineering and Technology. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            <ChatBot />
        </div>
    );
};

export default Layout;
