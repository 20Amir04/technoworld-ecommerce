import {useParams} from 'react-router-dom';
import { subcategories } from '../data/subcategories';
import SubCategoryList from '../components/SubCategoryList';


function Category()
{
    const {category} = useParams<{ category: string}>();
    
    if (!category) return null;

    const items = subcategories[category as keyof typeof subcategories] || [];

    return <SubCategoryList category={category} items={items} />;
}

export default Category


