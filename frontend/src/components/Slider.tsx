import { useEffect, useState } from "react";
import {Swiper, SwiperSlide} from "swiper/react"
import { Navigation, Pagination, Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


import ProductCard from "./ProductCard";
import { FetchAllProducts, type Product } from "../api/apiClient";


function LaptopSlider()
{
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>
    {
        const load = async () => {
            try{
                const all = await FetchAllProducts();
                const laptops = all
                .filter((p) => p.category === "laptops")
                .slice(0, 12);

                setItems(laptops);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <section className="mt-10 font-serif">
            <h1 className="mb-10 flex justify-center text-[clamp(1.2rem,4vw,3rem)]">
                Check Our Laptops
            </h1>

            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ): (
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true}}
                    className="flex space-y-10"
                    autoplay={{delay: 4000}}
                    loop={true}
                    breakpoints={{
                        640: {slidesPerView:2},
                        1024: {slidesPerView:3},
                        1280: {slidesPerView: 4},
                        
                    }}
                >
                    {items.map((p) => (
                    <SwiperSlide key={p.id}>
                        <ProductCard product={p}/>
                    </SwiperSlide>
                    ))}
                </Swiper>
            )}
            <div className="text-white font-medium flex justify-center mt-5 mb-10">
                <a href="/Category/laptops" className=" bg-black hover:scale-110 transition-transform duration-300 px-7 py-3 rounded-full">
                    Check Now!
                </a>
            </div>
        </section>
    );
}

export default LaptopSlider