import { create } from "zustand";
import { User } from "../types";
import { authAPI } from "@/server/api";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    loading: true,
    setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
    setLoading: (loading: boolean) => set({ loading }),
    logout: () => {
        authAPI
            .logout()
            .then(() => {
                set({ user: null, isAuthenticated: false });
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    },
}));

export const checkAuth = async () => {
    useAuthStore.getState().setLoading(true);
    try {
        const response = await authAPI.me();
        useAuthStore.getState().setUser(response.data.user || null);
    } catch {
        useAuthStore.getState().setUser(null);
    } finally {
        useAuthStore.getState().setLoading(false);
    }
};
