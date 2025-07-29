import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState({ open: false, images: [], current: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/TicketController/getTicket");
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await axios.delete(`http://localhost:4000/TicketController/deleteTicket/${id}`);
        fetchTickets();
      } catch (error) {
        alert("Error deleting ticket.");
      }
    }
  };

  const openPreview = (images, idx) => setPreview({ open: true, images, current: idx });
  const closePreview = () => setPreview({ open: false, images: [], current: 0 });
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
      <>
        {"★".repeat(fullStars)}
        {halfStar ? "½" : ""}
        {"☆".repeat(emptyStars)}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-center items-center mt-[40px]">
          <h2 className="text-3xl font-bold text-[#333] mb-4 sm:mb-0">Maintain Your Feedback</h2>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Preview Modal */}
        {preview.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={closePreview}>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img
                src={`http://localhost:4000/uploads/${preview.images[preview.current]}`}
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

        {/* Review Cards */}
        {loading ? (
          <p className="text-center text-gray-400 text-lg mt-10">Loading...</p>
        ) : tickets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                <div className="mb-2 text-xl font-bold text-gray-800">{ticket.name}</div>

                {ticket.images && ticket.images.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {ticket.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`http://localhost:4000/uploads/${img}`}
                        alt={`ticket-img-${idx}`}
                        onClick={() => openPreview(ticket.images, idx)}
                        className="w-16 h-16 object-cover rounded cursor-pointer border"
                      />
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-500 mb-1">
                  <strong>Event:</strong> {ticket.event}
                </div>
                <p className="text-gray-600 mb-2">{ticket.description}</p>

                <div className="text-sm text-gray-500 mb-1">
                  <strong>Rating:</strong>{" "}
                  <span className="text-yellow-500">{renderStars(ticket.rating)}</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  <strong>Date:</strong> {new Date(ticket.dateReported).toLocaleDateString()}
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleDelete(ticket._id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-lg mt-10">No feedbacks found</p>
        )}
      </div>
    </div>
  );
};

export default TicketList;
// ...existing code...