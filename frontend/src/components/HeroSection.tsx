

function HeroBanner()
{
    return (
        <section id="hero" className="relative w-full h-[89vh] overflow-hidden bg-local mt-[-80px]">
      <img src={"/assets/hero-banner.png"} alt="hero-background" className="absolute w-full h-full object-cover brightness-75 z-0"/>
      <div className="relative flex justify-center text-center px-10 text-5xl mt-20">
        <h1 className="text-white font-serif text-[clamp(1.2rem,4vw,3rem)]">
          Welcome to the TechnoWorld
        </h1>
      </div>
      <div className="relative z-10 flex flex-col justify-center space-y-4 items-start h-full mt-10 px-8 text-white font-serif">
        <h2 className="text-4xl  font-bold bg-black px-2 text-[clamp(1.5rem,3vw,3rem)]">
          Discover new techologies
        </h2>
        <p className=" bg-black px-2 text-[clamp(0.5rem,1vw,3rem)]">
          Upgrade your setup with the latest computers, laptops and smartphones from TechnoWorld
        </p>
        <a href="/Category/computers" className="bg-black hover:scale-110 transition-transform duration-300 px-7 py-3 rounded-full font-medium">
          Check Now!
        </a>
      </div>
    </section>
    );
}

export default HeroBanner