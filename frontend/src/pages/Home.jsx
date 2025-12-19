// frontend/src/pages/Home.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = ({ user, error }) => {
    const [moodValue, setMoodValue] = useState(50);
    
    const moods = [
        { emoji: '😔', label: 'Down', value: 0, color: 'from-blue-900/40 to-gray-900', glow: 'rgba(59, 130, 246, 0.2)' },
        { emoji: '😊', label: 'Content', value: 25, color: 'from-green-900/40 to-gray-900', glow: 'rgba(34, 197, 94, 0.2)' },
        { emoji: '😌', label: 'Peaceful', value: 50, color: 'from-teal-900/40 to-gray-900', glow: 'rgba(20, 184, 166, 0.2)' },
        { emoji: '🤗', label: 'Happy', value: 75, color: 'from-yellow-900/40 to-gray-900', glow: 'rgba(234, 179, 8, 0.2)' },
        { emoji: '✨', label: 'Excited', value: 100, color: 'from-purple-900/40 to-gray-900', glow: 'rgba(168, 85, 247, 0.2)' }
    ];

    const getMoodFromValue = (value) => {
        if (value < 20) return moods[0];
        if (value < 37.5) return moods[1];
        if (value < 62.5) return moods[2];
        if (value < 87.5) return moods[3];
        return moods[4];
    };

    const currentMood = getMoodFromValue(moodValue);

    const features = [
        { icon: '🕐', title: '24/7 Support', description: 'Always here to listen and support you' },
        { icon: '🧠', title: 'Smart Insights', description: 'Personalized AI-powered guidance' },
        { icon: '🔒', title: 'Private & Secure', description: 'Your data is always protected' },
        { icon: '⚕️', title: 'Expert Care', description: 'Connect with professional doctors' }
    ];
    
    // Logic for Admin users
    const renderAdminWelcome = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <div className="inline-block p-4 bg-purple-500/20 rounded-full">
                    <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Welcome, Administrator!
            </h2>
            <p className="text-gray-400 mb-8">
                Manage your platform from the comprehensive admin dashboard.
            </p>
            <Link to="/admin">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25"
                >
                    Go to Admin Panel
                </motion.button>
            </Link>
        </motion.div>
    );

    // Logic for Doctor users
    const renderDoctorWelcome = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
            >
                <div className="inline-block p-4 bg-teal-500/20 rounded-full">
                    <svg className="w-16 h-16 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Welcome, Dr. {user.name}!
            </h2>
            <p className="text-gray-400 mb-8">
                Access your specialized doctor panel to manage patients.
            </p>
            <Link to="/doctor-panel">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-teal-500/25"
                >
                    Go to Doctor Panel
                </motion.button>
            </Link>
        </motion.div>
    );

    // Logic for Patient users
    const renderPatientWelcome = () => {
        const moodGradient = currentMood.color.replace('from-', '').replace(' to-gray-900', '');
        
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white">
                {/* Animated background with mood-based color */}
                <motion.div 
                    className="absolute inset-0 overflow-hidden pointer-events-none"
                    animate={{
                        background: `radial-gradient(circle at 50% 50%, ${currentMood.glow}, transparent 70%)`
                    }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
                        style={{ backgroundColor: currentMood.glow }}
                    />
                    <motion.div
                        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
                        style={{ backgroundColor: currentMood.glow }}
                    />
                </motion.div>

                <div className="relative pt-20 pb-20">
                    <div className="max-w-5xl mx-auto px-6 py-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            {/* Mood emoji badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                className="mb-6"
                            >
                                <div 
                                    className="inline-block p-6 rounded-full backdrop-blur-sm border-2"
                                    style={{ 
                                        backgroundColor: `${currentMood.glow}40`,
                                        borderColor: `${currentMood.glow}80`,
                                        boxShadow: `0 0 40px ${currentMood.glow}`
                                    }}
                                >
                                    <span className="text-7xl">{currentMood.emoji}</span>
                                </div>
                            </motion.div>

                            {/* Greeting */}
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-5xl font-bold mb-4"
                                style={{
                                    backgroundClip: 'text'
                                }}
                            >
                                Welcome back, {user.name}!
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-gray-300 mb-12"
                            >
                                You're feeling <span className="font-semibold" style={{ color: currentMood.glow.replace('0.2', '1') }}>{currentMood.label}</span> today
                            </motion.p>

                            {/* Mood Selector */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="max-w-2xl mx-auto mb-16"
                            >
                                <p className="text-sm text-gray-400 mb-8">
                                    How are you feeling right now?
                                </p>

                                {/* Mood Icons Row */}
                                <div className="flex justify-between items-end mb-8 px-4 relative z-10">
                                    {moods.map((mood, index) => {
                                        const isActive = Math.abs(mood.value - moodValue) < 12.5;
                                        return (
                                            <motion.div
                                                key={index}
                                                animate={{ scale: isActive ? 1.2 : 0.9, opacity: isActive ? 1 : 0.4 }}
                                                transition={{ duration: 0.3 }}
                                                className="flex flex-col items-center"
                                            >
                                                <div className="text-4xl mb-2">{mood.emoji}</div>
                                                <p className={`text-sm ${isActive ? 'font-medium' : 'text-gray-500'}`}
                                                   style={{ color: isActive ? mood.glow.replace('0.2', '1') : undefined }}>
                                                    {mood.label}
                                                </p>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Slider */}
                                <div className="relative px-4 py-6">
                                    <div className="relative">
                                        <motion.div
                                            className="absolute inset-0 h-3 rounded-full opacity-40 blur-sm"
                                            animate={{
                                                background: `linear-gradient(to right, ${currentMood.glow}, ${currentMood.glow})`
                                            }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        
                                        <div className="relative h-3 bg-gray-800 rounded-full shadow-inner overflow-hidden">
                                            <motion.div
                                                className="absolute h-full rounded-full"
                                                style={{ 
                                                    width: `${moodValue}%`,
                                                    background: `linear-gradient(to right, ${getMoodFromValue(0).glow}, ${currentMood.glow})`
                                                }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>

                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={moodValue}
                                            onChange={(e) => setMoodValue(parseInt(e.target.value))}
                                            className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer z-20"
                                        />

                                        <motion.div
                                            className="absolute -top-2.5 w-8 h-8 pointer-events-none z-10"
                                            style={{ left: `calc(${moodValue}% - 16px)` }}
                                            animate={{ 
                                                boxShadow: `0 0 25px ${currentMood.glow}`
                                            }}
                                        >
                                            <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-full shadow-2xl border-2 border-white/50">
                                                <motion.div 
                                                    className="absolute inset-1 rounded-full opacity-80"
                                                    style={{
                                                        background: `radial-gradient(circle at 30% 30%, ${currentMood.glow}, transparent)`
                                                    }}
                                                />
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CTA Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Link to="/patient-panel">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-10 py-4 text-white rounded-lg font-semibold text-lg transition-all duration-300"
                                        style={{
                                            background: `linear-gradient(to right, ${currentMood.glow.replace('0.2', '0.8')}, ${currentMood.glow.replace('0.2', '0.6')})`,
                                            boxShadow: `0 10px 40px ${currentMood.glow}`
                                        }}
                                    >
                                        Start Your Session
                                    </motion.button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <div className="py-16">
                        <div className="max-w-4xl mx-auto px-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { icon: '💬', title: 'Chat with AI', link: '/chat' },
                                    { icon: '📊', title: 'View Progress', link: '/dashboard' },
                                    { icon: '👨‍⚕️', title: 'Book Doctor', link: '/appointments' }
                                ].map((action, index) => (
                                    <Link key={index} to={action.link}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 text-center transition-all duration-300"
                                            style={{
                                                borderColor: `${currentMood.glow}30`
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = `${currentMood.glow}80`;
                                                e.currentTarget.style.boxShadow = `0 10px 30px ${currentMood.glow}`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = `${currentMood.glow}30`;
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div className="text-5xl mb-4">{action.icon}</div>
                                            <h3 className="text-xl font-semibold">{action.title}</h3>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Logic for unauthenticated users
    const renderUnauthenticated = () => (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white">
            {/* Animated background with mood-based color */}
            <motion.div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                animate={{
                    background: `radial-gradient(circle at 50% 50%, ${currentMood.glow}, transparent 70%)`
                }}
                transition={{ duration: 0.8 }}
            >
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                />
            </motion.div>

            <div className="relative pt-20 pb-20">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full mb-8 backdrop-blur-sm"
                        >
                            <span className="text-teal-400">💫</span>
                            <span className="text-sm text-gray-300">Your Mental Health Companion</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-8"
                        >
                            <span className="bg-gradient-to-br from-teal-300 via-teal-400 to-teal-500 bg-clip-text text-transparent">
                                Find Peace
                            </span>
                            <br />
                            <span className="text-white">of Mind</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed"
                        >
                            Experience a new way of emotional support. Our AI companion is here to listen, understand, and guide you through life's journey.
                        </motion.p>

                        {/* Mood Selector with animated background */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="max-w-2xl mx-auto mb-12"
                        >
                            <p className="text-sm text-gray-400 mb-8">
                                Whatever you're feeling, we're here to listen
                            </p>

                            {/* Mood-based background glow */}
                            <motion.div 
                                className={`absolute left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-3xl opacity-30 pointer-events-none`}
                                animate={{
                                    background: `radial-gradient(circle, ${currentMood.glow}, transparent)`
                                }}
                                transition={{ duration: 0.8 }}
                            />

                            {/* Mood Icons Row */}
                            <div className="flex justify-between items-end mb-8 px-4 relative z-10">
                                {moods.map((mood, index) => {
                                    const isActive = Math.abs(mood.value - moodValue) < 12.5;
                                    return (
                                        <motion.div
                                            key={index}
                                            animate={{ scale: isActive ? 1.2 : 0.9, opacity: isActive ? 1 : 0.4 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="text-4xl mb-2">{mood.emoji}</div>
                                            <p className={`text-sm ${isActive ? 'text-teal-400 font-medium' : 'text-gray-500'}`}>
                                                {mood.label}
                                            </p>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Enhanced Slider */}
                            <div className="relative px-4 py-6">
                                <div className="relative">
                                    {/* Track background with gradient based on mood */}
                                    <motion.div
                                        className="absolute inset-0 h-3 rounded-full opacity-40 blur-sm"
                                        animate={{
                                            background: `linear-gradient(to right, ${currentMood.glow}, ${currentMood.glow})`
                                        }}
                                        transition={{ duration: 0.5 }}
                                    />
                                    
                                    {/* Main track */}
                                    <div className="relative h-3 bg-gray-800 rounded-full shadow-inner overflow-hidden">
                                        {/* Progress fill with mood color */}
                                        <motion.div
                                            className="absolute h-full rounded-full"
                                            style={{ 
                                                width: `${moodValue}%`,
                                                background: `linear-gradient(to right, ${getMoodFromValue(0).glow}, ${currentMood.glow})`
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                        </motion.div>
                                    </div>

                                    {/* Draggable Input */}
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={moodValue}
                                        onChange={(e) => setMoodValue(parseInt(e.target.value))}
                                        className="absolute inset-0 w-full h-3 opacity-0 cursor-pointer z-20"
                                        style={{ 
                                            cursor: 'grab',
                                            WebkitAppearance: 'none'
                                        }}
                                        onMouseDown={(e) => e.target.style.cursor = 'grabbing'}
                                        onMouseUp={(e) => e.target.style.cursor = 'grab'}
                                    />

                                    {/* Animated Thumb */}
                                    <motion.div
                                        className="absolute -top-2.5 w-8 h-8 pointer-events-none z-10"
                                        style={{ left: `calc(${moodValue}% - 16px)` }}
                                        animate={{ 
                                            scale: [1, 1.1, 1],
                                            boxShadow: [
                                                `0 0 20px ${currentMood.glow}`,
                                                `0 0 30px ${currentMood.glow}`,
                                                `0 0 20px ${currentMood.glow}`
                                            ]
                                        }}
                                        transition={{ 
                                            scale: { duration: 2, repeat: Infinity },
                                            boxShadow: { duration: 2, repeat: Infinity }
                                        }}
                                    >
                                        {/* Outer glow ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full opacity-50"
                                            style={{ 
                                                background: currentMood.glow,
                                                filter: 'blur(8px)'
                                            }}
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        
                                        {/* Main thumb */}
                                        <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-100 rounded-full shadow-2xl border-2 border-white/50">
                                            {/* Inner gradient based on mood */}
                                            <motion.div 
                                                className="absolute inset-1 rounded-full opacity-80"
                                                style={{
                                                    background: `radial-gradient(circle at 30% 30%, ${currentMood.glow}, transparent)`
                                                }}
                                                transition={{ duration: 0.5 }}
                                            />
                                            
                                            {/* Highlight */}
                                            <div className="absolute inset-0.5 bg-gradient-to-br from-white/60 to-transparent rounded-full" />
                                        </div>
                                    </motion.div>
                                </div>

                                <p className="text-xs text-gray-500 mt-6 text-center">
                                    Slide to express how you're feeling today
                                </p>
                            </div>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg shadow-teal-500/25"
                                >
                                    Login
                                </motion.button>
                            </Link>
                            <Link to="/register">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-4 bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 text-white rounded-lg font-semibold text-lg transition-all duration-300"
                                >
                                    Register
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Features Section */}
                <div className="py-24">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                                How INNERSYNC Helps You
                            </h2>
                            <p className="text-lg text-gray-400">
                                Experience comprehensive mental health support
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/30 transition-all duration-300"
                                >
                                    <div className="text-5xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            {error && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="fixed top-4 right-4 z-50 bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-lg backdrop-blur-sm"
                >
                    <p className="font-medium">{error}</p>
                </motion.div>
            )}

            {/* Conditional rendering */}
            {user ? (
                user.role === 'patient' ? (
                    renderPatientWelcome()
                ) : (
                    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-4">
                        <div className="bg-gray-900/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-800/50 w-full max-w-lg">
                            {user.role === 'admin' ? renderAdminWelcome() :
                             user.role === 'doctor' ? renderDoctorWelcome() : null}
                        </div>
                    </div>
                )
            ) : (
                renderUnauthenticated()
            )}
        </div>
    );
};

export default Home;