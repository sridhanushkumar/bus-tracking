
import { motion } from 'framer-motion';
import { MapPin, Shield, Clock, Smartphone, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveMap from '../features/map/LiveMap';

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const Landing = () => {
    return (
        <div className="overflow-hidden">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-indigo-50 to-white pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                            className="text-left"
                        >
                            <motion.div variants={fadeIn} className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                                🚀 Smart Campus Mobility
                            </motion.div>
                            <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl font-extrabold text-indigo-600 leading-tight mb-6">
                                St. Peter's Engineering College
                            </motion.h1>
                            <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                Experience real-time location updates, secure QR attendance, and instant alerts. Designed for students, staff, and drivers.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-1">
                                    Get Started
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link to="/routes" className="inline-flex justify-center items-center px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                                    View Bus Routes
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Hero Visual/Illustration Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <LiveMap className="h-96" />
                            </div>

                            {/* Decorative elements */}
                            <div className="absolute top-10 -right-10 w-24 h-24 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
                        </motion.div>

                    </div>
                </div>
            </section >

            {/* Features Section */}
            < section className="py-24 bg-white" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need to commute smart</h2>
                        <p className="mt-4 text-lg text-slate-600">Advanced features for a safer and more efficient campus transport experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: MapPin,
                                title: "Live Tracking",
                                desc: "Real-time updates of bus locations on an interactive map.",
                                color: "bg-blue-100 text-blue-600"
                            },
                            {
                                icon: Shield,
                                title: "Secure Attendance",
                                desc: "QR Code and OTP based verification for student safety.",
                                color: "bg-green-100 text-green-600"
                            },
                            {
                                icon: Clock,
                                title: "ETA Alerts",
                                desc: "Get notified when the bus is approaching your stop.",
                                color: "bg-orange-100 text-orange-600"
                            },
                            {
                                icon: Smartphone,
                                title: "Role-Based Apps",
                                desc: "Dedicated interfaces for Students, Drivers, and Admins.",
                                color: "bg-purple-100 text-purple-600"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-slate-100"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.color}`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-20 bg-indigo-600" >
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to upgrade your daily commute?</h2>
                    <p className="text-indigo-100 text-lg mb-10">Join thousands of students and staff who use our platform daily.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/register" className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition shadow-lg">
                            Register Now
                        </Link>
                        <Link to="/about" className="px-8 py-3 bg-indigo-700 text-white font-bold rounded-lg hover:bg-indigo-800 transition shadow-lg border border-indigo-500">
                            Learn More
                        </Link>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default Landing;
