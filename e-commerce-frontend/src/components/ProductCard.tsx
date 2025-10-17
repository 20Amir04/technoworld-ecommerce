


interface ProductCardProps {
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition relative group overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-56 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-600">${price}</p>
      </div>
      <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;