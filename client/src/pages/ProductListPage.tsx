import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { StatusState } from "../components/StatusState";
import { ApiError, type Product } from "../services/api";
import { getProducts } from "../services/products";

const categories = [
  { label: "All", value: "" },
  { label: "Audio", value: "audio" },
  { label: "Computing", value: "computing" },
  { label: "Accessories", value: "accessories" },
  { label: "Smart Home", value: "smart-home" }
];

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadProducts();
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [search, category, sort]);

  async function loadProducts() {
    setLoading(true);
    setError(null);

    try {
      const data = await getProducts({
        search,
        category,
        sort
      });

      setProducts(data);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Unable to load products.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <section className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 lg:p-10">
        <p className="text-sm uppercase tracking-[0.32em] text-cyan-200/80">Electronic store</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Welcome to electronic store
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300">
          Browse a catalog of modern electronics and view product details powered by the backend API.
        </p>
      </section>

      <section className="mt-10">
        <div className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 lg:grid-cols-[2fr_1fr_1fr]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product or description"
            className="rounded-full border border-white/10 bg-stone-950 px-5 py-3 text-sm text-white outline-none ring-0 placeholder:text-stone-500"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-full border border-white/10 bg-stone-950 px-5 py-3 text-sm text-white outline-none"
          >
            {categories.map((item) => (
              <option key={item.value || "all"} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-full border border-white/10 bg-stone-950 px-5 py-3 text-sm text-white outline-none"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </div>
      </section>

      <section className="mt-10">
        {loading ? (
          <StatusState
            title="Loading products"
            description="Pulling the latest catalog from the electronic store API."
          />
        ) : error ? (
          <StatusState title="Could not load products" description={error} />
        ) : products.length === 0 ? (
          <StatusState
            title="No matching products"
            description="Try adjusting the search term or category filter."
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
