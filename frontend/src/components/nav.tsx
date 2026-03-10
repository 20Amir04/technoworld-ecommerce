import { Link, useNavigate } from 'react-router-dom'
import {useState} from 'react'
import {UserIcon, ShoppingCartIcon, HeartIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon} from "@heroicons/react/24/outline"


function Navbar ()
{
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const handleSearch = () => {
    const value = search.trim();
    if (!value) return;

    navigate(`/search?q=${encodeURIComponent(value)}`);
    setIsOpen(false);
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  }
    return (
        <nav className="relative w-full bg-black flex items-center justify-between text-white h-20 px-20 z-15">
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
                <img src={'/assets/logo1.png'} alt="Home Page" />
              </Link>
          </div>
          <div className="gap-10 text-lg font-medium font-serif hidden md:flex w-40">
            <Link to = "/Category/computers" className="hover:scale-110 transition-transform duration-200">COMPUTERS</Link>
            <Link to = "/Category/laptops" className="hover:scale-110 transition-transform duration-200">LAPTOPS</Link>
            <Link to = "/Category/phones" className="hover:scale-110 transition-transform duration-200">PHONES</Link>
          </div>

          <div className='flex items-center gap-4 md:gap-6'>
            <form onSubmit={onSearchSubmit} className='hidden md:block'>
              <div className='flex items-center bg-white text-black border border-gray-300 rounded-sm overflow-hidden'>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type='text'
                  placeholder='Search'
                  className='w-44 lg:w-60 px-4 py-2 outline-none font-serif text-sm'
                />
                <button
                  type='submit'
                  className='px-3 py-2 hover:bg-gray-100 transition'
                  aria-label='Search'
                >
                  <MagnifyingGlassIcon className='h-6 w-6 hover:scale-110 transition-transform duration-200'/>
                </button>
              </div>
            </form>        
        
            <Link to = "/Cart"><ShoppingCartIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/></Link>
            <Link to ="/Wishlist" className="hidden md:block"><HeartIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/></Link>
            <Link to ="/auth" aria-label='Account'><UserIcon className="h-6 w-6 hover:scale-110 transition-transform duration-200"/></Link>
         </div>

          {isOpen && (
          <div className="absolute top-20 left-0 w-full bg-black flex flex-col items-center gap-6 py-6 md:hidden">
            <form onSubmit={onSearchSubmit} className='w-[85%]'>
              <div className='flex items-center bg-white text-black border-gray-300 rounded-sm overflow-hidden'>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type='text'
                  placeholder='Search'
                  className='w-full px-4 py-2 outline-none font-serif text-sm'
                />
                <button
                  type='submit'
                  className='px-3 py-2 hover:bg-gray-100 transition'
                  aria-label='Search'
                >
                  <MagnifyingGlassIcon className='h-6 w-6 hover:scale-110 transition-transform duration-200'/>
                </button>
              </div>
            </form>
            <Link to="/Category/computers" className="hover:scale-110 transition-transform duration-200" onClick={() => setIsOpen(false)}>COMPUTERS</Link>
            <Link to="/Category/laptops" className="hover:scale-110 transition-transform duration-200" onClick={() => setIsOpen(false)}>LAPTOPS</Link>
            <Link to="/Category/phones" className="hover:scale-110 transition-transform duration-200" onClick={() => setIsOpen(false)}>PHONES</Link>
        </div>
          )}  
        </nav>        
    );
}

export default Navbar