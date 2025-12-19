import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = ({ setUser }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", form);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white p-6">

      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(79, 209, 197, 0.15), transparent 70%)",
        }}
        transition={{ duration: 1 }}
      />

      {/* Floating glowing orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(79, 209, 197, 0.15)" }}
      />

      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(168, 85, 247, 0.15)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 p-10 rounded-2xl shadow-2xl relative z-10"
      >
        {/* Title */}
        <motion.h2
          className="text-5xl font-extrabold mb-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "linear-gradient(to right, #4fd1c5, #a855f7)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Welcome Back
        </motion.h2>

        {/* Error Message */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 mb-6 text-center font-medium"
          >
            {error}
          </motion.p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <motion.div
            className="mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <motion.input
              type="email"
              placeholder="Email"
              className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none text-white placeholder-gray-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              animate={{
                boxShadow:
                  focusedField === "email"
                    ? "0 0 25px rgba(79, 209, 197, 0.4)"
                    : "none",
                borderColor:
                  focusedField === "email" ? "rgba(79, 209, 197, 0.8)" : "rgba(75,85,99,0.5)",
              }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-teal-400"
              initial={{ width: "0%" }}
              animate={{ width: focusedField === "email" ? "100%" : "0%" }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* PASSWORD */}
          <motion.div
            className="mb-6 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.input
              type="password"
              placeholder="Password"
              className="w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700 focus:outline-none text-white placeholder-gray-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              animate={{
                boxShadow:
                  focusedField === "password"
                    ? "0 0 25px rgba(168, 85, 247, 0.4)"
                    : "none",
                borderColor:
                  focusedField === "password" ? "rgba(168, 85, 247, 0.8)" : "rgba(75,85,99,0.5)",
              }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-purple-400"
              initial={{ width: "0%" }}
              animate={{ width: focusedField === "password" ? "100%" : "0%" }}
              transition={{ duration: 0.4 }}
            />
          </motion.div>

          {/* LOGIN BUTTON */}
          <motion.button
            type="submit"
            className="w-full py-4 mt-4 rounded-xl font-semibold text-lg text-white shadow-lg"
            style={{
              background: "linear-gradient(to right, #4fd1c5, #a855f7)",
              boxShadow: "0 10px 30px rgba(79,209,197,0.3)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 15px 45px rgba(168, 85, 247, 0.5)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Login
          </motion.button>

          {/* REGISTER LINK */}
          <motion.p
            className="text-center mt-6 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Don't have an account?{" "}
            <motion.span
              className="text-teal-400 font-semibold cursor-pointer"
              whileHover={{ scale: 1.08 }}
              onClick={() => navigate("/register")}
            >
              Register
            </motion.span>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
