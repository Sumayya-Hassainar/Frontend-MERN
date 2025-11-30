import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-4 gap-6 text-sm">
        <div>
          <h4 className="font-semibold mb-2">MarketVerse</h4>
          <p className="text-gray-400">
            Multi-vendor marketplace with secure payment and real-time tracking.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-gray-400">
            <li>About</li>
            <li>Careers</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Support</h4>
          <ul className="space-y-1 text-gray-400">
            <li>Help Center</li>
            <li>Shipping</li>
            <li>Returns</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-gray-400">
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-3 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MarketVerse. All rights reserved.
      </div>
    </footer>
  );
}
