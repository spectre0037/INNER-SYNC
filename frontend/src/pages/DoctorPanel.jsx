// frontend/src/pages/DoctorPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorProfileForm from '../components/DoctorProfileForm';

const DoctorPanel = () => {
    const [profile, setProfile] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [actionLoading, setActionLoading] = useState(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const profileRes = await axios.get('/api/doctor/profile');
            setProfile(profileRes.data);
            const apptRes = await axios.get('/api/doctor/appointments');
            setAppointments(apptRes.data);
        } catch (err) {
            setError('Failed to fetch doctor panel data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentAction = async (appointmentId, action) => {
        if (action === 'accept') {
            setSelectedAppointmentId(appointmentId);
            setShowScheduleModal(true);
            return;
        }

        setActionLoading(appointmentId);
        try {
            await axios.post(`/api/doctor/appointment/${appointmentId}/action`, { action });
            await fetchData();
            alert(`Appointment ${action}ed successfully!`);
        } catch (err) {
            setError(`Failed to perform action: ${action}.`);
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleScheduleConfirm = async () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        const appointmentDateTime = `${selectedDate} ${selectedTime}:00`;
        setActionLoading(selectedAppointmentId);
        try {
            await axios.post(`/api/doctor/appointment/${selectedAppointmentId}/action`, {
                action: 'accept',
                appointmentDate: appointmentDateTime
            });
            await fetchData();
            setShowScheduleModal(false);
            setSelectedDate('');
            setSelectedTime('');
            setSelectedAppointmentId(null);
            alert('Appointment scheduled successfully!');
        } catch (err) {
            setError('Failed to schedule appointment.');
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 18; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if (hour === 18 && minute > 0) break;
                slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white text-xl">
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    Loading Doctor Panel...
                </motion.div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400 text-xl font-bold">
                Error: {error}
            </div>
        );
    }

    if (!profile) return <div className="p-8 text-center text-xl text-white">Profile data not available.</div>;

    const { user, profile: doctorProfile } = profile;

    const renderDashboard = () => (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            {/* Profile Dashboard Card */}
            <motion.div className="bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold mb-6 text-cyan-400">
                    Dashboard Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { label: 'Name', value: user.name },
                        { label: 'Email', value: user.email },
                        { label: 'Profession', value: doctorProfile.profession || 'N/A' },
                        {
                            label: 'Clinic Address',
                            value: doctorProfile.clinic_address || `${user.city}, ${user.country}`
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/40 hover:border-cyan-500/40 transition-all"
                        >
                            <p className="text-sm text-gray-400 font-medium mb-1">{item.label}</p>
                            <p className="text-lg font-semibold text-gray-200">{item.value}</p>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/40"
                    >
                        <p className="text-sm text-gray-400 font-medium mb-1">Verification</p>
                        <span
                            className={`inline-block px-4 py-2 rounded-full font-semibold ${
                                user.is_doctor_verified ? 'bg-green-500/20 text-green-400 border border-green-500/40' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                            }`}
                        >
                            {user.is_doctor_verified ? '✅ Verified' : '⏳ Pending Review'}
                        </span>
                    </motion.div>
                </div>

                {/* Availability Section */}
                <div className="mt-8 pt-6 border-t border-gray-700/40">
                    <h3 className="text-2xl font-bold mb-4 text-purple-400">Availability Hours</h3>
                    {doctorProfile.availability?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {doctorProfile.availability.map((avail, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 p-4 rounded-xl"
                                >
                                    <p className="font-bold text-lg mb-1 text-purple-300">{avail.day_of_week}</p>
                                    <p className="text-gray-300">
                                        {avail.start_time} - {avail.end_time}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-red-500/20 border border-red-500/40 p-6 rounded-xl">
                            <p className="text-red-400 font-semibold text-lg">
                                ⚠️ No availability set. Please go to Profile Setup tab to configure.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Appointments Section */}
            <div>
                <h2 className="text-4xl font-bold mb-6 text-cyan-400">
                    Patient Appointment Requests{' '}
                    <span className="ml-4 inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-2xl">
                        {appointments.length}
                    </span>
                </h2>

                <AnimatePresence mode="wait">
                    {appointments.length === 0 ? (
                        <motion.div
                            key="no-appointments"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-yellow-500/20 border border-yellow-500/40 p-8 rounded-2xl"
                        >
                            <p className="text-xl text-yellow-400 font-semibold text-center">
                                📭 No pending appointment requests at this time.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {appointments.map((appt, index) => (
                                <motion.div
                                    key={appt.appointment_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-gray-900/40 backdrop-blur-xl border-l-4 border-cyan-500 p-6 rounded-2xl"
                                >
                                    <h3 className="text-2xl font-bold mb-2 text-gray-200">
                                        Request from: {appt.patient_name}
                                    </h3>
                                    <p className="text-sm text-gray-400 mb-3">
                                        📅 Requested on: {new Date(appt.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-300 font-medium mb-2">📧 Email: {appt.patient_email}</p>
                                    <div className="mt-4 p-4 bg-gray-800/40 rounded-xl border border-gray-700/40">
                                        <p className="text-sm text-gray-400 font-semibold mb-1">Message:</p>
                                        <p className="text-gray-300">{appt.request_message}</p>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAppointmentAction(appt.appointment_id, 'accept')}
                                            disabled={actionLoading === appt.appointment_id}
                                            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading === appt.appointment_id ? '⏳ Processing...' : '✅ Accept & Schedule'}
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAppointmentAction(appt.appointment_id, 'reject')}
                                            disabled={actionLoading === appt.appointment_id}
                                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            ❌ Reject
                                        </motion.button>

                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAppointmentAction(appt.appointment_id, 'delete')}
                                            disabled={actionLoading === appt.appointment_id}
                                            className="bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            🗑️ Delete Request
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );

    const renderProfileSetup = () => (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <DoctorProfileForm profileData={profile} onUpdate={fetchData} userLocation={{ city: user.city, country: user.country }} />
        </motion.div>
    );

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

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                <motion.h1
                    className="text-4xl font-extrabold text-center tracking-wide"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: "linear-gradient(to right, #06b6d4, #8b5cf6)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    🩺 Doctor Panel - Dr. {user.name}
                </motion.h1>

                {/* Tab Navigation */}
                <div className="max-w-5xl mx-auto flex justify-center space-x-4">
                    {[
                        { id: 'dashboard', label: 'Dashboard & Appointments', color: 'from-cyan-500 to-blue-500' },
                        { id: 'profile_setup', label: 'Profile Setup & Availability', color: 'from-purple-500 to-pink-500' }
                    ].map((tab) => (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                                activeTab === tab.id
                                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                                    : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
                            }`}
                        >
                            {tab.label}
                        </motion.button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="max-w-6xl mx-auto bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 p-8 rounded-2xl shadow-lg">
                    <AnimatePresence mode="wait">
                        <div key={activeTab}>{activeTab === 'dashboard' ? renderDashboard() : renderProfileSetup()}</div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Schedule Appointment Modal */}
            <AnimatePresence>
                {showScheduleModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowScheduleModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: 'spring', bounce: 0.3 }}
                            className="bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-3xl font-bold text-cyan-400 mb-6">📅 Schedule Appointment</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-lg font-bold text-gray-300 mb-3">Select Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={getMinDate()}
                                        className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 transition-all text-lg font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-lg font-bold text-gray-300 mb-3">Select Time</label>
                                    <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-800/40 rounded-xl border border-gray-700">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                                    selectedTime === time
                                                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {(selectedDate || selectedTime) && (
                                    <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 text-green-400 font-semibold">
                                        Selected: {selectedDate} {selectedTime}
                                    </div>
                                )}

                                <div className="flex justify-end mt-6 gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowScheduleModal(false)}
                                        className="px-6 py-3 bg-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-600 transition-all"
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleScheduleConfirm}
                                        disabled={actionLoading === selectedAppointmentId}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {actionLoading === selectedAppointmentId ? '⏳ Scheduling...' : '✅ Confirm Schedule'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DoctorPanel;
