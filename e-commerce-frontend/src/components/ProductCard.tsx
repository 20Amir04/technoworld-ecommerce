


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
        className="w-auto h-auto object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
      />
      <div className="p-4">
        <h3 className="font-serif text-lg">{name}</h3>
        <p className="text-gray-600">${price}</p>
      </div>
      <div className="mt-10">
          <button className="absolute font-serif bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 scale-105 transition-transform duration-300">
            Add to Cart
          </button>
      </div>
    </div>
  );
};

export default ProductCard;