import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../app/CartContext";
import { Button } from "../components/Button";
import { StatusState } from "../components/StatusState";
import { formatCurrency } from "../lib/format";
import { ApiError } from "../services/api";
import { createOrder } from "../services/orders";

type FieldErrors = {
  customerName?: string;
  customerEmail?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  postalCode?: string;
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading, setCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  function validateForm() {
    const nextErrors: FieldErrors = {};

    if (customerName.trim().length < 2) {
      nextErrors.customerName = "Enter your full name.";
    }

    if (!customerEmail.includes("@")) {
      nextErrors.customerEmail = "Enter a valid email address.";
    }

    if (addressLine1.trim().length < 5) {
      nextErrors.addressLine1 = "Enter a street address.";
    }

    if (city.trim().length < 2) {
      nextErrors.city = "Enter a city.";
    }

    if (state.trim().length < 2) {
      nextErrors.state = "Enter a state.";
    }

    if (postalCode.trim().length < 5) {
      nextErrors.postalCode = "Enter a valid postal code.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim()
      });

      setCart({
        id: cart?.id ?? "",
        itemCount: 0,
        subtotal: 0,
        total: 0,
        items: []
      });

      navigate("/order-confirmation", { state: { order } });
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Unable to place order.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <StatusState title="Loading checkout" description="Syncing cart details before checkout." />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <StatusState
          title="Nothing to check out"
          description="Add products to your cart before placing an order."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[1fr_0.8fr] lg:px-8">
      <form
        className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8"
        onSubmit={handleSubmit}
      >
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Checkout</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Shipping details</h1>

        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Name</span>
            <input
              className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
              onChange={(event) => setCustomerName(event.target.value)}
              value={customerName}
            />
            {errors.customerName ? <p className="mt-2 text-sm text-rose-300">{errors.customerName}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Email</span>
            <input
              className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
              onChange={(event) => setCustomerEmail(event.target.value)}
              type="email"
              value={customerEmail}
            />
            {errors.customerEmail ? (
              <p className="mt-2 text-sm text-rose-300">{errors.customerEmail}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Street address</span>
            <input
              className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
              onChange={(event) => setAddressLine1(event.target.value)}
              placeholder="123 Market Street"
              value={addressLine1}
            />
            {errors.addressLine1 ? <p className="mt-2 text-sm text-rose-300">{errors.addressLine1}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-stone-300">Apartment, suite, etc. (optional)</span>
            <input
              className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
              onChange={(event) => setAddressLine2(event.target.value)}
              placeholder="Suite 400"
              value={addressLine2}
            />
          </label>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm text-stone-300">City</span>
              <input
                className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
                onChange={(event) => setCity(event.target.value)}
                value={city}
              />
              {errors.city ? <p className="mt-2 text-sm text-rose-300">{errors.city}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-stone-300">State</span>
              <input
                className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
                onChange={(event) => setState(event.target.value)}
                placeholder="CO"
                value={state}
              />
              {errors.state ? <p className="mt-2 text-sm text-rose-300">{errors.state}</p> : null}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-stone-300">ZIP code</span>
              <input
                className="w-full rounded-3xl border border-white/10 bg-stone-950 px-5 py-3 text-white outline-none"
                onChange={(event) => setPostalCode(event.target.value)}
                placeholder="80202"
                value={postalCode}
              />
              {errors.postalCode ? <p className="mt-2 text-sm text-rose-300">{errors.postalCode}</p> : null}
            </label>
          </div>
        </div>

        {serverError ? <p className="mt-5 text-sm text-rose-300">{serverError}</p> : null}

        <Button className="mt-8 w-full" disabled={saving} type="submit">
          {saving ? "Placing order..." : "Place order"}
        </Button>
      </form>

      <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm uppercase tracking-[0.28em] text-stone-500">Order summary</p>
        <div className="mt-6 space-y-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{item.product.name}</p>
                <p className="text-sm text-stone-400">Qty {item.quantity}</p>
              </div>
              <div className="text-sm text-stone-300">{formatCurrency(item.lineTotal)}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between font-semibold text-white">
            <span>Total</span>
            <span>{formatCurrency(cart.total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
