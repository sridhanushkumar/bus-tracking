import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Mail, GraduationCap, Briefcase, Calendar, Smartphone, Hash, MapPin } from 'lucide-react';

import QRCode from "react-qr-code";

const Profile = () => {
    const { user } = useAuthStore();

    if (!user) return null;

    const isStudent = user.role === 'student';
    const isStaff = user.role === 'staff';

    // Determine the unique value for the QR code
    // For students: Register Number, For others: Email
    const qrValue = user.registerNo || user.email;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
            >
                {/* Header/Cover */}
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-8">
                        <div className="p-1 bg-white rounded-2xl shadow-lg">
                            <img
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                alt={user.name}
                                className="w-24 h-24 rounded-xl object-cover"
                            />
                        </div>
                        <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black uppercase tracking-widest">
                            {user.role}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                                Account Information
                            </h3>

                            {isStudent && (
                                <div className="space-y-4">
                                    <InfoItem icon={Hash} label="Register Number" value={user.registerNo} />
                                    <InfoItem icon={Smartphone} label="Mobile Number" value={user.mobileNo} />
                                    <InfoItem icon={GraduationCap} label="Department" value={user.dept} />
                                    <InfoItem icon={Calendar} label="Year" value={user.year} />
                                    <InfoItem icon={Calendar} label="Date of Birth" value={user.dob} />
                                </div>
                            )}

                            {isStaff && (
                                <div className="space-y-4">
                                    <InfoItem icon={Briefcase} label="Department Name" value={user.deptName} />
                                    <InfoItem icon={MapPin} label="Office/Location" value="Main Campus" />
                                    <div className="pt-4">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Other Details</p>
                                        <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm italic">
                                            {user.otherDetails || "No additional details provided."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {!isStudent && !isStaff && (
                                <p className="text-slate-500 italic">Admin/Driver details are managed by the system.</p>
                            )}
                        </div>

                        {/* QR Code & Stats */}
                        <div className="space-y-6">

                            {/* QR Code Section */}
                            <div className="bg-white p-6 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center">
                                <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tight">My ID Card QR</h3>
                                <div className="bg-white p-2 rounded-xl border border-slate-100 shadow-inner">
                                    <QRCode
                                        value={qrValue || "error"}
                                        size={180}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-4 text-center font-medium">
                                    Scan this QR code at the bus entry to mark your attendance.
                                </p>
                                <div className="mt-3 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold font-mono">
                                    {user.registerNo || user.role}
                                </div>
                            </div>

                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                                Quick Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <StatCard label="Trips Taken" value="24" />
                                <StatCard label="Notifications" value="2" />
                            </div>

                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <h4 className="text-indigo-900 font-bold mb-2">Need to update info?</h4>
                                <p className="text-indigo-700 text-sm mb-4">Contact the administration office to modify your registration details.</p>
                                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors">
                                    Contact Admin
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string | undefined }) => (
    <div className="flex items-center gap-4 group">
        <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-indigo-50 transition-colors">
            <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="font-bold text-slate-700">{value || "Not provided"}</p>
        </div>
    </div>
);

const StatCard = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
        <p className="text-2xl font-black text-indigo-600">{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
);

export default Profile;
