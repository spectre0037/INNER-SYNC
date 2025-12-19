// frontend/src/components/UserHistoryModal.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const UserHistoryModal = ({ isOpen, onClose, userId, userName, userRole }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await axios.get(`/api/admin/user/appointments/${userId}`);
          setHistory(res.data);
        } catch (err) {
          setError("Failed to load appointment history.");
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-500/20 text-green-300 border border-green-600/40";
      case "rejected":
        return "bg-red-500/20 text-red-300 border border-red-600/40";
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border border-yellow-600/40";
      default:
        return "bg-gray-500/20 text-gray-300 border border-gray-600/40";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >

        {/* Floating neon orbs */}
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(168, 85, 247, 0.25)" }}
          animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.25, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(79, 209, 197, 0.25)" }}
          animate={{ opacity: [0.15, 0.35, 0.15], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Modal wrapper */}
        <motion.div
          className="relative bg-gray-900/70 backdrop-blur-xl text-white border border-gray-700/50 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50 flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {userName}'s Appointment History
            </h2>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.3, rotate: 90 }}
              whileTap={{ scale: 0.8 }}
              className="text-gray-300 hover:text-white text-3xl font-light"
            >
              &times;
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {loading ? (
              <motion.p
                className="text-center text-gray-300"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Loading history...
              </motion.p>
            ) : error ? (
              <p className="text-center text-red-400">{error}</p>
            ) : history.length === 0 ? (
              <p className="text-center text-gray-400">
                No appointment history found for this user.
              </p>
            ) : (
              <div className="space-y-4">
                {history.map((item) => (
                  <motion.div
                    key={item.appointment_id}
                    className="p-4 rounded-xl bg-gray-800/40 border border-gray-700/40 hover:bg-gray-800/60 transition-all shadow-md"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusStyle(
                          item.status
                        )}`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-400">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-200">
                      {userRole === "doctor" ? (
                        <>
                          Patient:{" "}
                          <span className="font-medium text-white">
                            {item.patient_name} ({item.patient_email})
                          </span>
                        </>
                      ) : (
                        <>
                          Doctor:{" "}
                          <span className="font-medium text-white">
                            {item.doctor_name} ({item.doctor_email})
                          </span>
                        </>
                      )}
                    </p>

                    {item.appointment_date && (
                      <p className="text-xs text-blue-300 mt-2">
                        Scheduled Date:{" "}
                        {new Date(item.appointment_date).toLocaleString()}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50 text-right">
            <motion.button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700/60 text-gray-200 hover:bg-gray-600/70 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserHistoryModal;
