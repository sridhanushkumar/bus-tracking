export type Role = 'admin' | 'student' | 'staff' | 'driver';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    // Student specific fields
    registerNo?: string;
    mobileNo?: string;
    dept?: string;
    year?: string;
    dob?: string;
    // Staff specific fields
    deptName?: string;
    otherDetails?: string;
}

export interface Stop {
    place: string;
    time: string; // e.g., "6.00 Am"
    lat: number;
    lng: number;
}

export interface BusRoute {
    id: string; // Route number
    routeNo: string;
    driverName: string;
    driverMobile: string;
    busName: string;
    busNumber: string;
    stops: Stop[];
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error?: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: Role, extraDetails?: Partial<User>) => Promise<void>;
    logout: () => void;
    seedAdmin: () => Promise<void>;
}
