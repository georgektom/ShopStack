import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { Cart } from "../services/api";
import { getCart } from "../services/cart";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  setCart: (cart: Cart | null) => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshCart() {
    setLoading(true);

    try {
      const nextCart = await getCart();
      setCart(nextCart);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshCart();
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      setCart,
      refreshCart
    }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
