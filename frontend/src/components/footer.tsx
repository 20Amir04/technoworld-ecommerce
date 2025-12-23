import {Link} from 'react-router-dom'

function Footer()
{
    return (
        <footer className="relative w-full bg-black text-white font-serif">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="">
                    <h2 className="font-bold mb-4 text-center">
                        PRODUCTS
                    </h2>
                    <ul className="space-y-2 flex flex-col items-center">
                        <li><Link to = "/Category/computers">Computers</Link></li>
                        <li><Link to = "/Category/laptops">Laptops</Link></li>
                        <li><Link to = "/Category/phones">Phones</Link></li>
                    </ul>
                
                </div>
                <div className="text-center">
                    <h2 className="font-bold mb-4">
                        ABOUT US
                    </h2>
                    <p className="text-sm max-w-md mx-auto font-sans">
                        Welcome to TechStore – your trusted destination for modern electronics and gadgets.
                        We provide a wide range of products including computers, laptops, and smartphones.
                        Our mission is to make technology accessible and convenient for everyone, with quality 
                        products, secure shopping, and reliable customer service.
                    </p>
                </div>
                <div className="">
                    <h2 className="font-bold mb-4 text-center">
                        FOLLOW US
                    </h2>
                    <ul className="flex flex-col items-center gap-4">
                        <li>
                            <a href="https://www.facebook.com/Microsoft/">
                                <img src={'/assets/facebook.svg'} className="h-6 w-6 hover:scale-110 transition-transform duration-200" alt="Microsoft`s Facebook page" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.instagram.com/microsoft/">
                                <img src={'/assets/instagram.svg'} className="h-6 w-6 hover:scale-110 transition-transform duration-200" alt="Microsoft`s Instagram page" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.tiktok.com/@microsoft">
                                <img src={'/assets/tiktok.svg'} className="h-6 w-6 hover:scale-110 transition-transform duration-200" alt="Microsoft`s Tiktok page" />
                            </a>
                        </li>
                        <li>
                            <a href="https://www.youtube.com/microsoft">
                                <img src={'/assets/youtube.svg'} className="h-6 w-6 hover:scale-110 transition-transform duration-200" alt="Microsoft`s Youtube channel" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
                <div className="border-t border-gray-700 mt-8 pt-4">
                    <p className="text-center text-sm">
                        © 2025 TechnoWorld Canada Limited
                    </p>
                </div>
            
        </footer>
    );
}

export default Footer