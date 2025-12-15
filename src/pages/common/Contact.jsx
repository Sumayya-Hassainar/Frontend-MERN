// src/pages/common/ContactPage.jsx
import React, { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Form is valid, proceed with submission logic
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="mb-6">Have questions? Need support? We're here to help you!</p>

      {/* Get in Touch Card */}
      <div className="bg-gray-100 dark:bg-gray-300 p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
        <p><strong>Email:</strong> support@yourwebsite.com</p>
        <p><strong>Phone:</strong>+91 8099234567</p>
        <p><strong>Address:</strong> Banglure,Karnataka</p>
      </div>

      {/* Send a Message Form */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full border px-4 py-2 h-32 rounded focus:outline-none focus:ring-2 ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            ></textarea>
            {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
