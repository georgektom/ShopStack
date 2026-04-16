import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../app/CartContext";
import { Button } from "../components/Button";
import { QuantitySelector } from "../components/QuantitySelector";
import { StatusState } from "../components/StatusState";
import { formatCurrency } from "../lib/format";
import { ApiError, type Product } from "../services/api";
import { addToCart } from "../services/cart";
import { getProduct } from "../services/products";

export function ProductDetailPage() {
  const { productId = "" } = useParams();
  const { setCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    void loadProduct();
  }, [productId]);

  async function loadProduct() {
    setLoading(true);
    setError(null);

    try {
      const data = await getProduct(productId);
      setProduct(data);
      setQuantity(1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load product details.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart() {
    if (!product) {
      return;
    }

    setSaving(true);
    setNotice(null);
    setError(null);

    try {
      const nextCart = await addToCart(product.id, quantity);
      setCart(nextCart);
      setNotice(`${product.name} added to your cart.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to add item to cart.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <StatusState
          title="Loading product"
          description="Fetching the product detail page from the API."
        />
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <StatusState title="Product unavailable" description={error ?? "This item could not be found."} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-stone-400 transition hover:text-white">
          Back to products
        </Link>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <img src={product.image} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-stone-400">
              {product.category}
            </span>
            <span className="text-sm text-stone-400">{product.inventoryCount} in stock</span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">{product.name}</h1>
          <p className="mt-4 text-base leading-7 text-stone-300">{product.description}</p>
          <div className="mt-8 text-3xl font-semibold text-white">{formatCurrency(product.price)}</div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantitySelector
              quantity={quantity}
              onChange={setQuantity}
              max={Math.min(10, product.inventoryCount)}
            />
            <Button
              className="min-w-40"
              disabled={saving || product.inventoryCount === 0}
              onClick={handleAddToCart}
              type="button"
            >
              {saving ? "Adding..." : "Add to cart"}
            </Button>
            <Link to="/cart">
              <Button type="button" variant="secondary">
                View cart
              </Button>
            </Link>
          </div>

          {notice ? <p className="mt-5 text-sm text-cyan-200">{notice}</p> : null}
          {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}
        </div>
      </section>
    </div>
  );
}
