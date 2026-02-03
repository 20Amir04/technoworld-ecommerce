import {Link} from "react-router-dom";
import { useWishlist } from "../auth/WishlistContext";

export default function Wishlist() {
    const {items, loading, error, toggle, clear} = useWishlist();

    if (loading) return <div className="px-12 py-12 font-serif">Loading wishlist...</div>;

    return (
        <div className="px-12 py-12">
            <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                    <h1 className="text-3xl font-serif">Your Wishlist</h1>
                    <p className="text-gray-600 mt-1 font-serif"> Items you save will appear here</p>
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
                        disabled={items.length === 0}
                    >
                        Clear Wishlist
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-6 text-sm text-red-600 font-serif bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                </div>
            )}

            {items.length === 0 ? (
                <div className="mt-8 border rounded-2xl p-10 text-center bg-gray-50">
                    <div className="text-lg font-serif">Empty for now</div>
                    <div className="text-gray-600 mt-2 font-serif">
                        Add items to your wishlist and they will show up here.
                    </div>
                    <Link
                        to="/"
                        className="inline-block mt-6 bg-black text-white px-6 py-3 rounded-xl font-serif hover:scale-105 transition-transform duration-300"
                    >
                        Browse products
                    </Link>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols 2 lg:grid-cols-4 gap-6">
                    {items.map((p) => (
                        <div
                            key={p.id}
                            className="bg-white rounded-2xl border shadow-sm overflow-hidden group"
                        >
                            <Link to={`/product/${p.id}`} className="block">
                                <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </Link>

                            <div className="p-4">
                                <Link to={`/product/${p.id}`} className="block">
                                    <div className="font-serif text-lg line-clamp-2">{p.name}</div>
                                </Link>
                                <div className="text-gray-600">{p.price}</div>
                                <div className="mt-4 flex gap-2">
                                    <Link
                                        to={`/product/${p.id}`}
                                        className="flex-1 border border-black rounded-xl py-2 font-serif hover:bg-black hover:text-white transition text-center"
                                        >
                                            View
                                        </Link>
                                        <button
                                        className="flex-1 bg-black text-white rounded-xl py-2 font-serif hover:scale-105 transition-transform duration-300"
                                        onClick={() => toggle(p.id)}
                                        >
                                            Remove
                                        </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}