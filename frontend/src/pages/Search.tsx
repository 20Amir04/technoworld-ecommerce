import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FetchAllProducts, type Product } from "../api/apiClient";
import ProductCard from "../components/ProductCard";

export default function Search() {
    const [params] = useSearchParams();
    const query = (params.get("q") ?? "").trim().toLowerCase();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await FetchAllProducts();
                setProducts(data);
            } catch (e: any) {
                setError(e?.message ?? "Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!query) return [];

        const words = query.split(/\s+/).filter(Boolean);

        return products.filter((p) => {
            const haystack = [
                p.name,
                p.category,
                p.subcategory,
                p.about ?? "",
                p.highlights ?? "",
            ]
            .join(" ")
            .toLowerCase();

            return words.every((word) => haystack.includes(word));
        });
    }, [products, query]);

    if (loading) {
        return (
            <div className="px-6 py-10">
                <div className="font-serif text-gray-600">Loading search results...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-10">
                <div className="font-serif text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="px-6 md:px-10 py-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-wide">
                    Search results
                </h1>

                <p className="mt-3 text-gray-700 font-serif">
                    {query ? (
                        <>
                            Results for: <span className="font-serif">"{query}"</span>
                        </>
                    ) : (
                        "Type something in search."
                    )}
                </p>

                <div className="mt-2 text-sm text-gray-600 font-serif">
                    {filteredProducts.length} item{filteredProducts.length === 1 ? "" : "s"} found
                </div>

                {query && filteredProducts.length === 0 ? (
                    <div className="mt-10 border rounded-2xl p-10 bg-gray-50 text-center">
                        <div className="text-xl font-serif">No products found</div>
                        <div className="mt-2 text-gray-600 font-serif">
                            Try another keyword. Examples: laptop, gaming, iphone, asus...
                        </div>
                    </div>
                ) : (
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                    ))}
                    </div>
                )}
            </div>
        </div>
    );
}