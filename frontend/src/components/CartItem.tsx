import { XMarkIcon, HeartIcon } from "@heroicons/react/24/outline"; 
import React, { useState, useMemo } from "react";
import type { CartLine } from "../api/apiClient";
import { useWishlist } from "../auth/WishlistContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

interface CartItemProps {
    item: CartLine;
    onQtyChange: (newQty: number) => void;
    onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({item, onQtyChange, onRemove}) =>   {
    const [qty, setQty] =useState(item.quantity);

    React.useEffect(() => {
        setQty(item.quantity);
    }, [item.quantity]);

    const {user} = useAuth();
    const {isInWishlist, toggle} = useWishlist();
    const navigate = useNavigate();
    const location = useLocation();

    const liked = useMemo(() => isInWishlist(item.productId), [isInWishlist, item.productId]);

    const handleQtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newQty = Number(e.target.value);
        setQty(newQty);
        onQtyChange(newQty);
    }

    const onHeartClick = async () => {
        if (!user) {
            return navigate(`/account?returnUrl=${encodeURIComponent(location.pathname)}`);
        }
        await toggle(item.productId);
    };

    return (
        <div className="relative w-auto flex flex-col sm:flex-row  items-center gap-6 border rounded-lg hover:shadow-md transition">

              <div className="absolute top-4 right-3 flex flex-col space-y-5">
                <button type="button" onClick={onRemove} aria-label="Remove from cart">
                    <XMarkIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/>
                </button>
                <button type="button" onClick={onHeartClick} aria-label="Toggle Wishlist">
                    <HeartIcon 
                        className={`h-6 w-6 hover:scale-110 transition-transform duration-200 ${
                            liked ? "fill-red-500 stroke-red-500" : ""
                        }`}
                    />
                </button>
            </div>

            <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="w-60 h-60 object-cover rounded-md"
            />

            <div className="flex flex-col items-start space-y-2">
                <h3 className="text-lg font-semibold font-serif">{item.product.name}</h3>
                <p className=" text-lg font-medium">C${(item.product.price * qty).toFixed(2)}</p>
                <select className="border rounded px-3 py-1 bg-black text-white mb-5 md:mb-0" value={qty} onChange={handleQtyChange}>
                        {[1, 2, 3, 4, 5].map((value) =>  (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                </select>
            </div>
        </div>
    );
}

export default CartItem