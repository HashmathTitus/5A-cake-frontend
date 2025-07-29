import React, { useState } from "react";
import Swal from "sweetalert2";
import ClientsReview from "./ClientsReview.jsx";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    number: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullMessage = `
Name: ${form.name}
Number: ${form.number}
Email: ${form.email}
Subject: ${form.subject}
Message: ${form.message}
`;

    // Send to Gmail
    const gmailLink = `mailto:assumptaraj@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(fullMessage)}`;
    window.open(gmailLink, "_blank");

    // Open Facebook Messenger
    const messengerLink = "https://www.facebook.com/messages/t/110952031398517";
    window.open(messengerLink, "_blank");

    // Show SweetAlert2 modal
    Swal.fire({
      icon: "success",
      title: "Message Sent!",
      text: "We'll reply as soon as possible.",
      timer: 2000,
      showConfirmButton: false,
      backdrop: true,
    });

    // Optionally reset form
    setForm({
      name: "",
      number: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white px-4 max-w-6xl mt-6 mx-auto">
      <h1 className="text-4xl font-bold text-white mb-4">
        <span className="text-pink-500">CONTACT</span> US
      </h1>

      <form onSubmit={handleSubmit} className="p-2 rounded-lg space-y-4 w-full">
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-3 rounded-[40px] text-white bg-pink-900 shadow-lg hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="number"
            placeholder="Number"
            className="w-full p-3 rounded-[40px] text-white bg-pink-900 shadow-lg hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={form.number}
            onChange={handleChange}
            required
          />
        </div>

        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 rounded-[40px] text-white bg-pink-900 shadow-lg hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            className="w-full p-3 rounded-[40px] text-white bg-pink-900 shadow-lg hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </div>

        <textarea
          name="message"
          placeholder="Your Message"
          className="w-full p-3 h-40 rounded-[30px] text-white bg-pink-900 shadow-lg hover:bg-pink-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={form.message}
          onChange={handleChange}
          required
        ></textarea>

        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-[24px] transition mt-2"
          >
            Send Message
          </button>
        </div>

        <div className="text-center mt-4 text-sm text-white font-courierNew">
          We will reply as soon as possible!
        </div>
      </form>

      <div id="reviews">
  <ClientsReview />
</div>
    </div>
  );
};

export default ContactForm;
