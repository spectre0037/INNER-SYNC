// frontend/src/pages/Register.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Register = ({ setUser }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    city: "",
    country: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (form.role === "doctor" && (!form.city || !form.country)) {
      setIsLoading(false);
      return setError("Doctors must provide their city and country.");
    }

    try {
      const res = await axios.post("/api/auth/register", form);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white p-6">

      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.15), transparent 70%)",
        }}
        transition={{ duration: 1 }}
      />

      {/* Floating glowing orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(168, 85, 247, 0.18)" }}
      />

      <motion.div
        animate={{ scale: [1.1, 0.9, 1.1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(79, 209, 197, 0.18)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-xl bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 p-10 rounded-2xl shadow-2xl relative z-10"
      >
        {/* Title */}
        <motion.h2
          className="text-5xl font-extrabold mb-10 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "linear-gradient(to right, #a855f7, #4fd1c5)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Create Account
        </motion.h2>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 mb-6 rounded-xl bg-red-900/40 border border-red-500/40 text-red-300 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* INPUT FIELD BUILDER */}
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email Address", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
          ].map((field, index) => (
            <motion.div
              key={field.name}
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.input
                type={field.type}
                name={field.name}
                placeholder={field.label}
                value={form[field.name]}
                onChange={handleChange}
                onFocus={() => setFocusedField(field.name)}
                onBlur={() => setFocusedField(null)}
                className="w-full p-4 rounded-xl bg-gray-800/40 border border-gray-700 text-white placeholder-gray-400 focus:outline-none"
                animate={{
                  boxShadow:
                    focusedField === field.name
                      ? "0 0 20px rgba(168,85,247,0.5)"
                      : "none",
                  borderColor:
                    focusedField === field.name
                      ? "rgba(168, 85, 247, 0.9)"
                      : "rgba(75,85,99,0.5)",
                }}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
          ))}

          {/* ROLE SELECTION */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <label className="block mb-2 text-sm text-gray-300 font-medium">
              I am a:
            </label>

            <motion.select
              name="role"
              value={form.role}
              onChange={handleChange}
              whileFocus={{ scale: 1.02 }}
              className="w-full p-4 rounded-xl bg-gray-800/40 border border-gray-700 text-white cursor-pointer"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </motion.select>
          </motion.div>

          {/* DOCTOR FIELDS */}
          <AnimatePresence>
            {form.role === "doctor" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 mt-6"
              >
                <p className="text-sm text-gray-300 bg-gray-800/40 p-3 rounded-lg border border-gray-700">
                  📋 Additional details required for doctors.
                </p>

                {/* City */}
                <motion.input
                  type="text"
                  placeholder="Clinic City"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("city")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full p-4 rounded-xl bg-gray-800/40 border border-gray-700 text-white placeholder-gray-400"
                  animate={{
                    borderColor:
                      focusedField === "city"
                        ? "rgba(79,209,197,0.9)"
                        : "rgba(75,85,99,0.5)",
                    boxShadow:
                      focusedField === "city"
                        ? "0 0 20px rgba(79,209,197,0.5)"
                        : "none",
                  }}
                  required
                />

                {/* Country */}
                <motion.input
                  type="text"
                  placeholder="Clinic Country"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("country")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full p-4 rounded-xl bg-gray-800/40 border border-gray-700 text-white placeholder-gray-400"
                  animate={{
                    borderColor:
                      focusedField === "country"
                        ? "rgba(79,209,197,0.9)"
                        : "rgba(75,85,99,0.5)",
                    boxShadow:
                      focusedField === "country"
                        ? "0 0 20px rgba(79,209,197,0.5)"
                        : "none",
                  }}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* SUBMIT BUTTON */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-semibold text-lg text-white mt-6 shadow-lg"
            style={{
              background: "linear-gradient(to right, #a855f7, #4fd1c5)",
              opacity: isLoading ? 0.6 : 1,
            }}
            whileHover={!isLoading ? { scale: 1.05 } : {}}
            whileTap={!isLoading ? { scale: 0.97 } : {}}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </motion.button>

          {/* LOGIN LINK */}
          <p className="text-center mt-6 text-gray-300">
            Already have an account?{" "}
            <span
              className="text-teal-400 cursor-pointer font-semibold"
              onClick={() => navigate("/login")}
            >
              Sign In
            </span>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;
