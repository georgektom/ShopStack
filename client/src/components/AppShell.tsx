import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../app/CartContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-semibold text-cyan-200">
              ES
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">ShopStack</div>
              <div className="text-xs uppercase tracking-[0.24em] text-stone-400">
                Electronic Store
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-stone-300">
            <NavLink to="/" className="hover:text-white">
              Products
            </NavLink>
            <NavLink to="/cart" className="hover:text-white">
              Cart ({cart?.itemCount ?? 0})
            </NavLink>
          </nav>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
