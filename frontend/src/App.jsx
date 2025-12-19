// frontend/src/App.jsx - CORRECTED VERSION

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/NotFound"; // Corrected path (from components)
import AIAssist from "./pages/AIAssist";
import SeekExpert from "./pages/SeekExpert";
import DoctorPanel from "./pages/DoctorPanel";
import PatientDashboard from "./pages/PatientDashboard";
import AdminDashboard from "./pages/AdminDashboard"; // New Admin Dashboard
import TherapyBot from "./pages/Chatbots/TherapyBot";
import PersonalizedWellnessPlanner from "./pages/Chatbots/PersonalizedWellnessPlanner";
import DoctorSuggestionBot from "./pages/Chatbots/DoctorSuggestionBot";
import Motivation from './pages/Chatbots/Motivation'

axios.defaults.withCredentials = true;
// Set base URL for axios to simplify requests
axios.defaults.baseURL = "http://localhost:5000";

// Helper component for protected routes
const ProtectedRoute = ({ children, user, allowedRoles }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to home if user is logged in but doesn't have the required role
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  // user state now holds { id, name, email, role, city, country, is_doctor_verified }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // The /me endpoint now returns the role and location, which is saved to user state
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        // Silently handle authentication errors (user not logged in)
        if (err.response?.status === 401) {
          console.log("User not authenticated");
        } else {
          console.error("Error fetching user:", err);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        {/* 1. MAIN ROUTE - Home page for all users */}
        <Route path="/" element={<Home user={user} />} />

        {/* 2. AUTH ROUTES: Redirects logged-in users */}
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register setUser={setUser} />}
        />

        {/* 3. PROTECTED ROUTES */}

        {/* Patient Panel */}
        <Route
          path="/patient-panel"
          element={
            <ProtectedRoute user={user} allowedRoles={["patient"]}>
              <PatientDashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* AI Assistance (Within Patient Panel) */}
        <Route
          path="/ai-assist"
          element={
            <ProtectedRoute user={user} allowedRoles={["patient"]}>
              <AIAssist />
            </ProtectedRoute>
          }
        />



        <Route
          path="/AI-Therapy-bot"
          element={
            <ProtectedRoute user={user} allowedRoles={["patient"]}>
              <TherapyBot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AI-Motivation"
          element={
            <Motivation user={user} allowedRoles={["patient"]}>
              <TherapyBot />
            </Motivation>
          }
        />
        <Route
          path="/AI-Personalized-wellnes-planner"
          element={
            <PersonalizedWellnessPlanner user={user} allowedRoles={["patient"]}>
              <TherapyBot />
            </PersonalizedWellnessPlanner>
          }
        />
        <Route
          path="/AI-Doctor-Suggestion"
          element={
            <DoctorSuggestionBot user={user} allowedRoles={["patient"]}>
              <TherapyBot />
            </DoctorSuggestionBot>
          }
        />
        {/* Seek Expert Help (Within Patient Panel) */}
        <Route
          path="/seek-expert"
          element={
            <ProtectedRoute user={user} allowedRoles={["patient"]}>
              <SeekExpert />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} allowedRoles={["admin"]}>
              <AdminDashboard user={user} />
            </ProtectedRoute>
          }
        />

        {/* Doctor Panel */}
        <Route
          path="/doctor-panel"
          element={
            <ProtectedRoute user={user} allowedRoles={["doctor"]}>
              <DoctorPanel />
            </ProtectedRoute>
          }
        />

        {/* 4. 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
