import {Link} from "react-router-dom";

interface SubCategory {  /* interface — это конструкция из TypeScript, которая описывает структуру объекта: какие поля у него есть, какого они типа.
Она нужна, чтобы IDE и компилятор понимали, какие данные ты передаёшь в компонент.*/
    id: number;
    name: string;
    slug: string;
    image: string;
}

interface SubCategoryListProps {
    category: string;
    items: SubCategory[];
}

const SubCategoryList: React.FC<SubCategoryListProps> = ({category, items}) => {
    return(
        <div className="px-8 py-12 mb-30">
            <h2 className="text-3xl font-bold mb-10 capitalize flex justify-center font-serif">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {items.map((item) => (
                    <Link
                    key={item.id}
                    to={`/category/${category}/${item.slug}`}
                    className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow transition"
                    >
                        <img
                        src={item.image}
                        alt={item.name}
                        className="relative z-10 w-120 h-100 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition"/>
                        <h3 className="absolute bottom-6 left-6 text-white text-2xl font-serif z-20">{item.name}</h3>
                    </Link>
                ))}
            </div>    
        </div>
    );
}

export default SubCategoryList;