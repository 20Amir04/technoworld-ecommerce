import { Link } from 'react-router-dom'
import {useState} from 'react'
import logo from '../assets/logo1.png'
import {UserIcon, ShoppingCartIcon, HeartIcon, Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline"

function Navbar ()
{
  const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="relative w-full bg-black flex items-center justify-between text-white h-20 px-12">
          <div className="md:hidden flex justify-between gap-10">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <XMarkIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
              ) : (
                <Bars3Icon className="h-6 w-6 hover:scale-110 transition-transform duration-200" />
              )}
            </button>
            <Link to ="/Wishlist">
              <HeartIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/>
            </Link>
          </div>
          <div className="flex justify-center md:justify-start hover:scale-105 transition-transform duration-200">
              <Link to="/" className="h-32 w-32 py-7">
                <img src={logo} alt="Home Page" />
              </Link>
          </div>
          <div className="gap-10 text-lg font-medium font-serif hidden md:flex ">
            <Link to = "/Category/computers" className="hover:scale-110 transition-transform duration-200">COMPUTERS</Link>
            <Link to = "/Category/laptops" className="hover:scale-110 transition-transform duration-200">LAPTOPS</Link>
            <Link to = "/Category/phones" className="hover:scale-110 transition-transform duration-200">PHONES</Link>
          </div>
          <div className="flex gap-10 text-lg font-medium">
            <Link to = "/Cart"><ShoppingCartIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/></Link>
            <Link to ="/Wishlist" className="hidden md:block"><HeartIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/></Link>
            <Link to ="/Registration"><UserIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/></Link>
          </div>  
          {isOpen && (
          <div className="absolute top-20 left-0 w-full bg-black flex flex-col items-center gap-6 py-6 md:hidden">
            <Link to="/category/computers" onClick={() => setIsOpen(false)}>COMPUTERS</Link>
            <Link to="/category/laptops" onClick={() => setIsOpen(false)}>LAPTOPS</Link>
            <Link to="/category/phones" onClick={() => setIsOpen(false)}>PHONES</Link>
        </div>
          )}  
        </nav>        
    );
}

export default Navbar