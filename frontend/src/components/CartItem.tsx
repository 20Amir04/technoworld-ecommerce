import { XMarkIcon, HeartIcon } from "@heroicons/react/24/outline"; 
import React, { useState } from "react";


interface CartItemProps {
    item: {
        id: number;
        name: string;
        price: number;
        qty: number;
        image: string;
    };
    onQtyChange: (id: number, Newqty: number) => void;
    
}

const CartItem: React.FC<CartItemProps> = ({item, onQtyChange}) =>   {
    const [qty, setQty] =useState(item.qty);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newQty = Number(e.target.value);
        setQty(newQty);
        onQtyChange(item.id, newQty);
    }

    return (
        <div className="relative w-auto flex flex-col sm:flex-row  items-center gap-6 border rounded-lg hover: shadow-md transition">

              <div className="absolute top-4 right-3 flex flex-col space-y-5">
                <button>
                    <XMarkIcon className="h-6 w-6 hover: scale-110 transition-transform duration-200" />
                </button>
                <button>
                    <HeartIcon className="h-6 w-6 hover: scale-110 transition-transform duration-200" />
                </button>
            </div>

            <img
            src={item.image}
            alt={item.name}
            className="w-60 h-60 object-cover rounded-md"
            />

            <div className="flex flex-col items-start space-y-2">
                <h3 className="text-lg font-semibold font-serif">{item.name}</h3>
                <p className=" text-lg font-medium">C${(item.price * qty).toFixed(2)}</p>
                <select className="botder rounded px-3 py-1 bg-black text-white mb-5 md:mb-0" value={qty} onChange={handleChange}>
                        {[1, 2, 3, 4].map((value) =>  (
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