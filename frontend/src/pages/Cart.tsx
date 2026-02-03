import CartItem from "../components/CartItem";
import CartSummary from "../components/CartSummary";
import { useCart } from "../auth/CartContext";
import { Link } from "react-router-dom";


export default function Cart()
{
    const {lines, loading, error, setQty, remove, clear} = useCart();
    
    if (loading) return <div className="px-12 py-12 font-serif">Loading cart...</div>

    const summaryItems: {id: number; name: string; price: number; qty: number}[] = lines.map(i => ({
        id: i.productId,
        name: i.product.name,
        price: i.product.price,
        qty: i.quantity,
    }));

    const total = summaryItems.reduce((sum: number, item) => sum + item.price * item.qty, 0);

    return (
        <div className="px-12 py-12 flex flex-col lg:flex-row justify-between gap-10">
            <div className="flex-1">
                <div>
                    <h1 className="text-3xl font-serif mb-8">Your Cart</h1>
                    <p className="text-gray-600 mb-6 font-semibold gap-x-2">
                        TOTAL ({summaryItems.length} {summaryItems.length === 1? "item" : "items"}) :
                        <span className="font-bold text-black">C${total.toFixed(2)}</span>
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Link
                        to="/"
                        className="border border-black px-5 py-2 rounded-xl font-serif hover:bg-black hover:text-white transition"
                    >
                        Continue shopping
                    </Link>

                    <button
                    className="bg-red-600 text-white px-5 py-2 rounded-xl font-serif disabled:opacity-50"
                    onClick={clear}
                    disabled={lines.length === 0}
                    >
                        Clear Cart
                    </button>
                </div>

                {error && (
                    <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}

                {summaryItems.length === 0 ? (
                    <div className="border rounded-2xl p-10 text-center bg-gray-50">
                        <div className="text-lg font-serif">Your cart is empty</div>
                        <div className="text-gray-600 mt-2 font-serif">
                            Add something to see it here.
                        </div>
                        <Link
                            to="/"
                            className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl font-serif hover:scale-105 transition-transform duration-300"
                        >
                            Browse products
                        </Link>
                        </div>
                ): (
                    <div className="space-y-6">
                    {lines.map((line) => (
                        <CartItem 
                        key={line.productId} 
                        item={line} 
                        onQtyChange={(newQty: number) => setQty(line.productId, newQty)}
                        onRemove = {() => remove(line.productId)}
                        />
                    ))}
                </div>
                )}
            </div>

            <div className="">
                <CartSummary items={summaryItems}/>
            </div>
        </div>
    );
}