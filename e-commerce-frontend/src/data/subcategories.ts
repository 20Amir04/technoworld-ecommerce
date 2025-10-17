import DesktopPC from "../assets/desktopPC.png";
import GamingPC from "../assets/GamingPC.png";
import Imac from "../assets/IMac.png";
import Laptop1 from "../assets/45999.png";
import GamingLaptop from "../assets/gaminglt.png";
import Macbook from "../assets/macbook.png";
import Android from "../assets/android/android2.png";
import Iphone from "../assets/iphone/iphone1.png";

export const subcategories = {

    computers: [
        {id:1, name: "Desktop Computer", slug: "desktop", image: DesktopPC},
        {id:2, name: "Gaming Computer", slug: "gaming", image: GamingPC},
        {id:3, name: "IMac", slug: "Imac", image: Imac} 
    ],

    laptops: [
        {id:1, name: "Desktop Laptops", slug: "desktop", image: Laptop1},
        {id:2, name: "Gaming Laptops", slug: "gaming", image: GamingLaptop},
        {id:3, name: "Macbook", slug: "macbook", image: Macbook} 
    ],

    phones: [
        {id:1, name: "Android", slug: "android", image: Android},
        {id:2, name: "Iphone", slug: "iphone", image: Iphone}   
    ]

}
    