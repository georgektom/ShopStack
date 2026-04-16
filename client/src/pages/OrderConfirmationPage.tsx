import { Link, Navigate, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { formatCurrency } from "../lib/format";
import type { Order } from "../services/api";

export function OrderConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8">
      <section className="rounded-[2.5rem] border border-cyan-300/20 bg-cyan-300/10 p-8">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-100">Order confirmed</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">
          Thanks, {order.customerName}.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/80">
          Your order has been placed successfully and inventory has been updated.
        </p>

        <div className="mt-8 grid gap-4 rounded-[2rem] border border-white/10 bg-stone-950/40 p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Order id</p>
            <p className="mt-2 break-all text-sm text-white">{order.id}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Status</p>
            <p className="mt-2 text-sm capitalize text-white">{order.status}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Total</p>
            <p className="mt-2 text-sm text-white">{formatCurrency(order.total)}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/">
            <Button type="button">Back to catalog</Button>
          </Link>
          <Link to="/cart">
            <Button type="button" variant="secondary">
              View cart
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
