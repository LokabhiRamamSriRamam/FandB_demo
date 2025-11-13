import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { name: "Home", icon: "🏠", link: "/" },
    { name: "Orders", icon: "📦", link: "/orders" },
    { name: "Products", icon: "🛍️", link: "/products" },
    { name: "Transactions", icon: "💳", link: "/transactions" },
    { name: "Reports", icon: "📊", link: "/reports" },
    { name: "Staff", icon: "👥", link: "/staff" },
    { name: "Clienteling", icon: "🤝", link: "/clienteling" },
    { name: "Promotions / Coupons", icon: "🎁", link: "/promotionscoupons" },
    { name: "KDS", icon: "🍽️", link: "/kds" },
  ];

  return (
    <div
      className={`fixed z-50 top-0 left-0 h-screen bg-black text-yellow-300 ${
        isExpanded ? "w-64" : "w-16"
      } overflow-hidden transition-all duration-300`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo Section */}
      <div className="text-center py-6 bg-black text-yellow-500 font-bold text-xl">
        {isExpanded ? "WooKraft" : "W"}
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col space-y-4 mt-6 px-4">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.link}
              className="flex items-center space-x-4 hover:text-blue-500 text-lg transition-colors"
            >
              <span className="text-xl">{item.icon}</span>
              {isExpanded && <span>{item.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;
