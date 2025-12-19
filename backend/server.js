// backend/server.js - COMPLETE REWRITE

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import mainRoutes from "./routes/main.js"; // <-- NEW IMPORT
import adminRoutes from "./routes/admin.js"; // New Admin Routes import
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes); // Admin routes
// Main application routes (Doctors, Appointments, etc.) <-- NEW ROUTE REGISTERED
app.use("/api", mainRoutes); 


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});