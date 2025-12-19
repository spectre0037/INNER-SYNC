// backend/routes/auth.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

router.post("/register", async (req, res) => {
    // Extract new fields: role, city, country
    const { name, email, password, role, city, country } = req.body;
    const userRole = role === 'doctor' ? 'doctor' : 'patient'; // Default safety

    try {
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Please provide all required fields" });
        }

        // 1. Check for existing user
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Validate Doctor fields
        if (userRole === 'doctor' && (!city || !country)) {
            return res.status(400).json({ message: "Doctors must provide city and country." });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 4. Conditional insertion
        let newUser;
        if (userRole === 'doctor') {
            // Note: is_doctor_verified defaults to FALSE in DB, which is correct for new signups.
            newUser = await pool.query(
                "INSERT INTO users (name, email, password, role, city, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role, city, country, is_doctor_verified",
                [name, email, hashedPassword, userRole, city, country]
            );
        } else {
            newUser = await pool.query(
                "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
                [name, email, hashedPassword, userRole]
            );
        }

        // 5. Generate token and set cookie
        const userData = newUser.rows[0];
        const token = generateToken(userData.id);

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({ user: userData });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ message: "Server error during registration." });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Please provide all required fields" });
        }

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const userData = user.rows[0];

        const isMatch = await bcrypt.compare(password, userData.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(userData.id);

        res.cookie("token", token, cookieOptions);

        // Return all necessary user data, including role and location details
        res.json({
            user: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role, // <-- ADDED
                city: userData.city, // <-- ADDED
                country: userData.country, // <-- ADDED
                is_doctor_verified: userData.is_doctor_verified, // <-- ADDED
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error during login." });
    }
});

// Me (Fetch currently logged-in user details)
router.get("/me", protect, async (req, res) => {
    try {
        // Fetch the full user details including new fields (role, location, verification)
        const fullUser = await pool.query(
            "SELECT id, name, email, role, city, country, is_doctor_verified FROM users WHERE id = $1",
            [req.user.id]
        );

        if (fullUser.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(fullUser.rows[0]);
    } catch (error) {
        console.error("Fetch user error:", error);
        res.status(500).json({ message: "Server error fetching user data." });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
    res.json({ message: "Logged out successfully" });
});

export default router;