import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import AcerNitro from "../assets/gaimingPC/AcerGaming.png"
import Dell from "../assets/desktopPC/Dell.jpeg"
import { useState } from "react";

function Cart()
{
    const [items, setItems] = useState([
        {
            id: 1,
            name: "Acer Nitro N60-640-EB23 Gaming PC",
            price: 1599.99,
            qty: 1,
            image: AcerNitro
        },
         {
            id: 2,
            name: "DELL OptiPlex 7060 SFF",
            price: 520,
            qty: 1,
            image: Dell
        }
    ]);

    const handleQtyChange = (id: number, Newqty: number) => {
            setItems((prev) =>
            prev.map((item) =>
            item.id === id ? {...item, qty: Newqty} : item
            )
        );
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
        <div className="px-12 py-12 flex flex-col lg:flex-row justify-between gap-10">
            <div className="flex-1">
                <h1 className="text-3xl font-serif mb-8">Your Cart</h1>
                <p className="text-gray-600 mb-6 font-semibold gap-x-2">
                    TOTAL ({items.length} {items.length === 1? "item" : "items"}) :
                    <span className="font-bold text-black">C${total.toFixed(2)}</span>
                </p>
                <div className="space-y-6">
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} onQtyChange={handleQtyChange}/>
                    ))}
                </div>
            </div>

            <div className="">
                <CartSummary items={items}/>
            </div>
        </div>
    );
}

export default Cart