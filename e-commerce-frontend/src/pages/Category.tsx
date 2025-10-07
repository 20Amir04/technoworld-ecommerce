import {useParams} from 'react-router-dom';

function Category()
{
    const {name} = useParams<{ name: string}>();
    return (
      <div>
        <h1>Category: {name}</h1>

        {name == "computers" && <p>Here are computers for sale!</p>}
        {name == "laptops" && <p>Here are laptops for sale!</p>}
        {name == "phones" && <p>Here are phones for sale!</p>}
      </div>
    );
}

export default Category


