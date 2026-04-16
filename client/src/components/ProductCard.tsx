import { Link } from "react-router-dom";
import type { Product } from "../services/api";
import { formatCurrency } from "../lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition hover:border-cyan-300/40 hover:bg-white/[0.07]"
    >
      <div className="aspect-[4/3] overflow-hidden bg-stone-900">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-400">
            {product.category}
          </span>
          <span className="text-lg font-semibold text-white">{formatCurrency(product.price)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-400">{product.description}</p>
        </div>
      </div>
    </Link>
  );
}
