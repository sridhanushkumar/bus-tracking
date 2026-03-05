export interface RoutePoint {
    lat: number;
    lng: number;
    name?: string;
    isStop?: boolean;
}

// A simple circular route (Mock coordinates around a city block)
export const MOCK_ROUTE: RoutePoint[] = [
    { lat: 13.1087, lng: 80.1200, name: "St. Peter's College", isStop: true }, // Main Campus
    { lat: 13.1120, lng: 80.1250 },
    { lat: 13.1150, lng: 80.1300, name: "Avadi Check Post", isStop: true },
    { lat: 13.1200, lng: 80.1350 },
    { lat: 13.1250, lng: 80.1400, name: "Avadi Bus Depot", isStop: true },
    { lat: 13.1180, lng: 80.1300 },
    { lat: 13.1087, lng: 80.1200, isStop: true }, // Back to Campus
];

export const BUS_STOPS = MOCK_ROUTE.filter(p => p.isStop);
