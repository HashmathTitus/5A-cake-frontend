import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../src/components/background/logo.jpg'
import FeedbackModal from '../../src/ticketmanagement/Addticket.jsx';
import { Link } from 'react-router-dom'; // Add this import

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="bg-pink-900 text-white px-6 py-2 shadow-md opacity-90 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center ml-8">
          <Link to={"/"} className="text-white text-2xl font-bold mr-4">
          <img src={logo} alt="Logo" className="h-[48px] inline-block mr-16 rounded-[24px]"/>
          </Link>
        </div>

        <div className="hidden md:flex space-x-6 font-courierNew">
           <Link to="/" className="hover:text-pink-400 transition-colors">Home</Link>
          <a href="#services" className="hover:text-pink-400 transition-colors">Services</a>
          <a href="#about" className="hover:text-pink-400 transition-colors">About</a>
          <Link to="/tickets" className="hover:text-pink-400 transition-colors">Testimonials</Link>
          <a href="#contact" className="hover:text-pink-400 transition-colors">Contact</a>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex gap-4">
          <button
            className="px-4 py-1 bg-gray-700 text-white rounded-[24px] hover:bg-gray-600 transition font-courierNew"
            onClick={() => setIsModalOpen(true)}
          >
            Give Your Feedback
          </button>
        </div>
        <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-3 font-courierNew">
          <Link to="#home" className="block text-white hover:text-pink-400">Home</Link>
          <a href="#services" className="block text-white hover:text-pink-400">Services</a>
          <a href="#about" className="block text-white hover:text-pink-400">About</a>
          <Link to="/tickets" className="block text-white hover:text-pink-400">Testimonials</Link>
          <a href="#contact" className="block text-white hover:text-pink-400">Contact</a>
          <button
            className="w-full mt-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition font-courierNew"
            onClick={() => setIsModalOpen(true)}
          >
             Give Your Feedback
          </button>
        </div>
      )}
      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
