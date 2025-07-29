import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import Swal from "sweetalert2";

const FeedbackModal = ({ isOpen, onClose, onFeedbackSubmitted }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [event, setEvent] = useState("");
  const [rating, setRating] = useState(0);
  const [dateReported, setDateReported] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [hover, setHover] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (name.trim().length < 5)
      newErrors.name = "Name must be at least 5 characters.";
    if (event.trim().length < 5)
      newErrors.event = "Event must be at least 5 characters.";
    if (description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters.";
    if (rating < 0.5)
      newErrors.rating = "Please provide a rating.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("event", event);
    formData.append("rating", rating);
    formData.append("dateReported", dateReported);
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/TicketController/Ticket`,
        formData,
        // { headers: { "Content-Type": "multipart/form-data" } }
      );
      Swal.fire({
        icon: "success",
        title: "Thank you for your feedback!",
        showConfirmButton: false,
        timer: 2000,
      });
      if (onFeedbackSubmitted) onFeedbackSubmitted(); // Call parent callback
      onClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to submit. Try again later.",
        showConfirmButton: true,
      });
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto mt-8">
      <div className="bg-white rounded-lg w-[95%] sm:w-full max-w-2xl p-6 shadow-xl relative mx-4 my-8 sm:my-12 text-gray-800">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 text-2xl hover:text-red-600"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-pink-500">
          Share Your Feedback
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold">Name:</label>
              <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold">Event:</label>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="What was the event"
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              {errors.event && (
                <p className="text-red-500 text-xs mt-1">{errors.event}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold">Date:</label>
              <input
                type="date"
                value={dateReported}
                onChange={(e) => setDateReported(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">
                Upload Images (max 3):
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Describe Your Experience:
            </label>
            <div className="space-y-2 mb-4 items-center flex flex-col">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your feedback"
                className="w-full border px-3 py-2 rounded-md h-24"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
              <div>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFull = rating >= star;
                    const isHalf = rating >= star - 0.5 && rating < star;

                    return (
                      <div
                        key={star}
                        className="relative cursor-pointer text-yellow-500"
                        onMouseLeave={() => setHover(null)}
                      >
                        <div
                          className="absolute left-0 top-0 w-1/2 h-full z-10"
                          onMouseEnter={() => setHover(star - 0.5)}
                          onClick={() => setRating(star - 0.5)}
                        />
                        <div
                          className="absolute right-0 top-0 w-1/2 h-full z-10"
                          onMouseEnter={() => setHover(star)}
                          onClick={() => setRating(star)}
                        />

                        {hover !== null ? (
                          hover >= star ? (
                            <FaStar size={24} />
                          ) : hover >= star - 0.5 ? (
                            <FaStarHalfAlt size={24} />
                          ) : (
                            <FaRegStar size={24} className="text-gray-300" />
                          )
                        ) : isFull ? (
                          <FaStar size={24} />
                        ) : isHalf ? (
                          <FaStarHalfAlt size={24} />
                        ) : (
                          <FaRegStar size={24} className="text-gray-300" />
                        )}
                      </div>
                    );
                  })}
                </div>
                {errors.rating && (
                  <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-900 text-white font-semibold py-2 rounded-md hover:bg-pink-500 transition duration-300"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
// ...existing code...