import {Link, useSearchParams} from "react-router-dom";

export default function OrderSuccess() {
    const [params] = useSearchParams();
    const orderId = params.get("orderId");

    return (
        <div className="px-12 py-12">
            <div className="max-w-2xl mx-auto bg-white border rounded-2xl p-10 text-center">
                <h1 className="text-3xl font-serif">Order placed!</h1>
                <p className="text-gray-600 mt-3">Thank you. You can view you orders in your account</p>

                {orderId && (
                    <div className="mt-4 text-lg">
                        <span className="font-serif">Order ID:</span> {" "}
                        <span className="font-bold">{orderId}</span>
                    </div>
                )}

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        to="/auth"
                        className="border border-black px-6 py-3 rounded-xl hover:bg-black hover:text-white hover:scale-105 transition-transform"
                    >
                        Go to account
                    </Link>

                    <Link
                        to="/"
                        className="border border-black px-6 py-3 rounded-xl hover:bg-black hover:text-white hover:scale-105 transition-transform"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}