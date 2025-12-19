// frontend/src/pages/SeekExpert.jsx

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const SeekExpert = () => {
    const [search, setSearch] = useState({ city: "", country: "" });
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setDoctors([]);
        setError("");
        
        try {
            const res = await axios.get(`/api/doctors?city=${search.city}&country=${search.country}`);
            
            if (res.data.length === 0) {
                setError(`No doctors found in ${search.city}, ${search.country}.`);
            } else {
                setDoctors(res.data);
            }
        } catch (err) {
            setError("Error fetching doctors. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAppointment = async (doctorId) => {
        setSuccess("");
        setError("");
        try {
            await axios.post("/api/appointments", {
                doctorId,
                requestMessage: "I would like to request an appointment.",
            });
            setSuccess("Appointment request sent successfully! The doctor will contact you soon.");
            setDoctors(doctors.filter(d => d.id !== doctorId));
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to send appointment request.";
            setError(errorMessage);
        }
    };

    // Loading State
    if (loading && doctors.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Searching for Doctors...
                </motion.div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen p-6 sm:p-10 text-white bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 overflow-hidden">

            {/* Animated Background Glow */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    background:
                        "radial-gradient(circle at 50% 50%, rgba(148, 63, 255, 0.15), transparent 70%)",
                }}
                transition={{ duration: 1 }}
            />

            {/* Floating neon orbs */}
            <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-10 left-20 w-96 h-96 rounded-full blur-3xl"
                style={{ backgroundColor: "rgba(168, 85, 247, 0.2)" }}
            />
            <motion.div
                animate={{ scale: [1.2, 0.9, 1.2], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute bottom-10 right-20 w-96 h-96 rounded-full blur-3xl"
                style={{ backgroundColor: "rgba(79, 209, 197, 0.2)" }}
            />

            {/* Page Title */}
            <motion.h1
                className="text-4xl font-extrabold mb-10 text-center tracking-wide"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: "linear-gradient(to right, #a855f7, #4fd1c5)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                }}
            >
                🩺 Seek Expert Help
            </motion.h1>

            <div className="max-w-5xl mx-auto">
                {/* Search Form */}
                <motion.form 
                    onSubmit={handleSearch} 
                    className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 p-6 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <input
                        type="text"
                        placeholder="City"
                        className="bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 p-3 flex-grow rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={search.city}
                        onChange={(e) => setSearch({ ...search, city: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Country"
                        className="bg-gray-800/60 border border-gray-600 text-white placeholder-gray-400 p-3 flex-grow rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={search.country}
                        onChange={(e) => setSearch({ ...search, country: e.target.value })}
                        required
                    />
                    <motion.button 
                        type="submit" 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/40 transition-all sm:w-auto"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Find Doctors'}
                    </motion.button>
                </motion.form>

                {/* Messages */}
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-900/40 border border-red-500/50 text-red-300 p-4 rounded-lg mb-6 font-medium"
                    >
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-900/40 border border-green-500/50 text-green-300 p-4 rounded-lg mb-6 font-medium"
                    >
                        {success}
                    </motion.div>
                )}

                {/* Results */}
                {doctors.length > 0 && (
                    <motion.div 
                        className="space-y-4"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h2 className="text-2xl font-bold text-teal-400 mb-4">
                            Available Experts
                        </h2>
                        {doctors.map((doctor) => (
                            <motion.div 
                                key={doctor.id} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 p-6 rounded-2xl shadow-lg"
                            >
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-xl font-bold text-white">
                                        {doctor.name} <span className="text-teal-400 text-sm">(Verified)</span>
                                    </h3>
                                    <p className="text-gray-400">{doctor.city}, {doctor.country}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Available Hours: {doctor.availability_hours || 'N/A'}
                                    </p>
                                </div>
                                <motion.button
                                    onClick={() => handleRequestAppointment(doctor.id)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-purple-500/40 transition-all"
                                >
                                    Request Appointment
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SeekExpert;