// frontend/src/components/Navbar.jsx - DARK THEMED VERSION

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      navigate("/");
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-950/95 backdrop-blur-xl text-white sticky top-0 z-50 border-b border-gray-800/50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left: Logo & Tagline */}
          <div className="flex-1 flex items-center min-w-0">
            <Link to="/" className="flex items-center gap-3 no-underline">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center border border-teal-600/30"
              >
                <span className="text-teal-400 text-xl">💫</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">InnerSync</h1>
                <p className="text-xs text-gray-400">
                  Your mental health Companion
                </p>
              </div>
            </Link>
          </div>

          {/* Center: User Info (when logged in) */}
          <div className="flex-1 flex justify-center px-4">
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center font-semibold text-white text-sm shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {user.role}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Navigation Links */}
          <div className="flex-1 flex justify-end">
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              {user && (
                <>
                  {/* Patient Dashboard */}
                  {user.role === "patient" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/patient-panel"
                        className="inline-block px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline whitespace-nowrap"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                  )}
                  {user.role === "patient" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/ai-assist"
                        className="inline-block px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline whitespace-nowrap"
                      >
                        AI Assist
                      </Link>
                    </motion.div>
                  )}

                  {/* AI Assistance */}

                  {/* Seek Expert Help */}
                  {user.role === "patient" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/seek-expert"
                        className="inline-block px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline whitespace-nowrap"
                      >
                        Expert Help
                      </Link>
                    </motion.div>
                  )}

                  {/* Admin Panel */}
                  {user.role === "admin" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/admin"
                        className="px-4 py-2 rounded-lg font-semibold bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-600/30 transition-all duration-200 no-underline whitespace-nowrap"
                      >
                        Admin Panel
                      </Link>
                    </motion.div>
                  )}

                  {/* Doctor Panel */}
                  {user.role === "doctor" && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to="/doctor-panel"
                        className="px-4 py-2 rounded-lg font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-600/30 transition-all duration-200 no-underline whitespace-nowrap"
                      >
                        Doctor Panel
                      </Link>
                    </motion.div>
                  )}

                  {/* Logout Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="ml-2 px-5 py-2 rounded-lg font-medium bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200 whitespace-nowrap"
                  >
                    Logout
                  </motion.button>
                </>
              )}

              {/* Logged-out Links */}
              {!user && (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/login"
                      className="px-6 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="px-6 py-2.5 rounded-lg font-semibold bg-teal-600/30 text-teal-300 hover:bg-teal-600/40 border border-teal-600/50 transition-all duration-200 no-underline"
                    >
                      Register
                    </Link>
                  </motion.div>
                </>
              )}

              {/* Theme Toggle Button */}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: mobileMenuOpen ? "auto" : 0,
            opacity: mobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-2">
            {user && (
              <>
                {user.role === "patient" && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/"
                      className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                )}
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/ai-assist"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    AI Assist
                  </Link>
                </motion.div>
                {user.role === "patient" && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/seek-expert"
                      className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Expert Help
                    </Link>
                  </motion.div>
                )}
                {user.role === "admin" && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/admin"
                      className="block px-4 py-3 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-600/30 transition-all duration-200 no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </motion.div>
                )}
                {user.role === "doctor" && (
                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/doctor-panel"
                      className="block px-4 py-3 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-600/30 transition-all duration-200 no-underline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Doctor Panel
                    </Link>
                  </motion.div>
                )}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                >
                  Logout
                </motion.button>
              </>
            )}
            {!user && (
              <>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200 no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="block px-4 py-3 rounded-lg bg-teal-600/30 text-teal-300 hover:bg-teal-600/40 border border-teal-600/50 transition-all duration-200 no-underline"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
