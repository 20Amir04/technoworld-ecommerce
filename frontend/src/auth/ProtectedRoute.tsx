import { Navigate, useLocation } from "react-router-dom";
import {useAuth} from "./AuthContext";
import type { JSX } from "react";

export default function ProtectedRoute({children} : {children: JSX.Element}) {
    const {user, loading} = useAuth();
    const location = useLocation();

    if (loading) return <div className="px-6 py-10">Loading...</div>
    if (!user) {
        const returnUrl = encodeURIComponent(location.pathname);
        return <Navigate to={`/auth?returnUrl=${returnUrl}`} replace />
    }

    return children;   
}