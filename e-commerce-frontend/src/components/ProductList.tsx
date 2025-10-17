import ProductCard from "./ProductCard";
import { computers } from "../data/computers";
import { laptops } from "../data/laptops";
import {phones} from "../data/phones";

interface ProductListProps {
  category: string;
}

const ProductList: React.FC<ProductListProps> = ({ category }) => { /* React.FC (React Function Component) — это типизация функционального компонента в React.
Она говорит TypeScript: “Эта функция — компонент React, и она принимает пропсы вот такого типа”.*/
  const [main, sub] = category.split("/");

  console.log("Main/Sub:", main, sub);

  let items: any[] = [];

  console.log("items: ", items);

  if (main === "computers" && sub) {
    items = computers[sub as keyof typeof computers] || []; /* as keyof typeof computers — это уточнение типа,
                                                                которое говорит TypeScript:
                                                                "строка sub точно совпадает с одним из ключей объекта computers."*/
  }
  else if (main === "laptops" && sub) {
    items = laptops[sub as keyof typeof laptops] || [];
  }
  else if (main === "phones" && sub) {
    items = phones[sub as keyof typeof phones] || [];
  }

  return (
    <div className="px-8 py-12">
      <h2 className="text-3xl font-bold mb-8 capitalize flex justify-center font-serif">
        {main} {sub && `- ${sub}`}
      </h2>

      {items.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;