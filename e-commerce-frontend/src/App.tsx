import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/global.css'
import Navbar from './components/nav'
import Category from './pages/Category'
import Home from './pages/Home'
import Footer from './components/footer'


function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <main className="flex-grow mt-20">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
    </Routes>
    </main>
    <Footer/>
    </BrowserRouter>
  )
}

export default App
