import Dlaptop1 from "../assets/desktopLaptop/laptop1.png"
import Dlaptop2 from "../assets/desktopLaptop/laptop2.png"
import Dlaptop3 from "../assets/desktopLaptop/laptop3.png"
import Dlaptop4 from "../assets/desktopLaptop/laptop4.png"
import Dlaptop5 from "../assets/desktopLaptop/laptop5.png"

import Glaptop1 from "../assets/gamingLaptop/glaptop1.png"
import Glaptop2 from "../assets/gamingLaptop/glaptop2.png"
import Glaptop3 from "../assets/gamingLaptop/glaptop3.png"
import Glaptop4 from "../assets/gamingLaptop/glaptop4.png"
import Glaptop5 from "../assets/gamingLaptop/glaptop5.png"

import Macbook1 from "../assets/macbook/macbook1.png"
import Macbook2 from "../assets/macbook/macbook2.png"
import Macbook3 from "../assets/macbook/macbook3.png"
import Macbook4 from "../assets/macbook/macbook4.png"
import Macbook5 from "../assets/macbook/macbook5.png"


export const laptops = {
    desktop: [
        {id:1, name: "HP 15.6' Laptop - Jet Black", price: 799.99, image: Dlaptop1},
        {id:2, name: "Lenovo IdeaPad Slim 3x 15.3' Copilot+ PC Laptop", price: 999.99, image: Dlaptop2},
        {id:3, name: "Acer Aspire Lite 15.6' Laptop - Silver", price: 549.99, image: Dlaptop3},
        {id:4, name: "Lenovo Yoga Slim 7x 14.5' Touchscreen Copilot+ PC Laptop - Cosmic Blue", price: 1699.99, image: Dlaptop4},
        {id:5, name: "ASUS Vivobook S16 16' AI Laptop - Matte Grey", price: 799.99, image: Dlaptop5}
    ],

    gaming: [
        {id:1, name: "ASUS TUF F15 15.6' 144Hz Gaming Laptop", price: 1799.99, image: Glaptop1},
        {id:2, name: "ASUS ROG Strix G16 16' 165Hz Gaming Laptop", price: 1999.99, image: Glaptop2},
        {id:3, name: "Lenovo Legion 5i 15.1' Gaming Laptop - Eclipse Black", price: 1999.99, image: Glaptop3},
        {id:4, name: "Acer Nitro V 15.6' Gaming Laptop", price: 999.99,image: Glaptop4},
        {id:5, name: "Lenovo Legion 7i 16' Gaming Laptop - White", price: 2799.99,image: Glaptop5}
    ],

    macbook: [
        {id:1, name: "Apple MacBook Air 13.6' w/ Touch ID (2025)", price: 1399.99,image: Macbook1},
        {id:2, name: "Apple MacBook Pro 16-inch", price: 1899.99, image: Macbook2},
        {id:3, name: "Apple MacBook Air 13.3' w/ Touch ID (Fall 2020)", price: 933.99, image: Macbook3},
        {id:4, name: "Apple MacBook Pro (2020) w/ Touch Bar 13.3'", price: 769.99, image: Macbook4},
        {id:5, name: "Desktop Apple MacBook Air 13.6' w/ Touch ID (2022) - MidnightPC", price: 859.99, image: Macbook5}
    ]
}