import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";

function SubCategory()
{
   const {category, subcategory} = useParams<{category: string; subcategory: string} >();

   if (!category || !subcategory) return null;

   return (
    <div>
        <ProductList category={`${category}/${subcategory}`} />
    </div>
   );
  
}

export default SubCategory;