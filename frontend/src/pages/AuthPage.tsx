import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {Login, Register, FetchOrders, FetchOrderById,type OrderListItem, UpdateMe, DeleteMe, ChangePassword} from "../api/apiClient"
import { useNavigate, useSearchParams } from "react-router-dom";

type Tab = "orders" | "details" | "delete";

type OrderDetails = any;

export default function AuthPage() {

    const {user, loading, setUser, logout} = useAuth();

    const [mode, setMode] = useState<"login" | "register">("login");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
    }, [mode]);

    const [tab, setTab] = useState<Tab>("orders");

    const title = useMemo(() => {
        if (!user) return "Account";
        return `Hi, ${user.name}`;
    }, [user]);

    const navigate = useNavigate();
    const [params] = useSearchParams();
    const returnUrl = params.get("returnUrl");
    
    if (loading) {
        return (
            <div className="px-6 py-10 flex justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!user) {
        const onSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setSubmitting(true);
            setError(null);

            try {
                if (mode === "login") {
                    const u = await Login(email, password);
                    setUser(u);
                    const target = returnUrl ? decodeURIComponent(returnUrl) : "/";
                    navigate(target, {replace: true});
                } else {
                    const u = await Register(name, email, password);
                    setUser(u);
                    const target = returnUrl ? decodeURIComponent(returnUrl) : "/";
                    navigate(target, {replace: true});
                } 
            }catch (err: any) {
                setError(err?.message ?? "Something went wrong");
            }finally {
                setSubmitting(false);
            }
        };
    
    return (
            <div className="px-6 py-10">
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border">
                    <div className="px-6 py-5 border-b">
                        <h1 className="text-2xl font-serif">{title}</h1>
                        <p className="text-gray-600 mt-1 font-serif">
                            Sign in to manage your orders and private information.
                        </p>
                    </div>
                    
                    <form onSubmit={onSubmit} className="px-6 py-6 space-y-4">
                        {mode == "register" && (
                            <div>
                                <label className="text-sm text-gray-700 font-serif">Name</label>
                                <input 
                                disabled={submitting}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full border rounded-xl px-3 py-2 outline-none focus:ring"
                                placeholder="Name"
                                required
                                />
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-gray-700 font-serif">Email</label>
                            <input
                            disabled={submitting} 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full border rounded-xl px-3 py-2 outline-none focus:ring"
                            placeholder="Email"
                            type="email"
                            required
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700 font-serif">Password</label>
                            <input
                            disabled={submitting}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full border rounded-xl px-3 py-2 outline-none focus:ring "
                            placeholder="••••••••"
                            type="password"
                            required
                            />
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 font-serif bg-red-50 border border-red-100 rounded-xl px-2 py-2">
                                {error}
                            </div>
                        )}

                        <button
                        disabled={submitting}
                        className="w-full bg-black text-white py-3 rounded-xl font-medium hover:scale-110 transition-transform duration-300"
                        >
                            {submitting ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
                        </button>

                        {mode === "login" ? (
                            <div className="text-sm text-gray-700 font-serif pt-2">
                                Not a member yet?{" "}
                                <button
                                type="button"
                                className="font-serif underline cursor-pointer hover:text-gray-900"
                                onClick={() => setMode("register")}
                                >
                                    Create an account
                                </button>
                            </div>
                        ): (
                            <div className="text-sm text-gray-700 pt-2 font-serif">
                                Already have an account?{" "}
                                <button
                                type="button"
                                className="font-serif underline cursor-pointer hover:text-gray-900"
                                onClick={() => setMode("login")}
                                >
                                    Sign In
                                </button>    
                            </div>
                        )}
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-10">
            <div className="max-w-6-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* LEFT MENU */}
                <aside className="md:col-span-4 lg:col-span-3">
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b">
                            <div className="font-serif text-lg">{title}</div>
                            <div className="text-sm text-gray-600 font-serif">{user.email}</div>
                        </div>

                        <div className="p-2">
                            <MenuButton active={tab === "orders"} onClick={() => setTab("orders")}>
                                Orders
                            </MenuButton>
                            <MenuButton active={tab === "details"} onClick={() => setTab("details")}>
                                Personal Information
                            </MenuButton>
                            <MenuButton active={tab === "delete"} onClick={() => setTab("delete")}>
                                Delete account
                            </MenuButton>

                            <div className="px-3 pt-2">
                                <button
                                onClick={async () => {
                                    await logout();
                                    navigate("/", {replace: true});
                                }}  
                                className="w-full rounded-xl bg-red-600 font-serif py-2 border hover:scale-110 transition-transform duration-300"
                                >
                                    Log out
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </aside>

                {/* RIGHT SIDE*/}
                <main className="md-col-span-8 lg:col-span-9">
                    <div className="bg-white rounded-2xl border shadow-sm p-6">
                        {tab === "orders" && <OrdersPanel/>}
                        {tab === "details" && <DetailsPanel user={user} onUserUpdated={setUser} />}
                        {tab === "delete" && <DeletePanel onDeleted={async () => {
                            await logout();
                            navigate("/", {replace: true});
                        }}/>}
                    </div>
                </main>
            </div>
        </div>
    );
}


function MenuButton({
    active,
    onClick,
    children,
}: {
    active: boolean,
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
        onClick={onClick}
        className={[
            "w-full text-left px-4 py-3 rounded-xl font-medium font-serif",
            active ? "bg-blue-600 text-white" : "hover:bg-gray-50",
        ].join(" ")}
        >
            {children}
        </button>
    );
}

export function OrdersPanel() {
    const [orders, setOrders] = useState<OrderListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [openId, setOpenId] = useState<number | null>(null);
    const [details, setDetails] = useState<Record<number, OrderDetails>>({});
    const [detailsLoading, setDetailsLoading] = useState<Record<number, boolean>>({});
    const [detailsError, setDetailsError] = useState<Record<number, string | null>>({});

    const loadOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await FetchOrders();
            setOrders(data);
        } catch (e: any) {
            setError(e?.message ?? "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const toggleOrder = async (id: number) => {
        if (openId === id) {
            setOpenId(null);
            return;
        }

        setOpenId(id);

        if (details[id]) return;

        setDetailsLoading(prev => ({ ...prev, [id]: true }));
        setDetailsError(prev => ({ ...prev, [id]: null}));

        try {
            const d = await FetchOrderById(id);
            setDetails(prev => ({ ...prev, [id]: d}));
        } catch (e: any) {
            setDetailsError(prev => ({ ...prev, [id]: e?.message ?? "Failed to load order details"}));
        } finally {
            setDetailsLoading(prev => ({ ...prev, [id]: false}));
        }
    };

    if (loading) return <div className="text-gray-600 font-serif">Loading orders...</div>;
    if (error) return <div className="text-red-600 font-serif">{error}</div>;
    
    if (orders.length === 0) {
        return (
            <div>
                <h2 className="text-2xl font-serif">Order History</h2>
                <div className="mt-6 border rounded-2xl p-10 text-center bg-gray-50">
                    <div className="text-lg font-serif">Nothing to show yet!</div>
                    <div className="text-gray-600 mt-2 font-serif">
                        Place your first order from the cart.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif">Order History</h2>
                    <button
                        type="button"
                        onClick={loadOrders}
                        className="text-sm font-serif underline text-gray-700 hover:text-black"
                    >
                            Refresh
                    </button>
            </div>

                <div className="mt-6 space-y-4">
                    {orders.map((o) => {
                        const isOpen = openId === o.id;
                        const d = details[o.id];
                        const isDetLoading = !!detailsLoading[o.id];
                        const detErr = detailsError[o.id];

                        return (
                            <div key={o.id} className="border rounded-2xl p-4 bg-white">
                                <button
                                    type="button"
                                    onClick={() => toggleOrder(o.id)}
                                    className="w-full text-left"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <div className="font-serif text-lg">Order #{o.id}</div>
                                            <div className="text-sm text-gray-600 font-serif">
                                                {new Date(o.createdAt).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600 font-serif">
                                                Status: <span className="text-black">{o.status}</span>
                                            </div>
                                            <div className="text-sm text-gray-600 font-serif">
                                                Items: <span className="text-black">{o.itemsCount}</span>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-serif text-lg">C$ {Number(o.total).toFixed(2)}</div>
                                            <div className="text-sm text-gray-600 font-serif">
                                                Subtotal: C$ {Number(o.subtotal).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-600 font-serif">
                                                Delivery: C$ {Number(o.delivery).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-600 font-serif">
                                                Tax: C$ {Number(o.tax).toFixed(2)}
                                            </div>
                                            <div className="text-sm font-serif underline text-gray-700 mt-1">
                                                {isOpen ? "Hide details" : "View details"}
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="mt-4 border-t pt-4">
                                        {isDetLoading && (
                                            <div className="text-gray-600 font-serif">Loading details...</div>
                                        )}

                                        {detErr && (
                                            <div className="text-red-600 font-serif">{detErr}</div>
                                        )}

                                        {!isDetLoading && !detErr && d && (
                                            <OrderDetailsBlock details={d} />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
        </div>
    );
    
}

function OrderDetailsBlock({details}: {details: any}) {
    const items = details.items ?? details.orderItems ?? [];

    const shipping = details.shipping ?? details.address ?? details;
    const payment = details.payment ?? details;

    return (
        <div className="space-y-6">
            <div>
                <div className="font-serif text-lg mb-2">Items</div>

                {Array.isArray(items) && items.length > 0 ? (
                    <div className="space-y-2">
                        {items.map((it: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                                <div className="text-gray-800 font-serif">
                                    {it.nameSnapshot ?? it.name ?? it.productName ?? "Item"}{" "}
                                    {it.quantity ? `x ${it.quantity}` : ""}
                                </div>
                                <div className="font-serif">
                                    C$ {Number(it.lineTotal ?? it.total ?? (it.unitPriceSnapshot ?? it.price ?? 0) * (it.quantity ?? 1)).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600 font-serif">No items found in details payload.</div>
                )}
            </div>

            <div>
                <div className="font-serif text-lg mb-2">Shipping</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Info label="Full name" value={shipping.fullname ?? shipping.FullName} />
                    <Info label="Email" value={shipping.email ?? shipping.Email} />
                    <Info label="Phone" value={shipping.phone ?? shipping.Phone} />
                    <Info label="Address 1" value={shipping.address1 ?? shipping.Address1} />
                    <Info label="Address 2" value={shipping.address2 ?? shipping.Address2} />
                    <Info label="City" value={shipping.city ?? shipping.City} />
                    <Info label="Province" value={shipping.province ?? shipping.Province} />
                    <Info label="Postal Code" value={shipping.PostalCode ?? shipping.PostalCode} />
                    <Info label="Country" value={shipping.country ?? shipping.Country} />
                </div>
            </div>

            <div>
                <div className="font-serif text-lg mb-2">Payment</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Info label="Method" value={payment.paymentMethod ?? payment.PaymentMethod} />
                    <Info label="Card" value={payment.cardLast4 ?? payment.CardLast4 ? `*** ${payment.cardLast4 ?? payment.CardLast4}`: ""} />
                    <Info label="Card band" value={payment.cardBand ?? payment.CardBand} />
                </div>
            </div>
        </div>
    );
}

function Info({label, value}: {label: string; value?: any}) {
    if (value === undefined || value === null || String(value).trim() === "") return null;
    return (
        <div className="border rounded-xl p-3 bg-gray-50">
            <div className="text-gray-600 font-serif">{label}</div>
            <div className="font-serif text-gray-900">{String(value)}</div>
        </div>
    );
}

function DetailsPanel({
    user,
    onUserUpdated,
    } : {
        user: {id: number; name: string; email: string};
        onUserUpdated: (u: any) => void; 
    }) {
        const [editing, setEditing] = useState(false);

        const [name, setName] = useState(user.name);
        const [email, setEmail] = useState(user.email);

        const [currentPassword, setCurrentPassword] = useState("");;
        const [newPassword, setNewPassword] = useState("");

        const [saving, setSaving] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [success, setSuccess] = useState<string | null>(null);

        useEffect(() => {
            setName(user.name);
            setEmail(user.email);
        }, [user.name, user.email]);

        const startEdit = () => {
            setSuccess(null);
            setError(null);
            setEditing(true);
        };
        
        const cancelEdit = () => {
            setName(user.name);
            setEmail(user.email);
            setError(null);
            setSuccess(null);
            setEditing(false);
        };

        const save = async () => {
            setSaving(true);
            setError(null);
            setSuccess(null);

            try {
                const updated = await UpdateMe({name, email});
                onUserUpdated(updated);

                if (currentPassword.trim() || newPassword.trim()) {
                    if (!currentPassword.trim() || !newPassword.trim()) {
                        throw new Error("Fill both password fields");
                    }

                    await ChangePassword({
                        currentPassword,
                        newPassword,
                    });
                }

                setCurrentPassword("");
                setNewPassword("");
                setSuccess("Saved!");
                setEditing(false);
            } catch (e: any) {
                setError(e?.message ?? "Failed to update profile info");
            }finally {
                setSaving(false);
            }
        };
    
    return (
        <div>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-serif">Personal Information</h2>
                    <p className="text-gray-600 mt-1 font-serif">Basic profile info.</p>
                </div>

                {!editing ? (
                    <button
                        type="button"
                        onClick={startEdit}
                        className="px-4 py-2 rounded-xl border font-serif hover:bg-gray-50"
                    >
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="px-4 py-2 rounded-xl border font-serif hover:bg-gray-50 disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            disabled={saving}
                            className="px-4 py-2 rounded-xl bg-black text-white font-serif hover:scale-110 transition-transform duration-300"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 text-sm text-red-600 font-serif bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                    {error}
                </div>
            )}
            {success && (
                <div className="mt-4 text-sm text-green-700 font-serif bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                    {success}
                </div>
            )}

            <div className="mt-6 grid gap-4">
                <div className="border rounded-2xl p-4">
                    <div className="text-sm text-gray-600 font-serif">Name</div>
                    {!editing ? (
                        <div className="font-serif">{user.name}</div>
                    ) : (
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 w-full border rounded-xl px-3 py-2 outline-none focus:ring"
                            placeholder="Name"
                            disabled={saving}
                        />
                    )}
                </div>

                <div className="border rounded-2xl p-4">
                    <div className="text-sm text-gray-600 font-serif">Email</div>
                    {!editing ? (
                        <div className="font-serif">{user.email}</div>
                    ) : (
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full border rounded-xl px-3 py-2 outline-none focus:ring"
                            placeholder="Email"
                            type="email"
                            disabled={saving}
                        />
                    )}
                        </div>
                    <div className="border rounded-2xl p-4">
                        <div className="text-sm text-gray-600 font-serif">Password</div>

                            {!editing ? (
                                <div className="font-serif">••••••••</div>
                            ) : (
                                <div className="grid gap-3 mt-2">
                                    <input
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full border rounded-xl px-3 py-2 outline-none focus:ring"
                                        placeholder="Current password"
                                        type="password"
                                        disabled={saving}
                                    />

                                    <input
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full border rounded-xl px-3 py-2 outline-none focus:ring"
                                        placeholder="New password"
                                        type="password"
                                        disabled={saving}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
        </div>
    );
}

function DeletePanel({onDeleted}: {onDeleted: () => Promise<void> | void}) {
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const confirmDelete = async () => {
        setDeleting(true);
        setError(null);
        try {
            await DeleteMe();
            setOpen(false);
            await onDeleted();
        } catch (e: any) {
            setError(e?.message ?? "Failed to delete account");
        }  finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-serif">Delete account</h2>
            <p className="text-gray-600 mt-1 font-serif">this action is permanent.</p>

            {error && (
                <div className="mt-4 text-sm text-red-600 font-serif bg-red-50 border-red-100 rounded-xl px-3 py-2">
                    {error}
                </div>
            )}

            <div className="mt-6 border border-red-200 bg-red-50 rounded-2xl p-5">
                <div className="font-serif text-red-700">
                    Danger Zone
                </div>
                <div className="text-sm text-red-700 mt-2 font-serif">
                    Deleting an account is permanent.
                </div>
                <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl font-serif bg-red-600 text-white hover:scale-110 transition-transform duration-300">
                    Delete my account
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => !deleting && setOpen(false)}/>

                    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border p-6">
                        <h3 className="text-xl font-serif">Are you sure?</h3>
                        <p className="text-gray-600 mt-2 font-serif">This action will permanently delete your account and cannot be undone.</p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 rounded-xl border font-serif hover:bg-gray-50 disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded-xl bg-red-600 text-white font-serif hover:scale-110 transition-transform duration-300"
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}