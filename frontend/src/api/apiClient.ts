


const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:7031";

export interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
    subcategory: string;
    about?: string;
    highlights?: string;
}

function normalizeProduct(p: any): Product {
    return {
        id: p.id ?? p.Id,
        name: p.name ?? p.Name,
        price: p.price ?? p.Price,
        imageUrl: p.imageUrl ?? p.ImageUrl,
        category: p.category ?? p.Category,
        subcategory: p.subcategory ?? p.Subcategory ?? p.SubCategory,
        about: p.about ?? p.About,
        highlights: p.highlights ?? p.Highlights,
    };
}

async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
}

export async function FetchAllProducts(): Promise<Product[]> {
    const url = `${API_BASE_URL}/api/Products`;
    const data = await fetchJson<any[]>(url);
    return data.map(normalizeProduct);
}

export async function FetchProductsByCategory(category: string, subcategory: string): Promise<Product[]>
{
    const url = `${API_BASE_URL}/api/Products/by-category?category=${encodeURIComponent(
        category
    )}&subcategory=${encodeURIComponent(subcategory)}`;
    
    const data = await fetchJson<any[]>(url);
    return data.map(normalizeProduct);
}

export async function FetchProductById(id: number | string): Promise<Product> {
    const url = `${API_BASE_URL}/api/Products/${id}`;

    const data = await fetchJson<any[]>(url);
    return normalizeProduct(data);
}
