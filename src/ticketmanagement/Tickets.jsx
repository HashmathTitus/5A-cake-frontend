import React, { useEffect, useState } from "react";
import axios from "axios";
import bc from "../../src/components/background/bc.jpg";
import FeedbackModal from "./Addticket.jsx";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState({
    open: false,
    images: [],
    current: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/TicketController/getTicket`
      );
      const data = response?.data;
      if (Array.isArray(data)) setTickets(data);
      else if (data.data && Array.isArray(data.data)) setTickets(data.data);
      else setTickets([]);
    } catch (err) {
      console.error(err);
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const openPreview = (images, idx) =>
    setPreview({ open: true, images, current: idx });
  const closePreview = () =>
    setPreview({ open: false, images: [], current: 0 });
  const changeImage = (dir) => {
    setPreview((prev) => ({
      ...prev,
      current:
        dir === "next"
          ? (prev.current + 1) % prev.images.length
          : (prev.current - 1 + prev.images.length) % prev.images.length,
    }));
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex justify-center text-yellow-400 text-xl">
        {"★".repeat(fullStars)}
        {halfStar ? "½" : ""}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${bc})` }}
    >
      <div className="max-w-7xl mx-auto mt-[44px]">
        <h2 className="text-[36px] md:text-[60px] text-white text-center font-bold mb-10">
          <span className="text-5xl md:text-6xl text-pink-400 font-lavishly ">
            Client{" "}
          </span>
          <span className="text-white text-5xl md:text-6xl font-lavishly">
            {" "}
            Testimonials
          </span>
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {preview.open && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
            onClick={closePreview}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${
                  preview.images[preview.current]
                }`}
                alt="Preview"
                className="max-w-[90vw] max-h-[80vh] rounded shadow-lg"
              />
              <button
                onClick={closePreview}
                className="absolute top-2 right-2 text-white text-2xl bg-black bg-opacity-50 rounded-full px-3 py-1"
              >
                &times;
              </button>
              {preview.images.length > 1 && (
                <>
                  <button
                    onClick={() => changeImage("prev")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 rounded-full px-3 py-1"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={() => changeImage("next")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 rounded-full px-3 py-1"
                  >
                    &#8594;
                  </button>
                </>
              )}
              <div className="text-center text-white mt-2">
                {preview.current + 1} / {preview.images.length}
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-200 text-lg mt-10">Loading...</p>
        ) : tickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                className="relative bg-gray-900 text-white rounded-xl shadow-lg p-4 overflow-hidden opacity-90 hover:opacity-100 transition duration-300"
              >
                {/* Yellow side accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-pink-900 rounded-l-xl" />

                {/* Quotation icon */}
                <div className="text-pink-400 text-4xl">“</div>
                <div className="px-6 border-pink-400 border-2 rounded-[16px] bg-pink-900 bg-opacity-30">
                  {/* <p className="text-sm text-gray-300 mt-1">{ticket.event}</p> */}
                  <p className="text-sm text-gray-300 mb-4 mt-1">
                    {ticket.description}
                  </p>

                  {ticket.images && ticket.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-2">
                      {ticket.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${process.env.REACT_APP_API_URL}/uploads/${img}`}
                          alt={`ticket-img-${idx}`}
                          onClick={() => openPreview(ticket.images, idx)}
                          className="w-12 h-12 object-cover rounded cursor-pointer border border-gray-400 hover:scale-105 transition"
                        />
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-400 mb-2">
                    {renderStars(ticket.rating)}
                  </div>
                </div>
                <div className="text-pink-400 text-4xl text-right">”</div>
                <div className="flex justify-between">
                  <div className="text-xs text-gray-400">
                    {new Date(ticket.dateReported).toLocaleDateString()}
                  </div>
                  <span className="text-pink-500 text-[11px]">
                    - {ticket.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-300 text-lg mt-10">
            No feedbacks found
          </p>
        )}
      </div>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFeedbackSubmitted={fetchTickets} // Pass refresh callback
      />
      <div className="flex justify-center mt-[100px] font-courierNew">
        <button
          className="bg-pink-900 text-white px-4 py-2 rounded-full hover:bg-pink-500 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Give your Feedback !!
        </button>
      </div>
    </div>
  );
};

export default TicketList;
