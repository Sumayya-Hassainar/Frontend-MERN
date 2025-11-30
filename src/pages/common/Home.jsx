import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from '../../components/Carousel';

// dummy products just for UI
const sampleProducts = [
  {
    id: 1,
    name: 'Wireless Headphones Pro',
    price: 2499,
    vendor: 'TechWorld',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoRU3dDPVoRzBeAqiDJPegj2htjIjDzSN3_A&s',
  },
  {
    id: 2,
    name: 'Smartphone 5G 128GB',
    price: 18999,
    vendor: 'MobileHub',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpy0J2pF2U1b2GQZhHtpleJjkbs6PqWXUQJA&s',
  },
  {
    id: 3,
    name: 'Casual Men’s Sneakers',
    price: 1499,
    vendor: 'Urban Style',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYEo_IJsVemJDeHHV7--VANfdhbVoTuScFag&s',
  },
  {
    id: 4,
    name: 'Minimal Wooden Chair',
    price: 2199,
    vendor: 'HomeCraft',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwKN2xt3ZK1LblLDf1kMevZm2nhLfw9eZd8Q&s',
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // Redirect to Register page if user is not logged in
    navigate('/register');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Hero carousel */}
      <Carousel />

      {/* Features section */}
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Why shop with MarketVerse?
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-1 text-sm">
              Multi-vendor marketplace
            </h3>
            <p className="text-xs text-gray-600">
              Discover products from multiple vendors in one unified platform.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-1 text-sm">
              Secure payments & refunds
            </h3>
            <p className="text-xs text-gray-600">
              End-to-end encrypted payments with safe refund processing.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-1 text-sm">
              Real-time order tracking
            </h3>
            <p className="text-xs text-gray-600">
              Track your orders from processing to delivery in real time.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold mb-1 text-sm">
              Ratings & reviews
            </h3>
            <p className="text-xs text-gray-600">
              Make better decisions with verified customer reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Products section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Featured products</h2>
          <button className="text-sm text-indigo-600 hover:underline">
            View all
          </button>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {sampleProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-sm font-semibold mb-1">{p.name}</h3>
              <p className="text-xs text-gray-500 mb-1">by {p.vendor}</p>
              <span className="text-sm font-bold">₹{p.price}</span>
              <button
                onClick={handleAddToCart}
                className="mt-2 bg-indigo-600 text-white text-xs py-1 rounded hover:bg-indigo-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
