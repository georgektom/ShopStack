import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./app/AuthContext";
import { CartProvider } from "./app/CartContext";
import { AppShell } from "./components/AppShell";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LoginPage } from "./pages/LoginPage";
import { OrderConfirmationPage } from "./pages/OrderConfirmationPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductListPage } from "./pages/ProductListPage";
import { RegisterPage } from "./pages/RegisterPage";

export function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </AuthProvider>
    </CartProvider>
  );
}
