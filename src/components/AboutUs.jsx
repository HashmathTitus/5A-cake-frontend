import React from "react";
import logo from "./background/logo.png";

const AboutUs = () => {
  return (
    <section className="py-8 px-4 text-white rounded-[48px] shadow-lg max-w-6xl mx-auto text-center opacity-90">
      <h2 className="text-4xl font-bold mb-6">
        <span className="text-pink-500">ABOUT US</span>
      </h2>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
        {/* Left Side - Image */}
        <div className="overflow-hidden shadow-lg flex-shrink-0 flex justify-center items-center rounded-[70px] hover:scale-110 transition-transform duration-300">
          <img
            src={logo}
            alt="Event Planning"
            className="rounded-[70px] h-[300px] w-[300px] shadow-lg"
          />
        </div>

        {/* Right Side - Content */}
        <div className="flex-1 text-left">
          <h3 className="text-2xl font-semibold mb-4 font-courierNew">
            We Will Give A Very Special Celebration For You
          </h3>

          <p className="text-white mb-4 font-courierNew text-[16px]">
            Based in Bendigo, we transform events into unforgettable memories
            with custom decorations and cakes. From superhero themes to
            cartoon characters, our creative team crafts designs that delight
            guests across a 100 km radius.
            <br />
            <span className="text-white mt-3 flex font-courierNew text-[16px]">
              We offer flexible, budget-friendly services that reduce stress
              and deliver amazing results. Whether it’s a wedding, birthday,
              or corporate event, we bring your vision to life with
              creativity, attention to detail, and unique ideas.
            </span>
          </p>

          <a
            href="https://www.facebook.com/share/1CQJiyTd7d/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600 hover:bg-pink-700 text-white rounded-[24px] py-1 px-6 transition duration-300 font-courierNew inline-block"
          >
            Get in touch with us!!
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;