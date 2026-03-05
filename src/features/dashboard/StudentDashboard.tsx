import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LiveMap from '../map/LiveMap';
import { useAuthStore } from '../../store/authStore';
import { BUS_ROUTES } from '../../data/busRoutes';
import { format } from 'date-fns';
import { Clock, MapPin, Bus, Phone, User, Info, QrCode } from 'lucide-react';
import type { BusRoute } from '../../types';

// Helper to parse time string
const parseTimeToMinutes = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split('.').map(Number);
    if (hours === 12) hours = 0;
    if (modifier.toLowerCase() === 'pm') hours += 12;
    return hours * 60 + minutes;
};
const StudentDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const today = format(new Date(), 'dd MMM yyyy');

    // Bus tracking state
    const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);

    const currentTimeMinutes = useMemo(() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }, []);

    const activeBuses = useMemo(() => {
        return BUS_ROUTES.filter(route => {
            const start = parseTimeToMinutes(route.stops[0].time);
            const end = parseTimeToMinutes(route.stops[route.stops.length - 1].time);
            return currentTimeMinutes >= start && currentTimeMinutes <= end;
        });
    }, [currentTimeMinutes]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 uppercase tracking-tight">
                        {user?.role === 'staff' ? 'Staff Portal' : 'Student Portal'}
                    </h1>
                    <p className="text-slate-500 font-medium">Welcome back, {user?.name} 👋</p>
                </div>
                <button
                    onClick={() => navigate('/routes')}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                    <Bus className="w-4 h-4" />
                    View All Bus Routes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: QR Pass and Active Buses */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-center">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Digital {user?.role === 'staff' ? 'Staff' : 'Student'} Pass</h3>
                        <p className="text-sm text-slate-500 mb-6">{today}</p>

                        <button
                            onClick={() => navigate('/attendance')}
                            className="w-full bg-indigo-50 hover:bg-indigo-100 p-6 rounded-2xl border-2 border-dashed border-indigo-200 transition-all group flex flex-col items-center gap-4 mb-6"
                        >
                            <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                                <QrCode className="w-12 h-12 text-indigo-600" />
                            </div>
                            <span className="text-indigo-700 font-bold text-sm">View Attendance QR Code</span>
                        </button>

                        <div className="flex justify-center gap-4 text-xs font-bold text-slate-600">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                ACTIVE
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                OTP: <span className="text-indigo-600 font-bold">4829</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Bus className="w-5 h-5 text-indigo-600" />
                                Active Buses
                            </h3>
                            <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {activeBuses.length} LIVE
                            </span>
                        </div>

                        <div className="space-y-3">
                            {activeBuses.map((route) => (
                                <button
                                    key={route.id}
                                    onClick={() => setSelectedRoute(route)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedRoute?.id === route.id
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                        : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-white hover:border-indigo-200'
                                        }`}
                                >
                                    <div className="text-left">
                                        <p className="text-xs font-black">ROUTE {route.routeNo}</p>
                                        <p className="text-[10px] opacity-80 truncate max-w-[120px]">{route.busName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold">{route.busNumber}</p>
                                    </div>
                                </button>
                            ))}
                            {activeBuses.length === 0 && (
                                <p className="text-sm text-slate-400 italic text-center py-4">No buses active currently</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Map Tracking */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
                        <div className="p-4 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                                {selectedRoute ? `Tracking Route ${selectedRoute.routeNo}` : "Campus Live Map"}
                            </h3>
                            {selectedRoute ? (
                                <button
                                    onClick={() => navigate('/routes')}
                                    className="text-xs font-bold text-indigo-600 hover:underline"
                                >
                                    Full Schedule →
                                </button>
                            ) : (
                                <span className="text-xs text-slate-400 italic flex items-center gap-1">
                                    <Info className="w-3.5 h-3.5" /> Select an active bus to track
                                </span>
                            )}
                        </div>
                        <LiveMap selectedRoute={selectedRoute || undefined} className="h-[500px]" />
                    </div>

                    {selectedRoute && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <User className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Driver</p>
                                    <p className="font-bold text-slate-800">{selectedRoute.driverName}</p>
                                </div>
                            </div>
                            <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</p>
                                    <p className="font-bold">{selectedRoute.driverMobile}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
