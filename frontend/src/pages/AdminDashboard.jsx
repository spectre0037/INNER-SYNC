// frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import AdminDoctorManager from "../components/AdminDoctorManager";
import AdminPatientManager from "../components/AdminPatientManager";

const AdminDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState({
    verificationList: [],
    verifiedDoctors: [],
    allPatients: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("verification");

  // Prevent non-admins from entering
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/admin/dashboard");
      setDashboardData(res.data);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAction = () => {
    fetchDashboardData();
  };

  // Loading State (styled)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Admin Panel...
        </motion.div>
      </div>
    );
  }

  // Error State (styled)
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-xl font-bold">
        Error: {error}
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
        🏛️ Administrator Control Panel
      </motion.h1>

      {/* TAB SWITCHER */}
      <div className="max-w-5xl mx-auto flex justify-center space-x-4 mb-10">
        {[
          {
            key: "verification",
            label: `Doctor Verification (${dashboardData.verificationList.length})`,
            color: "from-red-500 to-pink-500",
          },
          {
            key: "doctors",
            label: `Manage Doctors (${dashboardData.verifiedDoctors.length})`,
            color: "from-blue-500 to-cyan-500",
          },
          {
            key: "patients",
            label: `Manage Patients (${dashboardData.allPatients.length})`,
            color: "from-green-500 to-teal-500",
          },
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab.key
                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color}/40`
                : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto bg-gray-900/40 backdrop-blur-xl border border-gray-700/40 p-8 rounded-2xl shadow-lg">

        {/* Verification Tab */}
        {activeTab === "verification" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-red-400">
              Pending Doctor Verification
            </h2>

            <AdminDoctorManager
              doctors={dashboardData.verificationList}
              isVerificationList={true}
              onAction={handleAction}
            />

            {dashboardData.verificationList.length === 0 && (
              <div className="text-gray-300 bg-gray-800/40 p-4 rounded-lg border border-gray-700 text-center">
                No doctors waiting for verification.
              </div>
            )}
          </motion.div>
        )}

        {/* Manage Doctors */}
        {activeTab === "doctors" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-blue-400">
              Verified Doctors
            </h2>

            <AdminDoctorManager
              doctors={dashboardData.verifiedDoctors}
              isVerificationList={false}
              onAction={handleAction}
            />
          </motion.div>
        )}

        {/* Manage Patients */}
        {activeTab === "patients" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-green-400">
              Registered Patients
            </h2>

            <AdminPatientManager
              patients={dashboardData.allPatients}
              onAction={handleAction}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
