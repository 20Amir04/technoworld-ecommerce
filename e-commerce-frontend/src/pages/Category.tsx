import {useParams} from 'react-router-dom';
import { subcategories } from '../data/subcategories';
import SubCategoryList from '../components/SubCategoryList';


function Category()
{
    const {name} = useParams<{ name: string}>();
    
    if (!name) return null;

    const items = subcategories[name as keyof typeof subcategories] || [];

    return <SubCategoryList category={name} items={items} />;
}

export default Category


