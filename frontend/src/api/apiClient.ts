


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7031";


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

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        credentials: "include",
        ...init,   
    });

    if (!response.ok) {
        const msg = await response.text().catch(() => "");
        throw new Error(msg || `Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;

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

    const data = await fetchJson<any>(url);
    return normalizeProduct(data);
}

export interface AuthUser
{
    id: number;
    name: string;
    email: string;
}

export async function Register(name: string, email: string, password: string): Promise<AuthUser>
{
    const url = `${API_BASE_URL}/api/Auth/register`;

    return fetchJson<AuthUser>(url, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password}),
    });
}

export async function Login(email: string, password: string): Promise<AuthUser> {
    const url = `${API_BASE_URL}/api/Auth/login`;
    
    return fetchJson<AuthUser>(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
    });
}

export async function Me(): Promise<AuthUser> {
    const url = `${API_BASE_URL}/api/Auth/me`;

    return fetchJson<AuthUser>(url);
}

export async function Logout(): Promise<void> {
    const url = `${API_BASE_URL}/api/Auth/logout`;

    await fetchJson<void>(url, {method: "POST"});
}