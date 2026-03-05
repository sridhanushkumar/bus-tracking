import { create } from 'zustand';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { AuthState, User } from '../types';



export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!localStorage.getItem('user'),
    isLoading: false,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // Fetch user profile from Firestore
            const docRef = doc(db, "users", userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data() as User;
                localStorage.setItem('user', JSON.stringify(userData));
                set({ user: userData, isAuthenticated: true, isLoading: false });
            } else {
                throw new Error("User profile not found");
            }
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    register: async (name, email, password, role, extraDetails = {}) => {
        set({ isLoading: true, error: null });
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData: User = {
                id: user.uid,
                name,
                email,
                role,
                avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
                ...extraDetails
            };

            // Store user details in Firestore
            await setDoc(doc(db, "users", user.uid), userData);

            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: error.message });
            throw error;
        }
    },

    logout: async () => {
        await signOut(auth);
        localStorage.removeItem('user');
        set({ user: null, isAuthenticated: false });
    },

    seedAdmin: async () => {
        set({ isLoading: true, error: null });
        const adminEmail = "admin@test.com";
        const adminPass = "password123";
        const adminName = "System Admin";

        try {
            // Try to register
            const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
            const user = userCredential.user;
            const userData: User = {
                id: user.uid,
                name: adminName,
                email: adminEmail,
                role: 'admin',
                avatar: `https://ui-avatars.com/api/?name=${adminName}&background=indigo&color=fff`
            };
            await setDoc(doc(db, "users", user.uid), userData);
            localStorage.setItem('user', JSON.stringify(userData));
            set({ user: userData, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                // If exists, just login
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
                    const docRef = doc(db, "users", userCredential.user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data() as User;
                        localStorage.setItem('user', JSON.stringify(userData));
                        set({ user: userData, isAuthenticated: true, isLoading: false });
                    } else {
                        throw new Error("Admin profile not found in Firestore");
                    }
                } catch (loginErr: any) {
                    set({ isLoading: false, error: loginErr.message });
                    throw loginErr;
                }
            } else {
                set({ isLoading: false, error: error.message });
                throw error;
            }
        }
    }
}));
