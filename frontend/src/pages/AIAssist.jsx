// frontend/src/pages/AIAssist.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Define the 4 chatbot options
const chatbotOptions = [
    { title: "THERAPY", description: "AI based therapy session", path: "/AI-Therapy-bot", icon: "", color: "from-purple-500 to-pink-500" },
    { title: "PERSONALIZED WELLNESS PLANNER", description: "AI based peronalized wellness planner for wellbeing", path: "/AI-Personalized-wellnes-planner", icon: "", color: "from-yellow-500 to-orange-500" },
    { title: "DOCTOR SUGGESTION", description: "Get advice and details of what kind of doctor you are looking for", path: "/AI-Doctor-Suggestion", icon: "", color: "from-blue-500 to-cyan-500" },
    { title: "MOTIVATION", description: "Short, guided meditation and breathing routines.", path: "/AI-Motivation", icon: "", color: "from-green-500 to-teal-500" },
];

const AIAssist = () => {
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
            <div className="w-full max-w-6xl mx-auto text-center relative z-10">
                <motion.h1
                    className="text-4xl font-extrabold mb-6 tracking-wide"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: "linear-gradient(to right, #a855f7, #4fd1c5)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    Seek AI Assistance
                </motion.h1>
                <motion.p
                    className="text-lg text-gray-300 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Choose a specialized chatbot below to start your personalized session.
                </motion.p>

                {/* Chatbot Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {chatbotOptions.map((option, index) => (
                        <motion.div
                            key={option.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link 
                                to={option.path} 
                                className="block"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="p-6 bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                >
                                    <div className="text-5xl mb-4">{option.icon}</div>
                                    <h2 className={`text-xl font-bold mb-2 bg-gradient-to-r ${option.color} bg-clip-text text-transparent`}>
                                        {option.title}
                                    </h2>
                                    <p className="text-gray-400 mb-4">{option.description}</p>
                                    
                                    <motion.span 
                                        className={`inline-block px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r ${option.color} text-white`}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        Start Session →
                                    </motion.span>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AIAssist;