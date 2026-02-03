import { useEffect, useState } from "react";
import { useParams, Link} from "react-router-dom";
import { FetchProductById, type Product } from "../api/apiClient";
import { useCart } from "../auth/CartContext";
import { useWishlist } from "../auth/WishlistContext";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";


function formatPrice(price: number) {
    return `${price.toFixed(2)}`;
}

export default function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const {user} = useAuth();
    const {toggle, isInWishlist} = useWishlist();
    const {add} = useCart();
    const {id} = useParams();

    const liked = product ? isInWishlist(product.id) : false;

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                if (!id)
                {
                    setError("Missing product id");
                    return;
                }

                const data = await FetchProductById(id);
                setProduct(data);
            }catch (e) {
                console.error(e);
                setError("Failed to load product");
            }finally {
                setLoading(false);

            }
        };

        load();
    }, [id]);

   if (loading) {
    return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;
   }

   if (error) {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow p-6">
                <p className="text-lg font-medium">Something went wrong...</p>
                <p className="text-gray-600 mt-2">{error}</p>
                <Link to="/" className="inline-block mt-4 underline">
                    Home Page
                </Link>
            </div>
        </div>
    );
   }

   if (!product)
   {
    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-white rounded-2xl shadow p-6">
                <p className="text-lg font-medium">Product not found</p>
                <Link to="/" className="inline-block mt-4 underline">
                    Home Page
                </Link>
            </div>
        </div>
    );
   }

   return (
    <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">

            {/* Breadcrumb */}

            <div className="text-sm text-gray-600 flex flex-wrap items-center gap-2 font-serif">
                <Link to="/" className="hover:scale-110 transition-transform duration-200">Home</Link>
                <span></span>
                <Link to={`/category/${product.category}`} className="hover:scale-110 transition-transform duration-200">
                    {product.category}
                </Link>
                <span></span>
                <Link to={`/category/${product.category}/${product.subcategory}`} className="hover:scale-110 transition-transform duration-200">
                    {product.subcategory}
                </Link>
                <span></span>
                <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
            </div>

            {/* Main grid */}

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl shadow p-4">
                        <div className="flex gap-4">

                            {/* main image */}

                            <div className="flex-1">
                                <div className="w-full h-[420px] flex items-center justify-center">
                                    <img 
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="max-h-[420px] w-full object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About this product */}

                    <div className="mt-6 bg-white rounded-2xl shadow p-6 font-serif">
                        <h2 className="text-xl font-serif">Overview</h2>
                        <p className=" mt-3 leading-relaxed">{product.about}</p>
                        <div className="mt-6 border-t pt-5">
                            <h2 className="text-xl font-serif">About this product</h2>
                            <ul className="mt-3 space-y-2 list-disc pl-5">
                                {(product.highlights ?? "")
                                    .split("|")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                    .map((h, idx) => <li key={idx}>{h}</li>)
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Right: Purchase panel */}

                <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl shadow p-6 sticky top-6">
                        <h1 className="text-2xl font-serif leading-snug">{product.name}</h1>
                        
                        {/* rating row */}

                        <div className="mt-3 flex items-center gap-2 text-sm font-serif">
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500">★</span>
                                <span className="text-yellow-500">★</span>
                                <span className="text-yellow-500">★</span>
                                <span className="text-yellow-500">★</span>
                                <span className="text-gray-300">★</span>
                            </div>
                            <span className="text-gray-600">(4.3)</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-600">Free shipping</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-black text-sm font-serif">Sold and shipped by TechnoWorld</span>
                        </div>
                        <div className="mt-5 flex items-end justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-serif">Price</p>
                                <p className="text-3xl font-semibold">{formatPrice(product.price)}</p>
                            </div>

                            <div className="text-right font-serif">
                                <p className="text-sm text-gray-500">Availability</p>
                                <p className="text-sm font-medium text-green-700">In Stock</p>
                            </div>
                        </div>

                        {/* action buttons */}

                        <div className="mt-6 space-y-3">
                            <button
                            className="w-full bg-black text-white py-3 rounded-xl font-medium hover:scale-110 transition-transform duration-300"
                            type="button"
                            onClick={() => {
                                if (!user) {
                                    navigate("/account");
                                    return;
                                }
                                add(product.id);
                            }}
                            >
                                Add to Cart
                            </button>

                            <button
                            className="w-full border border-black py-3 rounded-xl font-medium font-serif hover:bg-black hover:text-white hover:scale-110 transition-transform duration-300"
                            type="button"
                            onClick={() => {
                                if (!user) {
                                    navigate("/account");
                                    return;
                                }
                                toggle(product.id)
                            }}
                            >
                                {liked ? "Remove from Wishlist" : "Add to Wishlist"}
                            </button>
                        </div>
                        
                        {/* delivery/info block */}

                        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-lg">🚚</span>
                                <div>
                                    <p className="font-medium font-serif">Fast Delivery</p>
                                    <p className="text-sm text-gray-600 font-serif"> Get it delivered in 2-5 business days</p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-start gap-3">
                                <span className="text-lg">↩️</span>
                                <div className="font-serif">
                                    <p className="font-medium">Easy return</p>
                                    <p className="text-sm text-gray-600">Return within 30 days.</p>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>
            </div>

            {/* bottom spacer */}

            <div className="h-10" />
        </div>
    </div>
   );
}