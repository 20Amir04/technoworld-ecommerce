import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext.tsx'
import { WishlistProvider } from './auth/WishlistContext.tsx'
import { CartProvider } from './auth/CartContext.tsx'
import { ToastProvider } from './components/ToastContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
);
