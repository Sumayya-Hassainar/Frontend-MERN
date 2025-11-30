import React, { useEffect, useState } from 'react';

const slides = [
  {
    id: 1,
    title: 'Electronics & Gadgets',
    text: 'Shop phones, laptops, and accessories from trusted vendors.',
    image:
      'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 2,
    title: 'Fashion & Lifestyle',
    text: 'Discover trending outfits from multiple brands in one place.',
    image:
      'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 3,
    title: 'Home & Essentials',
    text: 'Everything for your home – furniture, decor, kitchen and more.',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Gij9ODezm6cnPqjmkf7XHqlS2KMvv_8vqQ&s',
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setCurrent((prev) => (prev + 1) % slides.length),
      4000
    );
    return () => clearInterval(id);
  }, []);

  const slide = slides[current];

  return (
    <div className="relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl shadow-md">
      {/* Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      {/* Text content */}
      <div className="absolute inset-y-0 left-0 flex items-center px-6 sm:px-10">
        <div className="max-w-md text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
            {slide.title}
          </h2>
          <p className="text-sm sm:text-base text-gray-100 mb-3">
            {slide.text}
          </p>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-sm font-semibold px-4 py-2 rounded-md">
            Shop now
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((s, index) => (
          <button
            key={s.id}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
