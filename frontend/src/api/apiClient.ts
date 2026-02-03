


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

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        credentials: "include",
        ...options,   
    });

    if (!response.ok) {
        const msg = await response.text().catch(() => "");
        throw new Error(msg || `Request failed: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) return undefined as T;

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
        credentials: "include",
        body: JSON.stringify({ name, email, password}),
    });
}

export async function Login(email: string, password: string): Promise<AuthUser> {
    const url = `${API_BASE_URL}/api/Auth/login`;
    
    return fetchJson<AuthUser>(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({email, password}),
    });
}

export async function Me(): Promise<AuthUser> {
    const url = `${API_BASE_URL}/api/Auth/me`;

    return fetchJson<AuthUser>(url, {  
        credentials: "include", 
    });
}

export async function Logout(): Promise<void> {
    const url = `${API_BASE_URL}/api/Auth/logout`;

    await fetchJson<void>(url, {
        method: "POST",
        credentials: "include",
    });
}

export async function fetchWishlist(): Promise<Product[]> {
    const url = `${API_BASE_URL}/api/Wishlist`;
    const data = await fetchJson<any[]>(url);
    return data.map(normalizeProduct);
}

export async function AddToWishlist(productId: number): Promise<void> {
    const url = `${API_BASE_URL}/api/Wishlist/${productId}`;
    await fetchJson<void>(url, {method: "POST"});
}

export async function RemoveFromWishlist(productId: number): Promise<void> {
    const url = `${API_BASE_URL}/api/Wishlist/${productId}`;
    await fetchJson<void>(url, {method: "DELETE"});
}

export async function ClearWishlist(): Promise<void> {
    const url = `${API_BASE_URL}/api/Wishlist`;

    await fetchJson<void>(url, {method: "DELETE"});
}

export interface CartLine {
    productId: number;
    quantity: number;
    product: Product;
}

export async function FetchCart(): Promise<CartLine[]> {
    const url = `${API_BASE_URL}/api/Cart`;
    const data = await fetchJson<any[]>(url);

    return data.map((x) => ({
        productId: x.productId ?? x.ProductId,
        quantity: x.quantity ?? x.Quantity,
        product: normalizeProduct(x.product ?? x.Product),
    }));
}

export async function AddToCart(productId: number, quantity = 1): Promise<void> {
    const url = `${API_BASE_URL}/api/Cart`;
    
    await fetchJson<void>(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({productId, quantity}),
    });
}

export async function UpdateCartQty(productId: number, quantity: number): Promise<void> {
    const url = `${API_BASE_URL}/api/Cart/${productId}`;
    await fetchJson<void>(url, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({quantity}),
    });
}

export async function RemoveFromCart(productId: number): Promise<void> {
    const url = `${API_BASE_URL}/api/Cart/${productId}`;
    await fetchJson<void>(url, {method: "DELETE"});
}

export async function ClearCart(): Promise<void> {
    const url = `${API_BASE_URL}/api/Cart`;

    await fetchJson<void>(url, {method: "DELETE"});
}