import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FeedbackModal from "../../src/ticketmanagement/Addticket.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ClientsReview = () => {
  const [reviews, setReviews] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Add this

  // Fetch reviews from backend
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}TicketController/getTicket`
      );
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Update number of visible reviews on screen size change
  useEffect(() => {
    const updateReviewsPerPage = () => {
      if (window.innerWidth < 640) {
        setReviewsPerPage(1); // mobile
      } else if (window.innerWidth < 1024) {
        setReviewsPerPage(2); // tablet
      } else {
        setReviewsPerPage(3); // desktop
      }
    };
    updateReviewsPerPage();
    window.addEventListener("resize", updateReviewsPerPage);
    return () => window.removeEventListener("resize", updateReviewsPerPage);
  }, []);

  const handleNext = () => {
    const nextIndex = startIndex + reviewsPerPage;
    if (nextIndex < reviews.length) {
      setStartIndex(nextIndex);
    } else {
      setStartIndex(0); // Loop to beginning
    }
  };

  const handlePrev = () => {
    const prevIndex = startIndex - reviewsPerPage;
    if (prevIndex >= 0) {
      setStartIndex(prevIndex);
    } else {
      const lastFullPageIndex = Math.max(0, reviews.length - reviewsPerPage);
      setStartIndex(lastFullPageIndex); // Loop to last page
    }
  };

  const visibleReviews = reviews.slice(startIndex, startIndex + reviewsPerPage);

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
    <div className="bg-none text-white py-10 px-2 opacity-90">
      <h2 className="text-3xl text-center font-bold mb-8">
        CLIENTS <span className="text-pink-500">TESTIMONIALS</span>
      </h2>

      <div className="relative mx-auto mb-7">
        {/* Reviews Grid */}
        {loading ? (
          <p className="text-center text-gray-300 text-lg mt-10">Loading...</p>
        ) : visibleReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-2">
            {visibleReviews.map((review) => (
              <div
                key={review._id}
                className="relative bg-gray-900 text-white rounded-xl shadow-lg p-6 overflow-hidden opacity-90 hover:opacity-100 transition duration-300 max-w-2xl w-full mx-auto cursor-pointer"
                onClick={() => navigate("/tickets")} // Add this
                title="See all testimonials"
              >
                {/* Pink side accent */}
                <div className="absolute top-0 left-0 w-2 h-full bg-pink-900 rounded-l-xl" />

                {/* Quotation icon */}
                <div className="text-pink-400 text-4xl">“</div>
                <div className="px-6 border-pink-400 border-2 rounded-[16px] bg-pink-900 bg-opacity-30">
                  {/* <p className="text-sm text-gray-300 mt-1">{review.event}</p> */}
                  <p className="text-sm text-gray-300 mb-4 mt-1">
                    {review.description}
                  </p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-2">
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`${process.env.REACT_APP_API_URL}/uploads/${img}`}
                          alt={`review-img-${idx}`}
                          className="w-16 h-16 object-cover rounded border border-gray-400"
                        />
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-400 mb-2">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="text-pink-400 text-4xl text-right">”</div>
                <div className="flex justify-between">
                  <div className="text-xs text-gray-400">
                    {new Date(review.dateReported).toLocaleDateString()}
                  </div>
                  <span className="text-pink-500 text-[11px]">
                    - {review.name}
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
      <div className="relative max-w-full mx-auto flex justify-center items-center">
        <button
          className="absolute top-1/2 left-0 z-10 transform -translate-y-1/2 text-white hover:text-pink-400 bg-pink-900 p-2 rounded-full shadow-lg hover:bg-pink-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 "
          onClick={handlePrev}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          className="bg-pink-900 text-white px-4 py-1 rounded-full mt-6 hover:bg-pink-500 transition duration-300 opacity-90 font-courierNew"
          onClick={() => setIsModalOpen(true)}
        >
          Give your Feedback !!
        </button>
        <button
          className="absolute top-1/2 right-0 z-10 transform -translate-y-1/2 text-white hover:text-pink-400 bg-pink-900 p-2 rounded-full shadow-lg hover:bg-pink-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 "
          onClick={handleNext}
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFeedbackSubmitted={fetchReviews} // Refresh reviews after feedback
      />
    </div>
  );
};

export default ClientsReview;
