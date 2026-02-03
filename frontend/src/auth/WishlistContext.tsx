import React, {createContext, useContext, useEffect, useMemo, useState} from "react";
import { AddToWishlist, ClearWishlist, fetchWishlist, RemoveFromWishlist, type Product } from "../api/apiClient";
import { useAuth } from "./AuthContext";

type WishlistCtx = {
    items: Product[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    toggle: (productId: number) => Promise<void>;
    remove: (productId: number) => Promise<void>;
    count: number;
    clear: () => Promise<void>;
};

const Ctx = createContext<WishlistCtx | null>(null);

export function WishlistProvider({children}: {children: React.ReactNode}) {
    const {user} = useAuth();

    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refresh = async () => {
        if (!user) {

            setItems([]);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        try{
            const data = await fetchWishlist();
            setItems(data);
        } catch (e: any) {
            
            setError(e?.message ?? "Failed to load wishlist");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, [user?.id]);

    const ids = useMemo(() => new Set(items.map(i => i.id)), [items])

    const isInWishlist = (productId: number) => ids.has(productId);

    const toggle = async (productId: number) => {
        if (!user) return;

    const already = isInWishlist(productId);

    try {
        if (already) {
            await RemoveFromWishlist(productId);
            setItems(prev => prev.filter(p => p.id !== productId));
        } else {
            await AddToWishlist(productId);
            await refresh();
        }
        } catch (e: any) {
            setError(e?.message ?? "Wishlist update failed");

            await refresh();
            throw e;
        } 
    };

    const remove = async (productId: number) => {
        if (!user) return;
        
        try {
            await RemoveFromWishlist(productId);
            setItems((prev) => prev.filter((p) => p.id !== productId));
        } catch (e: any) {
            setError(e?.message ?? "Failed to remove item");
            await refresh();
            throw e;
        }
    };

    const clear = async () => {
        if (!user) return;
        
        setError(null);

        try {
            await ClearWishlist();
            setItems([]);
        } catch (e: any) {
            setError(e?.message ?? "Failed to clear Wishlist");
        }
    }


    const count = useMemo(() => items.length, [items]);
    
    return (
        <Ctx.Provider value = {{items, loading, error, refresh, isInWishlist, toggle, remove, clear, count}}>
            {children}
        </Ctx.Provider>
    );
}

export function useWishlist() { 
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
    return ctx;
}