// frontend/src/pages/PatientDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentCard = ({ appt, index }) => {
    let statusClass = '';
    let statusMessage = '';
    let gradientClass = '';

    if (appt.status === 'accepted') {
        statusClass = 'border-green-500/50 bg-gray-800/40';
        gradientClass = 'from-green-400 to-green-600';
        statusMessage = `Accepted! Scheduled for ${new Date(appt.appointment_date).toLocaleString()}. Doctor's Email: ${appt.doctor_email}`;
    } else if (appt.status === 'rejected') {
        statusClass = 'border-red-500/50 bg-gray-800/40';
        gradientClass = 'from-red-400 to-red-600';
        statusMessage = "Rejected. The doctor cannot meet this request. You may try another expert.";
    } else {
        statusClass = 'border-yellow-500/50 bg-gray-800/40';
        gradientClass = 'from-yellow-400 to-yellow-600';
        statusMessage = "Pending. The doctor is currently reviewing your request.";
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            className={`p-6 rounded-2xl shadow-lg border-l-4 ${statusClass} backdrop-blur-xl mb-4 relative overflow-hidden`}
        >
            <motion.div
                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientClass}`}
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            />
            
            <motion.h3
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
            >
                Appointment with Dr. {appt.doctor_name}
            </motion.h3>
            
            <motion.p
                className="text-sm text-gray-300 mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
            >
                📍 Location: {appt.doctor_city}
            </motion.p>
            
            <motion.p
                className="text-gray-200 font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
            >
                {statusMessage}
            </motion.p>
            
            {appt.status === 'accepted' && (
                <motion.p
                    className="mt-3 text-sm text-green-300 bg-green-900/30 p-3 rounded-lg border border-green-700/40"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                >
                    ✉️ Please reach out to Dr. {appt.doctor_name} at <strong>{appt.doctor_email}</strong> to finalize details.
                </motion.p>
            )}
        </motion.div>
    );
};

const PatientDashboard = ({ user }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAcceptedMessage, setShowAcceptedMessage] = useState(false);

    useEffect(() => {
        if (user && user.role === 'patient') {
            fetchAppointments();
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        let timer;
        if (showAcceptedMessage) {
            timer = setTimeout(() => {
                setShowAcceptedMessage(false);
            }, 10000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [showAcceptedMessage]);

    const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get('/api/patient/appointments');
            setAppointments(res.data);
            
            const accepted = res.data.filter(a => a.status === 'accepted');
            if (accepted.length > 0) {
                setShowAcceptedMessage(true);
            }
        } catch (err) {
            setError("Failed to fetch your appointment history.");
            console.error("Patient Appointments Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading Patient Dashboard...
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 text-xl font-bold">
                Error: {error}
            </div>
        );
    }

    if (user.role !== 'patient') {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 text-xl font-bold">
                Access Restricted.
            </div>
        );
    }

    const acceptedAppointments = appointments.filter(a => a.status === 'accepted');
    const rejectedAppointments = appointments.filter(a => a.status === 'rejected');
    const pendingAppointments = appointments.filter(a => a.status === 'pending');

    return (
        <div className="relative min-h-screen p-6 sm:p-10 text-white bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 overflow-hidden">

            {/* Animated Background Glow */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                    background: "radial-gradient(circle at 50% 50%, rgba(148, 63, 255, 0.15), transparent 70%)",
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
                👋 Patient Dashboard
            </motion.h1>

            <motion.p
                className="text-center text-xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Welcome, {user.name}
            </motion.p>

            {/* Rejected Notification */}
            <AnimatePresence>
                {rejectedAppointments.length > 0 && (
                    <motion.div
                        className="max-w-5xl mx-auto mb-6 bg-gradient-to-r from-red-500 to-pink-500 text-white p-5 rounded-2xl font-bold shadow-lg"
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        🚨 {rejectedAppointments.length} Appointment Request(s) Rejected: Please check your appointment list below.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Accepted Notification */}
            <AnimatePresence>
                {showAcceptedMessage && acceptedAppointments.length > 0 && (
                    <motion.div
                        className="max-w-5xl mx-auto mb-6 bg-gradient-to-r from-green-500 to-teal-500 text-white p-5 rounded-2xl font-bold shadow-lg"
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        ✅ Success! {acceptedAppointments.length} Appointment(s) Accepted. Check details below.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* User Profile */}
            <motion.div
                className="max-w-5xl mx-auto mb-8 bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
            >
                <motion.h2
                    className="text-2xl font-bold mb-6 text-purple-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Your Profile
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                    {[
                        { label: "Name", value: user.name },
                        { label: "Email", value: user.email },
                        { label: "Role", value: user.role.charAt(0).toUpperCase() + user.role.slice(1) }
                    ].map((item, i) => (
                        <motion.p
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + i * 0.1 }}
                            className="text-lg"
                        >
                            <strong className="text-white">{item.label}:</strong> {item.value}
                        </motion.p>
                    ))}
                </div>
            </motion.div>

            {/* Appointments Section */}
            <div className="max-w-6xl mx-auto bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 p-8 rounded-2xl shadow-lg">
                <motion.h2
                    className="text-3xl font-bold mb-6 text-cyan-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Your Appointments ({appointments.length})
                </motion.h2>

                {appointments.length === 0 ? (
                    <motion.div
                        className="bg-gray-800/40 p-8 rounded-2xl border border-gray-700/40 text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                    >
                        <p className="text-xl text-gray-300">
                            You have not requested any appointments yet. Go to <strong className="text-cyan-400">Seek Expert Help</strong> to start!
                        </p>
                    </motion.div>
                ) : (
                    <div className="space-y-8">
                        {/* Pending */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.h3
                                className="text-2xl font-bold text-yellow-400 mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                ⏳ Pending Requests ({pendingAppointments.length})
                            </motion.h3>
                            <AnimatePresence>
                                {pendingAppointments.map((appt, i) => (
                                    <AppointmentCard key={appt.appointment_id} appt={appt} index={i} />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Accepted */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="border-t border-gray-700/40 pt-6"
                        >
                            <motion.h3
                                className="text-2xl font-bold text-green-400 mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                ✅ Accepted Appointments ({acceptedAppointments.length})
                            </motion.h3>
                            <AnimatePresence>
                                {acceptedAppointments.map((appt, i) => (
                                    <AppointmentCard key={appt.appointment_id} appt={appt} index={i} />
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Rejected */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="border-t border-gray-700/40 pt-6"
                        >
                            <motion.h3
                                className="text-2xl font-bold text-red-400 mb-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                ❌ Rejected/Completed History ({rejectedAppointments.length})
                            </motion.h3>
                            <AnimatePresence>
                                {rejectedAppointments.map((appt, i) => (
                                    <AppointmentCard key={appt.appointment_id} appt={appt} index={i} />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientDashboard;
