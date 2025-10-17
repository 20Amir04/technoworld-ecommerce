import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";

function SubCategory()
{
   const {name, sub} = useParams<{name: string; sub: string} >();

   return (
    <div>
        <ProductList category={`${name}/${sub}`} />
    </div>
   );
}

export default SubCategory;