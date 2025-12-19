// backend/routes/main.js

import express from "express";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// 1. GET /api/doctors - Search for verified doctors by city and country
router.get("/doctors", protect, async (req, res) => {
    // Only patients can search for doctors
    if (req.user.role !== 'patient') {
        return res.status(403).json({ message: "Access denied. Only patients can seek expert help." });
    }

    const { city, country } = req.query;

    if (!city || !country) {
        return res.status(400).json({ message: "City and country are required for search." });
    }

    try {
        const doctors = await pool.query(
            // Select only necessary public information, ensure role is 'doctor' and verified is TRUE
            "SELECT id, name, city, country FROM users WHERE role = $1 AND is_doctor_verified = $2 AND city ILIKE $3 AND country ILIKE $4",
            ['doctor', true, `%${city}%`, `%${country}%`] // ILIKE allows case-insensitive searching
        );

        res.json(doctors.rows);
    } catch (error) {
        console.error("Doctor search error:", error);
        res.status(500).json({ message: "Server error during doctor search." });
    }
});

// 2. POST /api/appointments - Patient requests an appointment
router.post("/appointments", protect, async (req, res) => {
    // Only patients can create appointments
    if (req.user.role !== 'patient') {
        return res.status(403).json({ message: "Access denied. Only patients can request appointments." });
    }

    const patientId = req.user.id;
    const { doctorId, requestMessage } = req.body;

    if (!doctorId) {
        return res.status(400).json({ message: "Doctor ID is required." });
    }

    try {
        // Verify the recipient is actually a verified doctor
        const doctorCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1 AND role = $2 AND is_doctor_verified = $3",
            [doctorId, 'doctor', true]
        );

        if (doctorCheck.rows.length === 0) {
            return res.status(404).json({ message: "Doctor not found or not verified." });
        }

        // Insert the new appointment request (status defaults to 'pending')
        const newAppointment = await pool.query(
            "INSERT INTO appointments (patient_id, doctor_id, request_message) VALUES ($1, $2, $3) RETURNING *",
            [patientId, doctorId, requestMessage || "No message provided."]
        );

        res.status(201).json({
            message: "Appointment request sent successfully.",
            appointment: newAppointment.rows[0]
        });
    } catch (error) {
        console.error("Appointment request error:", error);
        res.status(500).json({ message: "Server error creating appointment request." });
    }
});

// backend/routes/main.js (APPEND THESE ROUTES)

// Helper function to check for doctor role
const isDoctor = (req, res) => {
    if (req.user.role !== 'doctor') {
        res.status(403).json({ message: "Access denied. Doctor access required." });
        return false;
    }
    return true;
};

// --- DOCTOR PANEL ENDPOINTS ---

// 3. GET /api/doctor/appointments - Doctor fetches pending appointment requests
router.get("/doctor/appointments", protect, async (req, res) => {
    if (!isDoctor(req, res)) return;

    const doctorId = req.user.id;

    try {
        // Fetch appointments that are 'pending', joining with users to get patient name/email
        const appointments = await pool.query(
            `SELECT 
                a.id AS appointment_id,
                a.request_message,
                a.created_at,
                u.id AS patient_id,
                u.name AS patient_name,
                u.email AS patient_email
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.doctor_id = $1 AND a.status = $2
            ORDER BY a.created_at ASC`,
            [doctorId, 'pending']
        );

        res.json(appointments.rows);
    } catch (error) {
        console.error("Doctor appointments fetch error:", error);
        res.status(500).json({ message: "Server error fetching appointments." });
    }
});

// 4. POST /api/doctor/appointment/:id/action - Doctor accepts/rejects/deletes an appointment
router.post("/doctor/appointment/:id/action", protect, async (req, res) => {
    if (!isDoctor(req, res)) return;

    const { id: appointmentId } = req.params;
    const { action, appointmentDate } = req.body; // action: 'accept', 'reject', 'delete'
    const doctorId = req.user.id;

    try {
        if (action === 'delete') {
            // Delete the request entirely
            await pool.query(
                "DELETE FROM appointments WHERE id = $1 AND doctor_id = $2",
                [appointmentId, doctorId]
            );
            return res.json({ message: "Appointment request deleted." });

        } else if (action === 'reject') {
            // Reject the request
            await pool.query(
                "UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND doctor_id = $3",
                ['rejected', appointmentId, doctorId]
            );
            return res.json({ message: "Appointment request rejected." });

        } else if (action === 'accept') {
            if (!appointmentDate) {
                return res.status(400).json({ message: "Appointment date and time are required for acceptance." });
            }
            // Accept the request and set the time/date
            await pool.query(
                "UPDATE appointments SET status = $1, appointment_date = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND doctor_id = $4",
                ['accepted', appointmentDate, appointmentId, doctorId]
            );
            return res.json({ message: "Appointment accepted and scheduled." });

        } else {
            return res.status(400).json({ message: "Invalid action specified." });
        }

    } catch (error) {
        console.error("Appointment action error:", error);
        res.status(500).json({ message: "Server error processing appointment action." });
    }
});

// 5. GET /api/doctor/profile - Doctor fetches their profile/availability
router.get("/doctor/profile", protect, async (req, res) => {
    if (!isDoctor(req, res)) return;

    const doctorId = req.user.id;

    try {
        // Fetch professional profile
        const profileQuery = await pool.query(
            "SELECT * FROM doctor_profiles WHERE user_id = $1",
            [doctorId]
        );
        const profile = profileQuery.rows[0] || {};

        // Fetch availability
        const availabilityQuery = await pool.query(
            "SELECT day_of_week, start_time, end_time FROM doctor_availability WHERE doctor_id = $1 ORDER BY day_of_week",
            [doctorId]
        );
        const availability = availabilityQuery.rows;

        // Fetch basic user info
        const userInfo = req.user; // Contains id, name, email, role, city, country

        res.json({
            user: userInfo,
            profile: {
                ...profile,
                availability,
            },
        });

    } catch (error) {
        console.error("Doctor profile fetch error:", error);
        res.status(500).json({ message: "Server error fetching profile data." });
    }
});


// backend/routes/main.js (APPEND THIS ROUTE)

// 6. GET /api/patient/appointments - Patient fetches their appointments and status
router.get("/patient/appointments", protect, async (req, res) => {
    if (req.user.role !== 'patient') {
        return res.status(403).json({ message: "Access denied. Only patients can view this dashboard." });
    }

    const patientId = req.user.id;

    try {
        // Fetch all appointments for the patient, joining with doctor info
        const appointments = await pool.query(
            `SELECT 
                a.id AS appointment_id,
                a.status,
                a.appointment_date,
                a.request_message,
                d.name AS doctor_name,
                d.email AS doctor_email,
                d.city AS doctor_city
            FROM appointments a
            JOIN users d ON a.doctor_id = d.id
            WHERE a.patient_id = $1
            ORDER BY a.created_at DESC`,
            [patientId]
        );

        res.json(appointments.rows);
    } catch (error) {
        console.error("Patient appointments fetch error:", error);
        res.status(500).json({ message: "Server error fetching patient appointments." });
    }
});

// backend/routes/main.js (APPEND THESE ROUTES)

// 7. POST /api/doctor/profile/update - Doctor updates their profile details
router.post("/doctor/profile/update", protect, async (req, res) => {
    if (!isDoctor(req, res)) return;

    const doctorId = req.user.id;
    const { profession, clinicAddress } = req.body;

    if (!profession || !clinicAddress) {
        return res.status(400).json({ message: "Profession and Clinic Address are required." });
    }

    try {
        // Use an UPSERT (INSERT or UPDATE) logic: if the profile exists, update it; otherwise, insert it.
        const result = await pool.query(
            `INSERT INTO doctor_profiles (user_id, profession, clinic_address) 
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id) DO UPDATE 
             SET profession = $2, clinic_address = $3, updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [doctorId, profession, clinicAddress]
        );

        res.json({ message: "Profile updated successfully.", profile: result.rows[0] });
    } catch (error) {
        console.error("Doctor profile update error:", error);
        res.status(500).json({ message: "Server error updating profile." });
    }
});

// 8. POST /api/doctor/availability/set - Doctor sets their weekly availability
router.post("/doctor/availability/set", protect, async (req, res) => {
    if (!isDoctor(req, res)) return;

    const doctorId = req.user.id;
    const { availability } = req.body; // Expects an array: [{ dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' }, ...]

    if (!Array.isArray(availability)) {
        return res.status(400).json({ message: "Availability must be an array." });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Clear existing availability to prevent duplicates and simplify updates
        await client.query("DELETE FROM doctor_availability WHERE doctor_id = $1", [doctorId]);
        
        // 2. Insert new availability blocks
        const insertPromises = availability.map(item => {
            if (item.dayOfWeek && item.startTime && item.endTime) {
                return client.query(
                    "INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES ($1, $2, $3, $4)",
                    [doctorId, item.dayOfWeek, item.startTime, item.endTime]
                );
            }
        });

        await Promise.all(insertPromises.filter(p => p)); // Run all valid inserts
        
        await client.query('COMMIT');
        res.json({ message: "Availability updated successfully." });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Doctor availability update error:", error);
        res.status(500).json({ message: "Server error setting availability." });
    } finally {
        client.release();
    }
});
export default router;