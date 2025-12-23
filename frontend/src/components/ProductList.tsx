import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { FetchProductsByCategory} from "../api/apiClient";
import type {Product} from "../api/apiClient";

interface ProductListProps {
  category: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => { 
  const [main, sub] = category.split("/");

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() =>{
    if (!main || !sub) return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await FetchProductsByCategory(main, sub);
        setItems(data);
      }catch (e: any) {
        setError(e.message ?? "Failed to load Products");
      }finally {
        setLoading(false);
      }
    };
    load();
  }, [main, sub]);

  return (
    <div className="px-8 py-12">
      <h2 className="text-3xl font-bold mb-8 capitalize flex justify-center font-serif">
        {main} {sub && `- ${sub}`}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && items.length == 0 && (
        <p>No products found.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item) => 
           <ProductCard 
              key={item.id}
              product={item}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;