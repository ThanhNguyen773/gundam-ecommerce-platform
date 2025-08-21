// // src/components/BannerSlider.jsx
// import { useEffect, useState, useRef } from "react";
// import { useBannerStore } from "../stores/useBannerStore";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const BannerSlider = () => {
//   const { banners, fetchBanners } = useBannerStore();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const timeoutRef = useRef(null);

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   useEffect(() => {
//     startAutoSlide();
//     return () => stopAutoSlide();
//   }, [currentIndex, banners]);

//   const startAutoSlide = () => {
//     stopAutoSlide();
//     timeoutRef.current = setTimeout(() => {
//       handleNext();
//     }, 4000); 
//   };

//   const stopAutoSlide = () => {
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//     }
//   };

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev + 1) % banners.length);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
//   };

//   if (!Array.isArray(banners) || banners.length === 0) return null;

//   return (
//     <div className="relative w-full h-[250px] overflow-hidden mb-8 rounded-xl">
//       {banners.map((banner, index) => (
//         <a
//           key={banner._id}
//           href={banner.link || "#"}
//           className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
//             index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
//           }`}
//         >
//           <img
//             src={banner.image}
//             alt={banner.title}
//             className="w-full h-full object-cover rounded-xl"
//           />
//         </a>
//       ))}

//       <button
//         onClick={handlePrev}
//         className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20"
//       >
//         <ChevronLeft size={24} />
//       </button>

//       <button
//         onClick={handleNext}
//         className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20"
//       >
//         <ChevronRight size={24} />
//       </button>
//     </div>
//   );
// };

// export default BannerSlider;
import { useEffect, useState, useRef } from "react";
import { useBannerStore } from "../stores/useBannerStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BannerSlider = () => {
  const { banners, fetchBanners } = useBannerStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);


  const activeBanners = Array.isArray(banners)
    ? banners.filter(b => b.isActive)
    : [];

  useEffect(() => {
    if (activeBanners.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [currentIndex, activeBanners]);

  const startAutoSlide = () => {
    stopAutoSlide();
    timeoutRef.current = setTimeout(() => {
      handleNext();
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  if (activeBanners.length === 0) return null; 

  return (
<div className="relative w-full h-[150px] sm:h-[200px] lg:h-[250px] overflow-hidden mb-8 rounded-xl">

      {activeBanners.map((banner, index) => (
        <a
          key={banner._id}
          href={banner.link || "#"}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover rounded-xl"
          />
        </a>
      ))}

      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full z-20"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default BannerSlider;
