import { useNavigate } from "react-router-dom"


interface CartSummaryPrors {
    items:
    {
        id: number, name: string, price: number, qty: number
    }[];
}


const CartSummary: React.FC<CartSummaryPrors> = ({items}) => {

    const navigate = useNavigate();

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const delivery = subtotal > 1000 ? 0 : 9.99;
    const tax = subtotal * 0.13;
    const total = subtotal + delivery + tax;

    return (
        <div className="border rounded-xl p-6 shadow-md w-auto">
            <h2 className="font-serif text-xl mb-6 uppercase flex justify-center">Order Summary</h2>
            <div className="space-y-3 text-black text-lg">
                <div className="flex justify-between">
                    <span className="font-serif">{items.length} Items</span>
                    <span>C$ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-serif">Delivery</span>
                    <span>{delivery === 0 ? "Free" : `C$ ${delivery.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                    <span className="font-serif">HST</span>
                    <span>C$ {tax.toFixed(2)}</span>
                </div>

                <hr className="my-4"></hr>

                <div className="mb-6 flex justify-between font-bold">
                    <span className="font-serif">Total</span>
                    <span>C$ {total.toFixed(2)}</span>
                </div>  
                <div className="mb-6 font-serif">
                    <button 
                        type="button"
                        onClick={() => navigate("/checkout")}
                        className="py-3 w-full rounded-xl text-white bg-black hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:hover:scale-100"
                        disabled={items.length === 0}
                        >
                        Checkout
                    </button>
                </div>

                <div className="uppercase font-serif text-center">
                    <h3 className="">Accepted payment methods</h3>
                    <div className="flex justify-center gap-2 my-2">
                        💳 🏦 💰
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CartSummary;