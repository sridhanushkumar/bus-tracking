import { useState, useMemo } from 'react';
import LiveMap from '../features/map/LiveMap';
import { BUS_ROUTES } from '../data/busRoutes';
import { Clock, Phone, User, Bus, Search, Info, Filter } from 'lucide-react';
import type { BusRoute } from '../types';

const parseTimeToMinutes = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split('.').map(Number);
    if (hours === 12) hours = 0;
    if (modifier.toLowerCase() === 'pm') hours += 12;
    return hours * 60 + minutes;
};

const BusRoutes = () => {
    const [selectedRoute, setSelectedRoute] = useState<BusRoute>(BUS_ROUTES[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showActiveOnly, setShowActiveOnly] = useState(false);

    const currentTimeMinutes = useMemo(() => {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }, []);

    const filteredRoutes = useMemo(() => {
        return BUS_ROUTES.filter(route => {
            const matchesSearch = route.routeNo.includes(searchTerm) ||
                route.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                route.stops.some(s => s.place.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesSearch) return false;

            if (showActiveOnly) {
                const start = parseTimeToMinutes(route.stops[0].time);
                const end = parseTimeToMinutes(route.stops[route.stops.length - 1].time);
                return currentTimeMinutes >= start && currentTimeMinutes <= end;
            }

            return true;
        });
    }, [searchTerm, showActiveOnly, currentTimeMinutes]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Campus Bus Tracking</h1>
                    <div className="flex flex-wrap items-center gap-4">
                        <p className="text-slate-600 flex items-center gap-2">
                            <Info className="w-4 h-4 text-indigo-500" />
                            Live location is estimated based on schedule.
                        </p>
                        <button
                            onClick={() => setShowActiveOnly(!showActiveOnly)}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${showActiveOnly
                                ? 'bg-green-50 text-green-700 border-green-200 ring-4 ring-green-500/10'
                                : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-white'
                                }`}
                        >
                            <Filter className={`w-3 h-3 ${showActiveOnly ? 'animate-pulse' : ''}`} />
                            {showActiveOnly ? 'ACTIVE BUSES ONLY' : 'SHOW ALL BUSES'}
                        </button>
                    </div>
                </div>
                <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search route or stop..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Route List */}
                <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Available Routes</h2>
                    {filteredRoutes.map((route) => (
                        <button
                            key={route.id}
                            onClick={() => setSelectedRoute(route)}
                            className={`w-full text-left p-4 rounded-2xl transition-all border ${selectedRoute?.id === route.id
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedRoute?.id === route.id ? 'bg-indigo-400/30 text-white' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    Route {route.routeNo}
                                </span>
                                <Bus className={`w-4 h-4 ${selectedRoute?.id === route.id ? 'text-indigo-200' : 'text-slate-300'}`} />
                            </div>
                            <p className="font-bold truncate">{route.busName}</p>
                            <p className={`text-[10px] mt-1 ${selectedRoute?.id === route.id ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {route.busNumber}
                            </p>
                        </button>
                    ))}
                    {filteredRoutes.length === 0 && (
                        <p className="text-center text-slate-400 py-10">No routes found</p>
                    )}
                </div>

                {/* Main Content: Map and Details */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        <LiveMap selectedRoute={selectedRoute} className="h-[450px]" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Driver Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-indigo-600" />
                                Driver Details
                            </h3>
                            <p className="text-slate-800 font-bold">{selectedRoute?.driverName}</p>
                            <div className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-bold">{selectedRoute?.driverMobile}</span>
                            </div>
                        </div>

                        {/* Schedule Card */}
                        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                Full Schedule - Route {selectedRoute?.routeNo}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                                {selectedRoute?.stops.map((stop, idx) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors"></div>
                                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{stop.place}</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                            {stop.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusRoutes;
