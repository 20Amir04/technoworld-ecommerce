import { Link } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import type {Product} from "../api/apiClient";



interface ProductCardProps {
  product: Product;
  onAddToCard?: (product: Product) => void;
  onToggleWishList?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCard, onToggleWishList }) => {
  return (
    <Link
    to={`/product/${product.id}`}
    className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition relative group overflow-hidden"
    >
      <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggleWishList?.(product);
      }}
      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition"
      >
        <HeartIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/>  
      </button>

      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-auto h-auto object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h3 className="font-serif text-lg">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
      <div className="mt-10">
          <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCard?.(product);
          }}
          className="absolute font-serif bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 scale-105 transition-transform duration-300"
          >
            Add to Cart
          </button>
      </div>
    </Link>
  );
};

export default ProductCard;