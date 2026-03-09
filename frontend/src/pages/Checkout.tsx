import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Checkout as ApiCheckout, type CheckoutPayLoad} from "../api/apiClient";
import { useCart } from "../auth/CartContext";

export default function Checkout() {
    const navigate = useNavigate();
    const {lines, loading, clear, refresh} = useCart();

    const [form, setForm] = useState<CheckoutPayLoad> ({
       fullName: "",
       email: "",
       phone: "",
       address1: "",
       address2: "",
       city: "",
       province: "",
       postalCode: "",
       country: "Canada",
       cardNumber: "",
       exp: "",
       cvc: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const summary = useMemo(() => {
        const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
        const delivery = subtotal > 1000 ? 0 : 9.99;
        const tax = subtotal * 0.13;
        const total = subtotal + delivery + tax;
        return {subtotal, delivery, tax, total};
    }, [lines]);

    const canSubmit =
    lines.length > 0 &&
    form.fullName.trim() &&
    form.email.trim() &&
    form.address1.trim() &&
    form.city.trim() &&
    form.province.trim() &&
    form.postalCode.trim() &&
    form.cardNumber.trim().length >= 12 &&
    form.cvc.trim().length >= 3 &&
    form.exp.trim().length >= 4;

    const onChange = (key: keyof CheckoutPayLoad, value: string) => {
        setError(null);
        setForm((p) => ({ ...p, [key]: value}));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const res = await ApiCheckout(form);

            await refresh().catch(() => {});
            await clear().catch(() => {});

            navigate(`/order-success?orderId=${res.orderId}`, {replace: true});
        } catch (err: any) {
            setError(err?.message ?? "Checkout failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="px-12 py-12">Loading...</div>

    return (
        <div className="px-12 py-12">
            <h1 className="text-3xl font-serif mb-6">Checkout</h1>

            {lines.length === 0 ? (
                <div className="border rounded-2xl p-10 bg-gray-50">
                    <div className="text-lg font-serif">Your cart is empty</div>
                    <div className="text-gray-600 mt-2">Add items to cart to continue</div>    
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <form onSubmit={onSubmit} className="lg:col-span-8 space-y-6">
                        <section className="bg-white border rounded-2xl p-6">
                            <h2 className="text-xl font-serif mb-4">Contact Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Full Name">
                                    <input
                                    disabled={submitting}
                                    value={form.fullName}
                                    onChange={(e) => onChange("fullName", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus:ring"
                                    placeholder="John Doe"
                                    />
                                </Field>

                                <Field label="Email">
                                    <input
                                    disabled={submitting}
                                    value={form.email}
                                    onChange={(e) => onChange("email", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="john@mail.com"
                                    type="email"
                                    />
                                </Field>

                                <Field label="Phone">
                                    <input
                                    disabled={submitting}
                                    value={form.phone}
                                    onChange={(e) => onChange("phone", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="+1 604..."
                                    />
                                </Field>
                            </div>
                        </section>

                        <section className="bg-white border rounded-2xl p-6">
                            <h2 className="text-lg font-serif mb-4">Shipping address</h2>

                            <div className="grid grid-cols-1 gap-4">
                                <Field label="Address line 1">
                                    <input
                                    disabled={submitting}
                                    value={form.address1}
                                    onChange={(e) => onChange("address1", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="123 Main St"
                                    />
                                </Field>

                                <Field label="Address line 2 (Optional)">
                                    <input
                                    disabled={submitting}
                                    value={form.address2 ?? ""}
                                    onChange={(e) => onChange("address2", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="Apt, unit, etc."
                                    />
                                </Field>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field label="City">
                                    <input
                                    disabled={submitting}
                                    value={form.city}
                                    onChange={(e) => onChange("city", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    />
                                </Field>

                                <Field label="Province">
                                    <input
                                    disabled={submitting}
                                    value={form.province}
                                    onChange={(e) => onChange("province", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="BC"
                                    />
                                </Field>

                                <Field label="Postal Code">
                                    <input
                                    disabled={submitting}
                                    value={form.postalCode}
                                    onChange={(e) => onChange("postalCode", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="V5K 0A1"
                                    />
                                </Field>

                                <Field label="Country">
                                    <input
                                    disabled={submitting}
                                    value={form.country}
                                    onChange={(e) => onChange("country", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    />
                                </Field>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white border rounded-2xl p-6">
                            <h2 className="text-xl font-serif mb-4">Payment</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Card Number">
                                    <input
                                    disabled={submitting}
                                    value={form.cardNumber}
                                    onChange={(e) => onChange("cardNumber", e.target.value.replace(/\s/g, ""))}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="4111111111111111"
                                    inputMode="numeric"
                                    />
                                </Field>

                                <Field label="Expiry (MM/YY)">
                                    <input
                                    disabled={submitting}
                                    value={form.exp}
                                    onChange={(e) => onChange("exp", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="12/28"
                                    />
                                </Field>

                                <Field label="CVC">
                                    <input
                                    disabled={submitting}
                                    value={form.cvc}
                                    onChange={(e) => onChange("cvc", e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2 outline-none focus-ring"
                                    placeholder="123"
                                    inputMode="numeric"
                                    />
                                </Field>
                            </div>

                            {error && (
                                <div className="mt-4 text-sm text-red-600 font-serif bg-red-50 border border-red-100 rounded-xl px-3 py-2">{error}
                                </div>
                            )}

                            <button
                                disabled={!canSubmit || submitting}
                                className="mt-6 w-full bg-black text-white py-3 rounded-xl font-medium hover:scale-105 transition-transform duration-300 disabled:opacity-60 disabled:hover:scale-100"
                                >
                                    {submitting ? "Placing order..." : "Place order"}
                                </button>
                        </section>
                    </form>

                    <aside className="lg:col-span-4">
                        <div className="border rounded-2xl p-6 shadow-sm bg-white">
                            <h2 className="font-serif text-sm mb-6 uppercase text-center">Order Summary</h2>
                            
                            <div className="space-y-3 text-black text-lg">
                                <div className="flex justify-between">
                                    <span className="font-serif">{lines.length} Items</span>
                                    <span>C$ {summary.subtotal.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-serif">Delivery</span>
                                    <span>{summary.delivery === 0 ? "Free" : `C$ ${summary.delivery.toFixed(2)}`}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-serif">HST</span>
                                    <span>C$ {summary.tax.toFixed(2)}</span>
                                </div>

                                <hr className="my-4"/>

                                <div className="mb-2 flex justify-between font-bold">
                                    <span className="font-serif">Total</span>
                                    <span>C$ {summary.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}

function Field({label, children}: {label: string; children: React.ReactNode}) {
    return (
        <div>
            <label className="text-sm text-gray-700 font-serif">{label}</label>
            <div className="mt-1">{children}</div>
        </div>
    );
}