import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import experiencesRoutes from "../src/routes/experiences.routes";
import bookingsRoutes from "../src/routes/bookings.routes";
import promoRoutes from "../src/routes/promo.routes";
import { errorHandler, notFoundHandler } from "../src/middleware/errorHandler";

dotenv.config();

const app = express();

// CORS Middleware - must be first
app.use((req, res, next) => {
  const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",")
    : ["*"];

  const origin = req.headers.origin;

  if (
    allowedOrigins.includes("*") ||
    (origin && allowedOrigins.includes(origin))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",")
      : "*",
    credentials: true,
  })
);
app.use(express.json());

// Serve static files from public directory
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Highway Delite API",
    endpoints: {
      health: "/health",
      experiences: "/api/experiences",
      bookings: "/api/bookings",
      promo: "/api/promo",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// API Routes
app.use("/api/experiences", experiencesRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/promo", promoRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
