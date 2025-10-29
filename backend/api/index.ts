import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import experiencesRoutes from '../src/routes/experiences.routes';
import bookingsRoutes from '../src/routes/bookings.routes';
import promoRoutes from '../src/routes/promo.routes';
import { errorHandler, notFoundHandler } from '../src/middleware/errorHandler';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : '*',
  credentials: true
}));
app.use(express.json());

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api/experiences', experiencesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/promo', promoRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
