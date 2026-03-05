import { useState } from 'react';
import LiveMap from '../map/LiveMap';
import { useAuthStore } from '../../store/authStore';
import { Play, Square, Users, Navigation } from 'lucide-react';


const DriverDashboard = () => {
    const { user } = useAuthStore();
    const [isTripActive, setIsTripActive] = useState(false);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Driver Console 🚌</h1>
                    <p className="text-slate-600">Welcome, {user?.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg">
                    Status:
                    <span className={isTripActive ? "text-green-600" : "text-slate-500"}>
                        {isTripActive ? "ON ROUTE" : "IDLE"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Controls */}
                <div className="lg:col-span-1 space-y-4">
                    <button
                        onClick={() => setIsTripActive(!isTripActive)}
                        className={`w-full py-6 rounded-2xl font-bold text-xl shadow-lg flex flex-col items-center justify-center gap-2 transition-all ${isTripActive
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                            }`}
                    >
                        {isTripActive ? (
                            <>
                                <Square className="w-8 h-8 fill-current" />
                                End Trip
                            </>
                        ) : (
                            <>
                                <Play className="w-8 h-8 fill-current" />
                                Start Trip
                            </>
                        )}
                    </button>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Trip Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-slate-700">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    Passengers
                                </div>
                                <span className="font-bold text-xl">42</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-xs text-slate-400 text-right">Capacity: 75%</p>
                        </div>
                    </div>

                    <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-start gap-3">
                            <Navigation className="w-6 h-6 mt-1 flex-shrink-0" />
                            <div>
                                < p className="text-indigo-200 text-xs uppercase font-bold">Next Stop</p>
                                <h3 className="text-lg font-bold mt-1">Central Station Stop</h3>
                                <p className="text-sm text-indigo-300 mt-2">ETA: 5 mins</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 h-full relative">
                        <LiveMap isDriver={true} />
                        {!isTripActive && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                                <div className="bg-white p-6 rounded-xl shadow-xl text-center">
                                    <p className="text-slate-500 font-medium">Start the trip to enable live tracking</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
