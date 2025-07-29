import React from "react";
import {
  Facebook,
  Instagram,
  Room,
  Phone,
  Email,
  WhatsApp,
} from "@mui/icons-material";
import { TimerIcon } from "lucide-react";
import logo from "../../src/components/background/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 p-4 shadow-md flex flex-col items-center text-center font-courierNew text-white font-semibold group opacity-90">
      <div className="flex flex-col max-w-5xl mx-auto grid grid-cols-3 md:grid-cols-3 gap-10 mt-2 mb-2 ">
        <div>
          <img
            src={logo} // replace with your actual image path
            alt="Event Planning"
            className="rounded-[70px] h-[100px] w-[100px] shadow-lg"
          />
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="text-sm flex flex-row items-center gap-2 justify-center">
            <WhatsApp fontSize="small" className="text-blue-400" />
            <Instagram fontSize="small" className="text-pink-500" />
            <a
              href="https://www.facebook.com/share/1CQJiyTd7d/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook
                fontSize="small"
                className="text-blue-500 cursor-pointer"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-5xl mx-auto mt-4  ">
        <h3 className="text-xl font-bold mb-4">Contact Info</h3>
        <ul className="space-y-3 text-sm">
          <li className="flex items-center space-x-2">
            <Phone fontSize="small" className="text-blue-400" />
            <span>+61 431 305 310</span>
          </li>
          <li className="flex items-center space-x-2">
            <Room fontSize="small" className="text-blue-400" />
            <span>
              Maiden Gully Rd, Maiden Gully VIC 3551, Australia, Bendigo, VIC,
              Australia, Victoria
            </span>
          </li>
          <li className="flex items-center space-x-2">
            <Email fontSize="small" className="text-blue-400" />
            <span>5asdecorations@gmail.com</span>
          </li>
          <li className="flex items-center space-x-2">
            <TimerIcon fontSize="small" className="text-blue-400" />
            <span>Mon – Sun : 9.00 am – 8.00 pm</span>
          </li>
        </ul>
      </div>

      {/* Footer bottom text */}
      <div className="mt-4 text-center text-sm text-gray-400 border-t border-gray-700 pt-2">
        Created By <span className="text-blue-500">5A's Cake & Decoration</span>{" "}
        | All Rights Reserved @ 2023
      </div>
    </footer>
  );
};

export default Footer;
