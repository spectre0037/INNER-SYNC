// frontend/src/components/AdminPatientManager.jsx

import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import UserHistoryModal from "./UserHistoryModal";

const PatientCard = ({ patient, onAction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemove = async () => {
    if (
      window.confirm(
        `WARNING: Are you sure you want to REMOVE ${patient.name}? This will delete ALL associated appointments.`
      )
    ) {
      try {
        await axios.delete(`/api/admin/user/${patient.id}`);
        alert("Patient removed successfully!");
        onAction();
      } catch (error) {
        alert("Failed to remove patient.");
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
        {/* Neon accent glow bar */}
        <motion.div
          className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-green-400 to-blue-300 rounded-full"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="pl-3">
          <p className="font-bold text-white text-lg">{patient.name}</p>

          <p className="text-sm text-gray-400">
            {patient.email} • {patient.city}, {patient.country}
          </p>
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

          {/* Remove Button */}
          <motion.button
            onClick={handleRemove}
            className="px-3 py-1 text-sm rounded-lg bg-red-600/80 text-white
                       hover:bg-red-500 transition-all shadow-lg shadow-red-600/40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Remove
          </motion.button>
        </div>
      </motion.div>

      {/* Appointment History Modal */}
      <UserHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={patient.id}
        userName={patient.name}
        userRole="patient"
      />
    </>
  );
};

const AdminPatientManager = ({ patients, onAction }) => {
  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} onAction={onAction} />
      ))}
    </div>
  );
};

export default AdminPatientManager;
