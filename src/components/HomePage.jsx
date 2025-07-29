// import React, { useState, useEffect, useRef } from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import img1 from "../../src/components/homepagePic/banner.jpg";
// import img2 from "../../src/components/homepagePic/Baptism4.jpg";
// import img3 from "../../src/components/homepagePic/birth.jpg";
// import img4 from "../../src/components/homepagePic/cake1.jpg";
// import img5 from "../../src/components/homepagePic/stage12.jpg";
// import img6 from "../../src/components/homepagePic/supply.jpg";
// import img7 from "../../src/components/homepagePic/table.jpg";
// import img8 from "../../src/components/homepagePic/sssssss.jpg";
// import img9 from "../../src/components/homepagePic/table2.jpg";
// import img10 from "../../src/components/homepagePic/stage.jpg";
// import img11 from "../../src/components/homepagePic/Bannerde.jpg";
// import img12 from "../../src/components/homepagePic/sssss.jpg";
// import img13 from "../../src/components/homepagePic/s11.jpg";
// import bc from "../../src/components/background/bc.jpg";
// import ContactForm from "./mail";
// import FeedbackModal from "../../src/ticketmanagement/Addticket.jsx";
// import AboutUs from "../components/AboutUs.jsx";
// import OurServices from "../components/OurServices.jsx";

// const imageUrls = [
//   img1,
//   img2,
//   img3,
//   img4,
//   img5,
//   img6,
//   img7,
//   img8,
//   img9,
//   img10,
//   img11,
//   img12,
//   img13,
// ];

// const HomePage = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);
//   const intervalRef = useRef(null);
//   const containerRef = useRef(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const startAutoSlide = () => {
//     stopAutoSlide();
//     intervalRef.current = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
//     }, 3500);
//   };

//   const stopAutoSlide = () => {
//     if (intervalRef.current) clearInterval(intervalRef.current);
//   };

//   useEffect(() => {
//     const updateIsMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     updateIsMobile();
//     window.addEventListener("resize", updateIsMobile);
//     return () => window.removeEventListener("resize", updateIsMobile);
//   }, []);

//   useEffect(() => {
//     startAutoSlide();
//     return () => stopAutoSlide();
//   }, []);

//   const handlePrev = () => {
//     stopAutoSlide();
//     setCurrentIndex((i) => (i - 1 + imageUrls.length) % imageUrls.length);
//   };
//   const handleNext = () => {
//     stopAutoSlide();
//     setCurrentIndex((i) => (i + 1) % imageUrls.length);
//   };

//   const getVisibleIndexes = () => {
//     const len = imageUrls.length;
//     if (isMobile) {
//       return [currentIndex];
//     }
//     return [
//       (currentIndex - 2 + len) % len,
//       (currentIndex - 1 + len) % len,
//       currentIndex,
//       (currentIndex + 1) % len,
//       (currentIndex + 2) % len,
//     ];
//   };

//   const getScaleAndStyle = (idx) => {
//     const baseClass =
//       "rounded-xl overflow-hidden transition-transform transition-opacity duration-700 steps";
//     if (isMobile) {
//       return idx === currentIndex ? `${baseClass} scale-100 z-30` : "hidden";
//     }
//     if (idx === currentIndex) {
//       return `${baseClass} scale-110 z-30`;
//     } else if (
//       idx === (currentIndex - 1 + imageUrls.length) % imageUrls.length ||
//       idx === (currentIndex + 1) % imageUrls.length
//     ) {
//       return `${baseClass} scale-100 z-20`;
//     } else if (
//       idx === (currentIndex - 2 + imageUrls.length) % imageUrls.length ||
//       idx === (currentIndex + 2) % imageUrls.length
//     ) {
//       return `${baseClass} scale-90 opacity-70 z-10`;
//     }
//     return "hidden";
//   };

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;

//     let startX = 0;

//     const handleTouchStart = (e) => {
//       startX = e.touches[0].clientX;
//     };

//     const handleTouchEnd = (e) => {
//       const endX = e.changedTouches[0].clientX;
//       if (endX - startX > 50) handlePrev();
//       else if (startX - endX > 50) handleNext();
//     };

//     container.addEventListener("touchstart", handleTouchStart);
//     container.addEventListener("touchend", handleTouchEnd);

//     return () => {
//       container.removeEventListener("touchstart", handleTouchStart);
//       container.removeEventListener("touchend", handleTouchEnd);
//     };
//   }, [currentIndex]);

//   return (
// <div
//   className="min-h-screen text-white px-4 pt-10 pb-2 bg-cover bg-center bg-fill"
//   style={{ backgroundImage: `url(${bc})` }}
// >
//       <h1 className="text-[60px] md:text-[70px] mt-[24px] text-pink font-lavishly items-center text-center">
//         5A's
//         <span className="text-white">
//           <span className="text-pink-500 ml-[14px]"> Cake </span>&
//         </span>
//         <span className="text-pink-500"> Decoration</span>
//       </h1>
//       <div className="items-center text-center mb-8">
//         <p className="text-[17px] text-gray-300 max-w-4xl mx-auto font-courierNew">
//           At 5A Decorations, we believe that every event is an opportunity to
//           create unforgettable memories. From weddings and birthdays to
//           corporate galas and intimate gatherings, we specialize in turning your
//           vision into a spectacular reality
//         </p>
//         <button
//           className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-[24px] transition mt-2"
//         >
//           Contact Us
//         </button>
//       </div>
//       <div className="relative max-w-4xl mx-auto group" ref={containerRef}>
//         <div className="absolute left-2 top-1/2 -translate-y-1/2 z-40">
//           <button
//             onClick={handlePrev}
//             className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
//             aria-label="Previous"
//           >
//             <ChevronLeft size={30} />
//           </button>
//         </div>
//         <div className="absolute right-2 top-1/2 -translate-y-1/2 z-40">
//           <button
//             onClick={handleNext}
//             className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
//             aria-label="Next"
//           >
//             <ChevronRight size={30} />
//           </button>
//         </div>
//         <div className="flex justify-center gap-6 px-4 transition-transform duration-700 steps">
//           {imageUrls.map((url, idx) => {
//             const visibleIndexes = getVisibleIndexes();
//             if (!visibleIndexes.includes(idx)) return null;
//             return (
//               <div
//                 key={idx}
//                 className={`w-full md:w-36 lg:w-72 h-60 md:h-64 lg:h-[340px] flex-shrink-0 ${getScaleAndStyle(
//                   idx
//                 )}`}
//               >
//                 <img
//                   src={url}
//                   alt={`Event ${idx}`}
//                   className="w-full h-full object-cover rounded-lg shadow-xl"
//                 />
//               </div>
//             );
//           })}
//         </div>
//         <div className="flex justify-center mt-6 space-x-2">
//           {imageUrls.map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrentIndex(idx)}
//               className={`w-3 h-3 rounded-full ${
//                 idx === currentIndex ? "bg-pink-500 scale-125" : "bg-gray-600"
//               }`}
//               aria-label={`Go to slide ${idx + 1}`}
//             />
//           ))}
//         </div>
//       </div>
//       <OurServices />
//       <AboutUs />
//       <ContactForm />
//       <FeedbackModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default HomePage;

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import img1 from "../../src/components/homepagePic/banner.jpg";
import img2 from "../../src/components/homepagePic/Baptism4.jpg";
import img3 from "../../src/components/homepagePic/birth.jpg";
import img4 from "../../src/components/homepagePic/cake1.jpg";
import img5 from "../../src/components/homepagePic/stage12.jpg";
import img6 from "../../src/components/homepagePic/supply.jpg";
import img7 from "../../src/components/homepagePic/table.jpg";
import img8 from "../../src/components/homepagePic/sssssss.jpg";
import img9 from "../../src/components/homepagePic/table2.jpg";
import img10 from "../../src/components/homepagePic/stage.jpg";
import img11 from "../../src/components/homepagePic/Bannerde.jpg";
import img12 from "../../src/components/homepagePic/sssss.jpg";
import img13 from "../../src/components/homepagePic/s11.jpg";
import img14 from "../../src/components/homepagePic/hall1.jpg";
import img15 from "../../src/components/homepagePic/Table dec.jpg";
import img16 from "../../src/components/homepagePic/stassge.jpg";
import img17 from "../../src/components/homepagePic/hall.jpg";
import bc from "../../src/components/background/bc.jpg";
import ContactForm from "./mail";
import FeedbackModal from "../../src/ticketmanagement/Addticket.jsx";
import AboutUs from "../components/AboutUs.jsx";
import OurServices from "../components/ourServices.jsx";

const HomePage = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, speed: 10 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrls = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
    img14,
    img15,
    img16,
    img17,
  ];

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);

    emblaApi.on("select", () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    });

    return () => clearInterval(autoplay);
  }, [emblaApi]);

  const handlePrev = () => emblaApi?.scrollPrev();
  const handleNext = () => emblaApi?.scrollNext();

  return (
    <div
      className="min-h-screen text-white px-4 pt-10 pb-2 bg-cover bg-center bg-fill"
      style={{ backgroundImage: `url(${bc})` }}
    >
      <h1 className="text-[60px] md:text-[70px] mt-[24px] text-pink font-lavishly items-center text-center">
        5A's
        <span className="text-white">
          <span className="text-pink-500 ml-[14px]"> Cake </span>&
        </span>
        <span className="text-pink-500"> Decoration</span>
      </h1>

      <div className="items-center text-center mb-8">
        <p className="text-[17px] text-gray-300 max-w-4xl mx-auto font-courierNew">
          At 5A Decorations, we believe that every event is an opportunity to
          create unforgettable memories. From weddings and birthdays to
          corporate galas and intimate gatherings, we specialize in turning your
          vision into a spectacular reality
        </p>
        <a
          href="https://www.facebook.com/share/1CQJiyTd7d/"
          target="_blank"
          rel="noopener noreferrer"
        >
          
          <button className="px-6 py-1 bg-pink-600 hover:bg-pink-700 text-white rounded-[24px] transition mt-2 font-courierNew">
            Visit Our Page
          </button>
        </a>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="flex-shrink-0 w-full md:w-1/5 px-2">
                <img
                  src={url}
                  alt={`Event ${idx}`}
                  className="w-full h-[340px] object-cover rounded-lg shadow-xl"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={handlePrev}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
            aria-label="Previous"
          >
            <ChevronLeft size={30} />
          </button>
        </div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-40">
          <button
            onClick={handleNext}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
            aria-label="Next"
          >
            <ChevronRight size={30} />
          </button>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {imageUrls.map((_, idx) => (
            <button
              key={idx}
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === currentIndex ? "bg-pink-500 scale-125" : "bg-gray-600"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
      <div id="services">
  <OurServices />
</div>
      <div id="about">
  <AboutUs />
</div>
      <div id="contact">
  <ContactForm />
</div>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
