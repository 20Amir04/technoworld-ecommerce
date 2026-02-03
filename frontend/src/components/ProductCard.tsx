import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import type {Product} from "../api/apiClient";
import { useWishlist } from "../auth/WishlistContext";
import {useAuth} from "../auth/AuthContext"
import { useCart } from "../auth/CartContext";

interface ProductCardProps {
  product: Product;
}



const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  
  const {add} = useCart();
  const {user} = useAuth();
  const {isInWishlist, toggle} = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const liked = isInWishlist(product.id);

  const redirectToAuth = () => {
    navigate(
        `/auth?returnUrl=${encodeURIComponent(location.pathname)}`
      );
  };

  const onHeartClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      redirectToAuth();
      return;
    }

    await toggle(product.id);
  };

  const onAddToCartClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      redirectToAuth();
      return;
    }

    await add(product.id, 1);
  };


  return (
    <Link
    to={`/product/${product.id}`}
    className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition relative group overflow-hidden"
    >
      <button
      type="button"
      onClick={onHeartClick}
      className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition"
      aria-label="Add to Wishlist"
      >
        <HeartIcon className={`h-6 w-6 hover:scale-110 transition-transform duration-200 ${
        liked
        ? "fill-red-500 stroke-red-500 scale-110"
        : "hover:scale-110"
        }`}
        />  
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
          onClick={onAddToCartClick}
          className="absolute font-serif bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 hover:scale-105 transition-transform duration-300"
          >
            Add to Cart
          </button>
      </div>
    </Link>
  );
};

export default ProductCard;