import React, {createContext, useContext, useEffect, useState} from "react";
import type { AuthUser } from "../api/apiClient";
import {Me, Logout as ApiLogout} from "../api/apiClient"

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;
    setUser: (u: AuthUser | null) => void;
    refreshMe: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children }: {children: React.ReactNode}) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    
    const refreshMe = async () => {
        try {
            const me = await Me();
            setUser(me);
        } catch {
            setUser(null);
        }
    };

    const logout = async () => {
        await ApiLogout();
        setUser(null);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            await refreshMe();
            setLoading(false);
        })();
    }, []);

    return (
        <AuthContext.Provider value={{user, loading, setUser, refreshMe, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}