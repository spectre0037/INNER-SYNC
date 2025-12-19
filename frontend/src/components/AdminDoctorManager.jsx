// frontend/src/components/AdminDoctorManager.jsx

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import UserHistoryModal from "./UserHistoryModal";

const DoctorCard = ({ doctor, isVerificationList, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVerify = async () => {
    if (
      window.confirm(`Are you sure you want to VERIFY Dr. ${doctor.name}?`)
    ) {
      try {
        await axios.post(`/api/admin/doctor/verify/${doctor.id}`);
        alert("Doctor verified!");
        onAction();
      } catch (error) {
        alert("Failed to verify doctor.");
      }
    }
  };

  const handleRemove = async () => {
    if (
      window.confirm(
        `WARNING: Remove Dr. ${doctor.name}? This will delete ALL associated data.`
      )
    ) {
      try {
        await axios.delete(`/api/admin/user/${doctor.id}`);
        alert("Doctor removed successfully!");
        onAction();
      } catch (error) {
        alert("Failed to remove doctor.");
      }
    }
  };

  return (
    <>
      <motion.div
        className="bg-gray-900/60 border border-gray-700/50 backdrop-blur-xl rounded-xl p-5 shadow-xl flex justify-between items-center
                   hover:bg-gray-900/80 transition-all relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Glowing accent bar */}
        <motion.div
          className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="pl-3">
          <p className="font-bold text-white text-lg">{doctor.name}</p>

          <p className="text-sm text-gray-400">
            {doctor.email} • {doctor.city}, {doctor.country}
          </p>

          {isVerificationList && (
            <p className="text-xs text-red-400 mt-1">
              Registered:{" "}
              {new Date(doctor.created_at).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="space-x-2 flex items-center">
          {/* View History Button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 text-sm rounded-lg bg-gray-700/60 text-gray-200 
                       hover:bg-gray-600/70 transition-all border border-gray-600/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View History
          </motion.button>

          {/* Verify or Remove Button */}
          {isVerificationList ? (
            <motion.button
              onClick={handleVerify}
              className="px-3 py-1 text-sm rounded-lg bg-green-600/80 text-white 
                         hover:bg-green-500 transition-all shadow-lg shadow-green-600/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Verify
            </motion.button>
          ) : (
            <motion.button
              onClick={handleRemove}
              className="px-3 py-1 text-sm rounded-lg bg-red-600/80 text-white 
                         hover:bg-red-500 transition-all shadow-lg shadow-red-600/40"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* History Modal */}
      <UserHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={doctor.id}
        userName={doctor.name}
        userRole="doctor"
      />
    </>
  );
};

const AdminDoctorManager = ({ doctors, isVerificationList, onAction }) => {
  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          isVerificationList={isVerificationList}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default AdminDoctorManager;
