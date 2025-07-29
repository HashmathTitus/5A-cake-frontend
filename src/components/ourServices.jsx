// import React from "react";
// import image1 from "./background/event.png";
// import image2 from "./background/cake-53.png";
// import image3 from "./background/booo.png";
// import image4 from "./background/other-17.png";

// const services = [
//   {
//     icon: <img src={image1} alt="Event Planning" className="w-12 h-12" />,
//     title: "Event Decorations",
//     description: [
//       "Birthday party",
//       "Anniversaries",
//       "Wedding",
//       "Cultural event décor",
//       "Spiritual event décor",
//     ],
//   },
//   {
//     icon: <img src={image2} alt="Cakes" className="w-12 h-12" />,
//     title: "Cakes",
//     description: [
//       "Custom cakes",
//       "Wedding cakes",
//       "Cookies",
//       "Party Sweets",
//       "Cup cakes",
//     ],
//   },
//   {
//     icon: <img src={image3} alt="Christening Accessories" className="w-12 h-12" />,
//     title: "Christening Accessories",
//     description: [
//       "Veil",
//       "Gloves & gown",
//       "Baptism Basket, Candle",
//       "Bouquets",
//       "Favors",
//     ],
//   },
//   {
//     icon: <img src={image4} alt="Other Services" className="w-12 h-12" />,
//     title: "Other services",
//     description: [
//       "Photography",
//       "Catering",
//       "DJ music",
//       "Magic",
//       "Jumping castle",
//     ],
//   },
// ];

// const OurServices = () => (
//   <section className="py-16 px-4 text-center rounded-[48px] shadow-lg max-w-full mx-auto opacity-90 bg-none bg-cover bg-center">
//     <h2 className="text-4xl font-bold text-white mb-6">
//       <span className="text-white">OUR</span>{" "}
//       <span className="text-pink-500">SERVICES</span>
//     </h2>

//     <p className="text-[15px] text-white mt-0 max-w-4xl mx-auto font-courierNew align-left mb-4">
//       From weddings and birthdays to corporate galas and intimate
//       gatherings, we specialize in turning your vision into a spectacular
//       reality. With our passion for creativity and attention to detail,
//       we’ll transform your event into a mesmerizing experience that exceeds
//       your expectations.
//     </p>

//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
//       {services.map((service, index) => (
//         <div
//           key={index}
//           className="bg-pink-900 p-4 rounded-[48px] shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center font-courierNew text-white font-semibold "
//         >
//           <div className="flex justify-center mb-4">
//             <div className="bg-pink-300 text-white text-2xl p-4 rounded-full">
//               {service.icon}
//             </div>
//           </div>
//           <h3 className="text-white font-semibold text-lg mb-2">
//             {service.title}
//           </h3>
//           <ul className="list-disc list-inside text-white-300 justify-start text-left">
//             {service.description.map((item, i) => (
//               <li key={i}>{item}</li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   </section>
// );

// export default OurServices;

import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import image1 from "./background/event.png";
import image2 from "./background/cake-53.png";
import image3 from "./background/booo.png";
import image4 from "./background/other-17.png";

const services = [
  {
    icon: <img src={image1} alt="Event Planning" className="w-12 h-12" />,
    title: "Event Decorations",
    description: [
      "Birthday party",
      "Anniversaries",
      "Wedding",
      "Cultural event décor",
      "Spiritual event décor",
    ],
  },
  {
    icon: <img src={image2} alt="Cakes" className="w-12 h-12" />,
    title: "Cakes",
    description: [
      "Custom cakes",
      "Wedding cakes",
      "Cookies",
      "Party Sweets",
      "Cup cakes",
    ],
  },
  {
    icon: (
      <img src={image3} alt="Christening Accessories" className="w-12 h-12" />
    ),
    title: "Christening Accessories",
    description: [
      "Veil",
      "Gloves & gown",
      "Baptism Basket, Candle",
      "Bouquets",
      "Favors",
    ],
  },
  {
    icon: <img src={image4} alt="Other Services" className="w-12 h-12" />,
    title: "Other services",
    description: [
      "Photography",
      "Catering",
      "DJ music",
      "Magic",
      "Jumping castle",
    ],
  },
];

const ServiceCard = ({ service, isActive, onToggle, isMobile }) => (
  <div className="bg-pink-900 p-4 rounded-[32px] shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center font-courierNew text-white font-semibold group cursor-pointer hover:bg-pink-700 hover:scale-105">
    {/* Icon */}
    <div className="flex justify-center mb-4">
      <div className="bg-pink-300 text-white text-2xl p-4 rounded-full">
        {service.icon}
      </div>
    </div>

    {/* Title */}
    <h3 className="text-white font-semibold text-lg mb-2">{service.title}</h3>

    {/* Toggle Button for mobile */}
    {isMobile && (
      <div className="flex justify-center">
        <button
          onClick={onToggle}
          className="p-2 border border-white rounded-full hover:bg-white hover:text-pink-700 transition duration-300"
        >
          {isActive ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
    )}

    {/* Description */}
    <ul
      className={`
        list-disc list-inside text-left transition-all duration-300 overflow-hidden
        ${
          isMobile
            ? isActive
              ? "max-h-40 opacity-100"
              : "max-h-0 opacity-0"
            : "max-h-[500px] opacity-100"
        }
      `}
    >
      {service.description.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  </div>
);

const OurServices = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Update isMobile on resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleToggle = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-16 px-4 text-center max-w-full mx-auto bg-none bg-cover bg-center">
      <h2 className="text-4xl font-bold text-white mb-6">
        <span className="text-white">WHAT</span>{" "}
        <span className="text-pink-500">WE DO !</span>
      </h2>

      <p className="text-[15px] text-white mt-0 max-w-4xl mx-auto font-courierNew mb-4">
        From weddings and birthdays to corporate galas and intimate gatherings,
        we specialize in turning your vision into a spectacular reality. With
        our passion for creativity and attention to detail, we’ll transform your
        event into a mesmerizing experience that exceeds your expectations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto opacity-90">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            service={service}
            isActive={activeIndex === index}
            onToggle={() => handleToggle(index)}
            isMobile={isMobile}
          />
        ))}
      </div>
    </section>
  );
};

export default OurServices;
