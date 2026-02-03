import React, {createContext, useContext, useEffect, useState, useMemo} from "react";
import { useAuth } from "./AuthContext";
import {
    AddToCart,
    ClearCart,
    FetchCart,
    RemoveFromCart,
    UpdateCartQty,
    type CartLine,
} from "../api/apiClient";

type CartCtx = {
    lines: CartLine[];
    loading: boolean;
    error: string | null;

    refresh: () => Promise<void>;
    totalQty: number;

    add: (productId: number, qty?: number) => Promise<void>;
    setQty: (productId: number, qty: number) => Promise<void>;
    remove: (productId: number) => Promise<void>;
    clear: () => Promise<void>;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({children}: {children: React.ReactNode}) {
    const {user} = useAuth();

    const [lines, setLines] = useState<CartLine[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        if (!user) {setLines([]); setError(null); return}
        setLoading(true);
        setError(null);

        try {
            const data = await FetchCart();
            setLines(data);
         } catch (e: any) {
            setError(e?.message ?? "Failed to load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();  
    }, [user?.id]);

    const totalQty = useMemo(
        () => lines.reduce((sum, l) => sum + l.quantity, 0),
        [lines]
    );

    const add = async (productId: number, qty =1) => {
        if (!user) return;

        setError(null);
        try {
        await AddToCart(productId, qty);

        setLines((prev) => {
            const idx = prev.findIndex((p) => p.productId === productId);
            if (idx >= 0) {
                const copy = [...prev];
                copy[idx] = {...copy[idx], quantity: copy[idx].quantity + qty};
                return copy;
            }

            refresh();
            return prev;
        });

        if (!lines.some((l) => l.productId === productId)) {
        await refresh();
        }

        } catch (e: any) {
            setError(e?.message ?? "Failed to add to cart");
        }
    };

    

    const setQty = async (productId: number, qty: number) => {
        if (!user) return;

        setError(null);
        try {
        await UpdateCartQty(productId, qty);
        setLines(prev => 
            prev.map(l  => (l.productId === productId ? {...l, quantity: qty}: l))
        );
        } catch (e: any) {
            setError(e?.message ?? "Failed to update quantity");
        }
    };

    const remove = async (productId: number) => {
        if (!user) return;
        setError(null);
        try {
        await RemoveFromCart(productId);
        setLines((prev) => prev.filter((l) => l.productId !== productId));
        } catch (e: any) {
            setError(e?.message ?? "Failed to remove item");
        }
    };

    const clear = async () => {
        if (!user) return;

        setError(null)

        try {
        await ClearCart();
        setLines([]);
        } catch (e: any) {
            setError(e?.message ?? "Failed to clear cart");
        }
    };

    return (
        <Ctx.Provider value= {{ lines, loading, refresh, totalQty, add, error, setQty, remove, clear}}>
            {children}
        </Ctx.Provider>
    );
}

export function useCart() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}