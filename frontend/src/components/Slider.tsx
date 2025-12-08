import {Swiper, SwiperSlide} from "swiper/react"
import { Navigation, Pagination, Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import laptop1 from "../assets/laptop1.jpg"
import laptop2 from "../assets/laptop2.jpg"
import laptop3 from "../assets/laptop3.jpg"
import laptop4 from "../assets/laptop4.jpg"

function LaptopSlider()
{
    return (
        <section className="mt-10 font-serif">
            <h1 className="mb-10 flex justify-center text-[clamp(1.2rem,4vw,3rem)]">
                Check Our Laptops
            </h1>
            <div className="">
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
                    <SwiperSlide>
                        <div className="border border-transparent hover:border-black">
                            <img src={laptop1}/>
                            <h3 className="">HP 15.6" Laptop - Jet Black (Intel Core i5-1334U/16GB RAM/512GB SSD/Windows 11)</h3>
                            <p>C$599.99</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="border border-transparent hover:border-black">
                            <img src={laptop2}/>
                            <h3 className="">HP 15.6" Laptop - Jet Black (Intel Core i5-1334U/16GB RAM/512GB SSD/Windows 11)</h3>
                            <p>C$599.99</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="border border-transparent hover:border-black">
                            <img src={laptop3}/>
                            <h3 className="">HP 15.6" Laptop - Jet Black (Intel Core i5-1334U/16GB RAM/512GB SSD/Windows 11)</h3>
                            <p>C$599.99</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="border border-transparent hover:border-black">
                            <img src={laptop4}/>
                            <h3 className="">HP 15.6" Laptop - Jet Black (Intel Core i5-1334U/16GB RAM/512GB SSD/Windows 11)</h3>
                            <p>C$599.99</p>
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="border border-transparent hover:border-black">
                            <img src={laptop4}/>
                            <h3 className="">HP 15.6" Laptop - Jet Black (Intel Core i5-1334U/16GB RAM/512GB SSD/Windows 11)</h3>
                            <p>C$599.99</p>
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>
            <div className="text-white font-medium flex justify-center mt-5 mb-10">
                <a href="/Category/laptops" className=" bg-black hover:scale-110 transition-transform duration-300 px-7 py-3 rounded-full">
                    Check Now!
                </a>
            </div>
            
        </section>
    );
}

export default LaptopSlider