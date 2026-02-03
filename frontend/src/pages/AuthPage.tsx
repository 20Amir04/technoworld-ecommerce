import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import {Login, Register} from "../api/apiClient"
import { useNavigate, useSearchParams } from "react-router-dom";

type Tab = "orders" | "details" | "delete";

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

        /* NOT LOGINED */
    
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
                        {tab === "details" && <DetailsPanel user={user} />}
                        {tab === "delete" && <DeletePanel/>}
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

function OrdersPanel() {
    return (
        <div>
            <h2 className="text-2xl font-serif">Order History</h2>
            <p className="text-gray-600 mt-1">See your purchases wherever you check out.</p>

            <div className="mt-6 border rounded-2xl p-10 text-center bg-gray-50">
                <div className="text-lg font-serif">Nothing to show yet!</div>
                <div className="text-gray-600 mt-2">
                    Check back in after you shop online to track your order status and more.
                </div>
            </div>
        </div>
    );
}

function DetailsPanel({user}: {user: {name: string; email: string}}) {
    return (
        <div>
            <h2 className="text-2xl font-serif">Personal Information</h2>
            <p className="text-gray-600 mt-1">Basic profile info.</p>

            <div className="mt-6 grid gap-4">
                <div className="border rounded-2xl p-4">
                    <div className="text-sm text-gray-600">Name</div>
                    <div className="font-serif">{user.name}</div>
                </div>
                <div className="border rounded-2xl p-4">
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-serif">{user.email}</div>
                </div>

                <div className="text-sm text-gray-500">

                </div>
            </div>
        </div>
    );
}

function DeletePanel() {
    return (
        <div>
            <h2 className="text-2xl font-serif">Delete account</h2>
            <p className="text-gray-600 mt-1 font-serif">this action is permanent.</p>

            <div className="mt-6 border border-red-200 bg-red-50 rounded-2xl p-5">
                <div className="font-serif text-red-700">
                    Danger Zone
                </div>
                <div className="text-sm text-red-700 mt-2"></div>
                <button
                disabled
                className="mt-4 px-4 py-2 rounded-xl font-serif bg-red-600 text-white opacity-60 cursor-not-allowed">
                    Delete my account
                </button>
            </div>
        </div>
    );
}