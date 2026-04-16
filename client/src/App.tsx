import { Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "./app/CartContext";
import { AppShell } from "./components/AppShell";
import { CartPage } from "./pages/CartPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductListPage } from "./pages/ProductListPage";

export function App() {
  return (
    <CartProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </CartProvider>
  );
}
