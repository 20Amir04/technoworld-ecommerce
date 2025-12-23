import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import Navbar from './components/nav'
import Category from './pages/Category'
import Home from './pages/Home'
import Footer from './components/footer'
import SubCategory from './pages/SubCategory'
import Cart from "./pages/Cart"
import Wishlist from './pages/Wishlist'
import AuthPage from './pages/AuthPage'
import ProductPage from './pages/ProductPage'


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <main className="flex-grow mt-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/category/:name/:sub" element={<SubCategory />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/Product/:id" element={<ProductPage/>} />
      </Routes>
    </main>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
