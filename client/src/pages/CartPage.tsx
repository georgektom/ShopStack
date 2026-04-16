import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../app/CartContext";
import { Button } from "../components/Button";
import { CartLineItem } from "../components/CartLineItem";
import { StatusState } from "../components/StatusState";
import { formatCurrency } from "../lib/format";
import { ApiError } from "../services/api";
import { removeCartItem, updateCartItem } from "../services/cart";

export function CartPage() {
  const { cart, loading, setCart } = useCart();
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleQuantityChange(productId: string, quantity: number) {
    setSavingItemId(productId);
    setError(null);

    try {
      const nextCart = await updateCartItem(productId, quantity);
      setCart(nextCart);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to update your cart.");
    } finally {
      setSavingItemId(null);
    }
  }

  async function handleRemove(productId: string) {
    setSavingItemId(productId);
    setError(null);

    try {
      const nextCart = await removeCartItem(productId);
      setCart(nextCart);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to remove item.");
    } finally {
      setSavingItemId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Guest cart</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Cart</h1>
        </div>
        <Link to="/" className="text-sm text-stone-400 transition hover:text-white">
          Continue shopping
        </Link>
      </div>

      {loading ? (
        <StatusState title="Loading cart" description="Syncing the latest cart contents from the server." />
      ) : !cart || cart.items.length === 0 ? (
        <StatusState
          title="Your cart is empty"
          description="Add a product from the catalog to start building your cart."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                disabled={savingItemId === item.productId}
                item={item}
                onQuantityChange={(quantity) => void handleQuantityChange(item.productId, quantity)}
                onRemove={() => void handleRemove(item.productId)}
              />
            ))}
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-stone-500">Summary</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-stone-300">
                <span>Items</span>
                <span>{cart.itemCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-stone-300">
                <span>Subtotal</span>
                <span>{formatCurrency(cart.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold text-white">
                <span>Total</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
            </div>

            {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}

            <div className="mt-8">
              <Button className="w-full" disabled type="button">
                Checkout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
