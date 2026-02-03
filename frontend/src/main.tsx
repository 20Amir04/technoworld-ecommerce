import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthContext.tsx'
import { WishlistProvider } from './auth/WishlistContext.tsx'
import { CartProvider } from './auth/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </StrictMode>,
);
