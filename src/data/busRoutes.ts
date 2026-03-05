import type { BusRoute } from '../types';

// Approximate coordinates for Chennai locations
const getCoords = (place: string) => {
    const locations: Record<string, { lat: number, lng: number }> = {
        "COLLEGE": { lat: 13.1087, lng: 80.1200 },
        "UTHUKKOTTAI": { lat: 13.3375, lng: 79.9114 },
        "AVADI": { lat: 13.1143, lng: 80.1105 },
        "REDHILLS": { lat: 13.1866, lng: 80.1774 },
        "VELACHERY": { lat: 12.9796, lng: 80.2185 },
        "THIRUVALLUR": { lat: 13.1394, lng: 79.9073 },
        "MANALI": { lat: 13.1667, lng: 80.2667 },
        "CHINTADRIPET": { lat: 13.0754, lng: 80.2718 },
        "PATTINAMPAKKAM": { lat: 13.0285, lng: 80.2755 },
        "KOVILAMBAKKAM": { lat: 12.9377, lng: 80.1983 },
        "VEERAPURAM": { lat: 13.1555, lng: 80.1122 },
        // Add more common points
        "AMBATTUR": { lat: 13.1143, lng: 80.1480 },
        "KOYAMBEDU": { lat: 13.0732, lng: 80.1912 },
        "PORUR": { lat: 13.0382, lng: 80.1561 },
        "GUINDY": { lat: 13.0067, lng: 80.2206 },
    };

    // Default to roughly Chennai center if not found
    return locations[place] || {
        lat: 13.08 + (Math.random() - 0.5) * 0.1,
        lng: 80.27 + (Math.random() - 0.5) * 0.1
    };
};

export const BUS_ROUTES: BusRoute[] = [
    {
        id: "102",
        routeNo: "102",
        driverName: "V. Raju",
        driverMobile: "8610814101",
        busName: "UTHUKKOTTAI",
        busNumber: "TN-24-T-4834",
        stops: [
            { place: "UTHUKKOTTAI", time: "6.00 Am", ...getCoords("UTHUKKOTTAI") },
            { place: "PONDAVAKKAM", time: "6.10 Am", ...getCoords("PONDAVAKKAM") },
            { place: "PERINJERI", time: "6.15 Am", ...getCoords("PERINJERI") },
            { place: "SEETHANJERI", time: "6.25 Am", ...getCoords("SEETHANJERI") },
            { place: "MYLAPURE MAIN", time: "6.30 Am", ...getCoords("MYLAPURE MAIN") },
            { place: "ODHAPPAI", time: "6.40 Am", ...getCoords("ODHAPPAI") },
            { place: "POONDI", time: "6.45 Am", ...getCoords("POONDI") },
            { place: "PULLARAMBAKKAM", time: "6.50 Am", ...getCoords("PULLARAMBAKKAM") },
            { place: "THIRUVALLUR COLLETOR OFFICE", time: "6.55 Am", ...getCoords("THIRUVALLUR") },
            { place: "KAKKALUR", time: "7.05 Am", ...getCoords("KAKKALUR") },
            { place: "RAMAPURAM", time: "7.07 Am", ...getCoords("RAMAPURAM") },
            { place: "THOZHUR", time: "7.10 Am", ...getCoords("THOZHUR") },
            { place: "SEVVAPET", time: "7.12 Am", ...getCoords("SEVVAPET") },
            { place: "VEPPAMPATTU", time: "7.20 Am", ...getCoords("VEPPAMPATTU") },
            { place: "TIRUNINRAVUR", time: "7.25 Am", ...getCoords("TIRUNINRAVUR") },
            { place: "JAYA COLLEGE", time: "7.30 Am", ...getCoords("JAYA COLLEGE") },
            { place: "NEMILICHERY", time: "7.35 Am", ...getCoords("NEMILICHERY") },
            { place: "THANDURAI", time: "7.40 Am", ...getCoords("THANDURAI") },
            { place: "PATTABIRAM", time: "7.49 Am", ...getCoords("PATTABIRAM") },
            { place: "HINDU COLLEGE", time: "7.53 Am", ...getCoords("HINDU COLLEGE") },
            { place: "AVADI SEKKADU", time: "7.55 Am", ...getCoords("AVADI") },
            { place: "AVADI MARKET", time: "8.00 Am", ...getCoords("AVADI") },
            { place: "COLLEGE", time: "8.10 Am", ...getCoords("COLLEGE") },
        ]
    },
    {
        id: "103",
        routeNo: "103",
        driverName: "R. Pandian",
        driverMobile: "8939207141",
        busName: "MANALI",
        busNumber: "TN-12-T-4648",
        stops: [
            { place: "MANALI PUDHU NAGAR", time: "5.30 Am", ...getCoords("MANALI") },
            { place: "MANALI", time: "6.00 Am", ...getCoords("MANALI") },
            { place: "CHINNA MATHUR", time: "6.05 Am", ...getCoords("CHINNA MATHUR") },
            { place: "MADHAVARAM MILK COLONY", time: "6.10 Am", ...getCoords("MADHAVARAM") },
            { place: "THABAL PETTI", time: "6.15 Am", ...getCoords("THABAL PETTI") },
            { place: "M.R. NAGAR", time: "6.25 Am", ...getCoords("M.R. NAGAR") },
            { place: "BHARATHI NAGAR", time: "6.30 Am", ...getCoords("BHARATHI NAGAR") },
            { place: "MOOLAKADAI", time: "6.40 Am", ...getCoords("MOOLAKADAI") },
            { place: "BRINDHA THEATRE", time: "6.42 Am", ...getCoords("BRINDHA THEATRE") },
            { place: "ESWARI KALYANA MANDAPAM", time: "6.45 Am", ...getCoords("ESWARI KALYANA MANDAPAM") },
            { place: "PERAMBUR RAILWAY STATION", time: "6.50 Am", ...getCoords("PERAMBUR") },
            { place: "VENUS", time: "6.52 Am", ...getCoords("VENUS") },
            { place: "PERIYAR NAGAR", time: "6.55 Am", ...getCoords("PERIYAR NAGAR") },
            { place: "KOLATHUR", time: "7.05 Am", ...getCoords("KOLATHUR") },
            { place: "RETTARI", time: "7.20 Am", ...getCoords("RETTARI") },
            { place: "THANTHAN KUPPAM", time: "7.35 Am", ...getCoords("THANTHAN KUPPAM") },
            { place: "COLLEGE", time: "8.10 Am", ...getCoords("COLLEGE") },
        ]
    },
    {
        id: "101",
        routeNo: "101",
        driverName: "D. Sankaran",
        driverMobile: "9710303124",
        busName: "CHINTADRIPET",
        busNumber: "TN 24-AC-7365",
        stops: [
            { place: "CHINTADRIPET", time: "6.30 Am", ...getCoords("CHINTADRIPET") },
            { place: "EGMORE", time: "6.40 Am", ...getCoords("EGMORE") },
            { place: "CHETPET", time: "6.55 Am", ...getCoords("CHETPET") },
            { place: "LOYOLA COLLEGE", time: "6.55 Am", ...getCoords("LOYOLA COLLEGE") },
            { place: "CHOOLAIMEDU", time: "7.00 Am", ...getCoords("CHOOLAIMEDU") },
            { place: "ANNA ARCH", time: "7.05 Am", ...getCoords("ANNA ARCH") },
            { place: "THIRUMANGALAM", time: "7.10 Am", ...getCoords("THIRUMANGALAM") },
            { place: "PARK ROAD", time: "7.15 Am", ...getCoords("PARK ROAD") },
            { place: "COLLECTOR NAGAR", time: "7.17 Am", ...getCoords("COLLECTOR NAGAR") },
            { place: "MMM HOSPITAL", time: "7.19 Am", ...getCoords("MMM HOSPITAL") },
            { place: "MOGAPPAIR EAST", time: "7.20 Am", ...getCoords("MOGAPPAIR") },
            { place: "MOGAPPAIR", time: "7.22 Am", ...getCoords("MOGAPPAIR") },
            { place: "MOGAPPAIR WEST", time: "7.30 Am", ...getCoords("MOGAPPAIR") },
            { place: "AMBATTUR TELEPHONE EX", time: "7.35 Am", ...getCoords("AMBATTUR") },
            { place: "AMBATTUR OT", time: "7.40 am", ...getCoords("AMBATTUR") },
            { place: "SRI IVAN STEDEFORD", time: "7.42 Am", ...getCoords("SRI IVAN STEDEFORD") },
            { place: "MANIKANDAPURAM", time: "7.45 am", ...getCoords("MANIKANDAPURAM") },
            { place: "THIRUMULLAIVOYAL", time: "7.47 Am", ...getCoords("THIRUMULLAIVOYAL") },
            { place: "VAISHNAVI TEMPLE", time: "7.50 Am", ...getCoords("VAISHNAVI TEMPLE") },
            { place: "MURUGAPPA POLYTECHNIC", time: "7.52 Am", ...getCoords("MURUGAPPA POLYTECHNIC") },
            { place: "AVADI BUS DEPO", time: "7.57 Am", ...getCoords("AVADI") },
            { place: "COLLEGE", time: "8.10 Am", ...getCoords("COLLEGE") },
        ]
    }
    // ... other routes could be added here similarly
];
