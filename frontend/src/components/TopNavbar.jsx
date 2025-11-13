import React from 'react';
import { Link } from 'react-router-dom';
function TopNavbar() {
    return (
        <div className="fixed z-40 top-0 left-16 w-[calc(100%-64px)] bg-black text-yellow-300 z-50 shadow-md">
            <div className="max-w-screen-xl mx-auto flex justify-between items-center py-4 px-4">
                {/* Center Section: Search Bar */}
                <div className="flex-1 mx-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-5 py-3 rounded-lg bg-gray-800 text-yellow-300 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                        <span className="absolute top-1/2 right-4 transform -translate-y-1/2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-5 h-5 text-yellow-300 hover:text-blue-500 transition-all"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-4.35-4.35M11 17a6 6 0 100-12 6 6 0 000 12z"
                                />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Right Section: Icons */}
                <div className="flex items-center space-x-6">
                    {/* Notifications */}
                    <Link to="/notifications">
                        <button
                            className="hover:text-blue-500 hover:scale-110 transition-transform relative"
                            title="Notifications"
                        >
                            <img
                                src="https://via.placeholder.com/24"
                                alt="Notifications"
                                className="w-6 h-6"
                            />
                            {/* Notification Badge */}
                            <span className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-red-500 text-white text-xs font-bold rounded-full px-1">
                                5
                            </span>
                        </button>
                    </Link>


                    {/* Help */}
                    <Link to="/help">
                        <button
                            className="hover:text-blue-500 hover:scale-110 transition-transform"
                            title="Help"
                        >
                            <img
                                src="https://via.placeholder.com/24"
                                alt="Help"
                                className="w-6 h-6"
                            />
                        </button>
                    </Link>

                </div>
            </div>
        </div >
    );
}

export default TopNavbar;
