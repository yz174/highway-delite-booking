import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, ErrorWithStatus } from '../types';

const prisma = new PrismaClient();

// Generate unique booking reference ID
const generateReferenceId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      experienceId,
      slotId,
      date,
      time,
      quantity,
      customerName,
      customerEmail,
      promoCode,
      agreedToTerms,
      basePrice,
      discountAmount = 0,
      taxAmount,
      totalAmount
    } = req.body;

    // Validate required fields
    if (!experienceId || !slotId || !date || !time || !quantity || !customerName || !customerEmail || !agreedToTerms) {
      const error: ErrorWithStatus = new Error('Missing required fields');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';
      error.details = {
        required: ['experienceId', 'slotId', 'date', 'time', 'quantity', 'customerName', 'customerEmail', 'agreedToTerms']
      };
      throw error;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      const error: ErrorWithStatus = new Error('Invalid email format');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // Validate quantity
    if (quantity < 1) {
      const error: ErrorWithStatus = new Error('Quantity must be at least 1');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // Use transaction to ensure atomicity
    const booking = await prisma.$transaction(async (tx: any) => {
      // Check slot availability
      const slot = await tx.slot.findUnique({
        where: { id: slotId }
      });

      if (!slot) {
        const error: ErrorWithStatus = new Error('Slot not found');
        error.status = 404;
        error.code = 'NOT_FOUND';
        throw error;
      }

      if (slot.availableCount < quantity) {
        const error: ErrorWithStatus = new Error('The selected time slot is no longer available');
        error.status = 400;
        error.code = 'SLOT_UNAVAILABLE';
        error.details = {
          requested: quantity,
          available: slot.availableCount
        };
        throw error;
      }

      // Decrement slot availability
      await tx.slot.update({
        where: { id: slotId },
        data: {
          availableCount: {
            decrement: quantity
          }
        }
      });

      // Generate unique reference ID
      let referenceId = generateReferenceId();
      let isUnique = false;
      
      while (!isUnique) {
        const existing = await tx.booking.findUnique({
          where: { referenceId }
        });
        if (!existing) {
          isUnique = true;
        } else {
          referenceId = generateReferenceId();
        }
      }

      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          referenceId,
          experienceId,
          slotId,
          customerName,
          customerEmail,
          quantity,
          basePrice: basePrice || 0,
          discountAmount: discountAmount || 0,
          taxAmount: taxAmount || 0,
          totalAmount: totalAmount || 0,
          promoCode: promoCode || null,
          status: 'confirmed'
        }
      });

      return newBooking;
    });

    const response: ApiResponse = {
      success: true,
      data: {
        bookingId: booking.id,
        referenceId: booking.referenceId,
        status: booking.status
      }
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};
