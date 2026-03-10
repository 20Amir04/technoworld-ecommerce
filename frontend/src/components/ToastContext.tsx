import React, {createContext, useContext, useMemo, useState} from "react";
import {XMarkIcon} from "@heroicons/react/24/outline"

type ToastType = "success" | "error" | "info";

type ToastItem = {
    id: number;
    message: string;
    type: ToastType;
};

type ToastContextValue = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({children}: {children: React.ReactNode}) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (message: string, type: ToastType = "success") => {
        const id = Date.now() + Math.random();

        setToasts((prev) => [...prev, {id, message, type}]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 2500);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const value = useMemo(() => ({showToast}), []);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={[
                            "min-w-[260px] max-w-sm rounded-2xl border shadow-lg px-4 py-3 bg-white",
                            toast.type === "success" ? "border-green-200" : "",
                            toast.type === "error" ? "border-red-200" : "",
                            toast.type === "info" ? "border-gray-200" : "",
                        ].join(" ")}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div
                            className={[
                                "font-serif text-sm",
                                toast.type === "success" ? "text-green-700" : "",
                                toast.type === "error" ? "text-red-700" : "",
                                toast.type === "info" ? "text-gray-800" : "",
                            ].join(" ")}
                            >
                                {toast.message}
                            </div>

                            <button
                                type="button"
                                onClick={() => removeToast(toast.id)}
                            >
                                <XMarkIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}