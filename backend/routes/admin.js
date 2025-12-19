// backend/routes/admin.js

import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Middleware to ensure only Admin can access these routes
const adminProtect = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }
    next();
};

// --- 1. ADMIN DASHBOARD DATA (Verification & Summary) ---

// GET /api/admin/dashboard
router.get("/dashboard", protect, adminProtect, async (req, res) => {
    try {
        // List of doctors needing verification
        const verificationList = await pool.query(
            "SELECT id, name, email, city, country, created_at FROM users WHERE role = $1 AND is_doctor_verified = $2 ORDER BY created_at ASC",
            ['doctor', false]
        );

        // List of verified doctors for general management
        const verifiedDoctors = await pool.query(
            "SELECT id, name, email, city, country FROM users WHERE role = $1 AND is_doctor_verified = $2 ORDER BY name ASC",
            ['doctor', true]
        );
        
        // List of all patients
        const allPatients = await pool.query(
            "SELECT id, name, email, city, country FROM users WHERE role = $1 ORDER BY name ASC",
            ['patient']
        );

        res.json({
            verificationList: verificationList.rows,
            verifiedDoctors: verifiedDoctors.rows,
            allPatients: allPatients.rows
        });
    } catch (error) {
        console.error("Admin dashboard fetch error:", error);
        res.status(500).json({ message: "Server error fetching admin dashboard data." });
    }
});

// --- 2. ADMIN ACTIONS ---

// POST /api/admin/doctor/verify/:id - Verify a Doctor
router.post("/doctor/verify/:id", protect, adminProtect, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(
            "UPDATE users SET is_doctor_verified = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND role = $3",
            [true, id, 'doctor']
        );
        res.json({ message: "Doctor verified successfully." });
    } catch (error) {
        console.error("Doctor verification error:", error);
        res.status(500).json({ message: "Server error verifying doctor." });
    }
});

// DELETE /api/admin/user/:id - Remove (Delete) a User (Doctor or Patient)
router.delete("/user/:id", protect, adminProtect, async (req, res) => {
    const { id } = req.params;
    try {
        // First, delete associated appointments and profile (cascade delete setup is better, 
        // but explicit deletion ensures clean removal if FK wasn't set to CASCADE)
        await pool.query("DELETE FROM appointments WHERE patient_id = $1 OR doctor_id = $1", [id]);
        await pool.query("DELETE FROM doctor_profiles WHERE user_id = $1", [id]);
        await pool.query("DELETE FROM doctor_availability WHERE doctor_id = $1", [id]);
        
        // Now delete the user
        const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        
        res.json({ message: "User and all associated data deleted successfully." });
    } catch (error) {
        console.error("User deletion error:", error);
        res.status(500).json({ message: "Server error deleting user." });
    }
});

// --- 3. DETAIL VIEW DATA (Appointments History) ---

// GET /api/admin/user/appointments/:id - Get appointment history for a specific user (Doctor or Patient)
router.get("/user/appointments/:id", protect, adminProtect, async (req, res) => {
    const { id } = req.params; // ID of the Doctor or Patient being inspected
    
    try {
        const userCheck = await pool.query("SELECT role FROM users WHERE id = $1", [id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        
        const role = userCheck.rows[0].role;
        let appointments;
        
        if (role === 'doctor') {
            // If checking a Doctor, show all accepted and rejected appointments
            appointments = await pool.query(
                `SELECT 
                    a.id AS appointment_id,
                    a.status,
                    a.appointment_date,
                    a.created_at,
                    u.name AS patient_name,
                    u.email AS patient_email
                FROM appointments a
                JOIN users u ON a.patient_id = u.id
                WHERE a.doctor_id = $1 AND a.status IN ('accepted', 'rejected')
                ORDER BY a.created_at DESC`,
                [id]
            );
        } else if (role === 'patient') {
            // If checking a Patient, show all appointments they've made
            appointments = await pool.query(
                `SELECT 
                    a.id AS appointment_id,
                    a.status,
                    a.appointment_date,
                    a.created_at,
                    u.name AS doctor_name,
                    u.email AS doctor_email
                FROM appointments a
                JOIN users u ON a.doctor_id = u.id
                WHERE a.patient_id = $1
                ORDER BY a.created_at DESC`,
                [id]
            );
        } else {
            return res.status(400).json({ message: "Invalid user role for inspection." });
        }

        res.json(appointments.rows);
    } catch (error) {
        console.error("Admin user history fetch error:", error);
        res.status(500).json({ message: "Server error fetching user history." });
    }
});


export default router;