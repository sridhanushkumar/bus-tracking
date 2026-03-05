import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { BusRoute } from '../../types';

// Fix for default leaflet marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Bus Icon
const busIcon = new L.DivIcon({
    className: 'custom-bus-icon text-indigo-600',
    html: `<div style="background-color: #4f46e5; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.34-.02-.68-.05-1.02-.02-.26-.04-.52-.06-.78-.52-6.8-9.98-6.1-9.98-6.1-9 .7-9 6.1-9 6.1 0 .26-.03.52-.06.78-.02.34-.05.68-.05 1.02 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><path d="M7 18h9"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
         </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
});

// Helper to parse time string like "6.00 Am" into minutes from midnight
const parseTimeToMinutes = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split('.').map(Number);
    if (hours === 12) hours = 0;
    if (modifier.toLowerCase() === 'pm') hours += 12;
    return hours * 60 + minutes;
};

// Component to recenter map when position changes
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const LiveMap = ({ selectedRoute, isDriver = false, className = "h-[500px]" }: { selectedRoute?: BusRoute; isDriver?: boolean; className?: string }) => {
    const [busPosition, setBusPosition] = useState<{ lat: number, lng: number } | null>(null);

    useEffect(() => {
        if (!selectedRoute) return;

        const updatePosition = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            // For testing: simulate a time if outside operating hours or just use current
            // const currentMinutes = 7 * 60 + 30; // 7:30 AM for testing

            const stops = selectedRoute.stops;
            const startMinutes = parseTimeToMinutes(stops[0].time);
            const endMinutes = parseTimeToMinutes(stops[stops.length - 1].time);

            if (currentMinutes < startMinutes) {
                setBusPosition({ lat: stops[0].lat, lng: stops[0].lng });
            } else if (currentMinutes > endMinutes) {
                setBusPosition({ lat: stops[stops.length - 1].lat, lng: stops[stops.length - 1].lng });
            } else {
                // Find where the bus is between stops
                for (let i = 0; i < stops.length - 1; i++) {
                    const t1 = parseTimeToMinutes(stops[i].time);
                    const t2 = parseTimeToMinutes(stops[i + 1].time);

                    if (currentMinutes >= t1 && currentMinutes <= t2) {
                        const ratio = (currentMinutes - t1) / (t2 - t1);
                        setBusPosition({
                            lat: stops[i].lat + (stops[i + 1].lat - stops[i].lat) * ratio,
                            lng: stops[i].lng + (stops[i + 1].lng - stops[i].lng) * ratio
                        });
                        break;
                    }
                }
            }
        };

        updatePosition();
        const interval = setInterval(updatePosition, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, [selectedRoute]);

    const defaultCenter: [number, number] = [13.1087, 80.1200]; // College coords
    const routePoints = selectedRoute?.stops.map(s => [s.lat, s.lng] as [number, number]) || [];

    return (
        <div className={`${className} w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 z-0`}>
            <MapContainer
                center={routePoints[0] || defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    maxZoom={20}
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    attribution='&copy; Google Maps'
                />

                {selectedRoute && (
                    <>
                        <Polyline positions={routePoints} color="#4f46e5" weight={5} opacity={0.6} dashArray="10, 10" />
                        {selectedRoute.stops.map((stop, idx) => (
                            <Marker key={idx} position={[stop.lat, stop.lng]}>
                                <Popup>
                                    <div className="font-sans">
                                        <p className="font-bold text-indigo-600">{stop.place}</p>
                                        <p className="text-xs text-slate-500">Scheduled: {stop.time}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </>
                )}

                {busPosition && (
                    <Marker position={[busPosition.lat, busPosition.lng]} icon={busIcon}>
                        <Popup>
                            <div className="p-1">
                                <p className="font-bold text-slate-800">Bus {selectedRoute?.routeNo}</p>
                                <p className="text-xs text-indigo-600 font-semibold">Live Location (Estimated)</p>
                                <p className="text-[10px] text-slate-500 mt-1">{selectedRoute?.busNumber}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {busPosition && (isDriver || !!selectedRoute) && <RecenterMap lat={busPosition.lat} lng={busPosition.lng} />}
            </MapContainer>
        </div>
    );
};

export default LiveMap;
