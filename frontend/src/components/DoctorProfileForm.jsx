// frontend/src/components/DoctorProfileForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorProfileForm = ({ profileData, onUpdate, userLocation }) => {
  const [profession, setProfession] = useState(profileData.profile.profession || '');
  const [clinicAddress, setClinicAddress] = useState(profileData.profile.clinic_address || '');
  const [availability, setAvailability] = useState(profileData.profile.availability || []);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfession(profileData.profile.profession || '');
    setClinicAddress(profileData.profile.clinic_address || '');
    setAvailability(profileData.profile.availability || []);
  }, [profileData]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await axios.post('/api/doctor/profile/update', { profession, clinicAddress });
      setMessage({ type: 'success', text: 'Profile details saved!' });
      onUpdate();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvailChange = (index, field, value) => {
    const newAvail = [...availability];
    newAvail[index][field] = value;
    setAvailability(newAvail);
  };

  const handleAddAvailability = () => {
    setAvailability([...availability, { day_of_week: 'Monday', start_time: '09:00', end_time: '17:00' }]);
  };

  const handleRemoveAvailability = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const formattedAvailability = availability.map(item => ({
      dayOfWeek: item.day_of_week,
      startTime: item.start_time,
      endTime: item.end_time
    }));

    try {
      await axios.post('/api/doctor/availability/set', { availability: formattedAvailability });
      setMessage({ type: 'success', text: 'Availability saved!' });
      onUpdate();
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save availability.' });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  const availabilityItemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="space-y-10 max-w-5xl mx-auto px-4 py-8 relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Neon gradient background accent */}
      <motion.div
        className="absolute top-0 left-1/2 w-[600px] h-[600px] -translate-x-1/2 rounded-full blur-3xl opacity-20 bg-gradient-to-r from-purple-500 to-cyan-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-2xl font-medium shadow-xl backdrop-blur-md border ${
              message.type === 'success'
                ? 'bg-green-600/20 border-green-400 text-green-200'
                : 'bg-red-600/20 border-red-400 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{message.type === 'success' ? '✓' : '⚠'}</span>
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Update Form */}
      <motion.form 
        onSubmit={handleProfileSubmit} 
        className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
        variants={itemVariants}
        whileHover={{ y: -3 }}
      >
        <motion.h3 
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Update Professional Profile
        </motion.h3>

        <motion.div 
          className="flex items-center gap-2 mb-6 text-sm text-gray-300 bg-gray-800/40 p-3 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-lg">📍</span>
          <span className="font-medium">Registered Location:</span> 
          <span className="text-white font-semibold">{userLocation.city}, {userLocation.country}</span>
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-gray-200 font-semibold mb-2 uppercase tracking-wide text-sm">
            Profession
          </label>
          <motion.input
            type="text"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="border-2 border-gray-700 p-4 w-full rounded-xl focus:outline-none focus:border-purple-400 transition-all duration-300 bg-gray-800/40 text-white shadow-md hover:shadow-lg"
            placeholder="e.g., Psychologist, Cardiologist"
            required
          />
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-gray-200 font-semibold mb-2 uppercase tracking-wide text-sm">
            Clinic Address
          </label>
          <motion.textarea
            value={clinicAddress}
            onChange={(e) => setClinicAddress(e.target.value)}
            className="border-2 border-gray-700 p-4 w-full rounded-xl focus:outline-none focus:border-cyan-400 transition-all duration-300 bg-gray-800/40 text-white shadow-md hover:shadow-lg resize-none"
            rows="4"
            placeholder="Enter your complete clinic address..."
            required
          />
        </motion.div>

        <motion.button 
          type="submit" 
          className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
          disabled={loading}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? '⏳ Saving...' : '💾 Save Profile Details'}
        </motion.button>
      </motion.form>

      {/* Availability Form */}
      <motion.form 
        onSubmit={handleAvailabilitySubmit} 
        className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden"
        variants={itemVariants}
        whileHover={{ y: -3 }}
      >
        <motion.h3 
          className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Set Weekly Availability
        </motion.h3>

        <div className="space-y-4">
          <AnimatePresence>
            {availability.map((item, index) => (
              <motion.div 
                key={index}
                className="bg-gray-800/40 p-5 rounded-2xl shadow-md border border-gray-700/50 flex flex-wrap gap-3 items-center"
                variants={availabilityItemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                <motion.select
                  value={item.day_of_week}
                  onChange={(e) => handleAvailChange(index, 'day_of_week', e.target.value)}
                  className="border-2 border-gray-700 p-3 rounded-xl flex-1 min-w-[140px] focus:outline-none focus:border-purple-400 bg-gray-900/40 text-white shadow-sm font-medium"
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </motion.select>

                <motion.input
                  type="time"
                  value={item.start_time}
                  onChange={(e) => handleAvailChange(index, 'start_time', e.target.value)}
                  className="border-2 border-gray-700 p-3 rounded-xl flex-1 min-w-[130px] focus:outline-none focus:border-cyan-400 bg-gray-900/40 text-white shadow-sm font-medium"
                  required
                />

                <span className="text-gray-400 font-bold text-lg">→</span>

                <motion.input
                  type="time"
                  value={item.end_time}
                  onChange={(e) => handleAvailChange(index, 'end_time', e.target.value)}
                  className="border-2 border-gray-700 p-3 rounded-xl flex-1 min-w-[130px] focus:outline-none focus:border-cyan-400 bg-gray-900/40 text-white shadow-sm font-medium"
                  required
                />

                <motion.button
                  type="button"
                  onClick={() => handleRemoveAvailability(index)}
                  className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 hover:shadow-lg transition-all duration-300 font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ Remove
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-4 mt-6">
          <motion.button
            type="button"
            onClick={handleAddAvailability}
            className="bg-gray-700/40 text-white px-6 py-4 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            ➕ Add Availability Block
          </motion.button>
          <motion.button 
            type="submit" 
            className="bg-gradient-to-r from-purple-500 to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? '⏳ Saving...' : '✅ Save All Availability'}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default DoctorProfileForm;
