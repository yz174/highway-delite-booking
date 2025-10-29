import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, ErrorWithStatus } from '../types';

const prisma = new PrismaClient();

export const validatePromoCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      const error: ErrorWithStatus = new Error('Promo code is required');
      error.status = 400;
      error.code = 'VALIDATION_ERROR';
      throw error;
    }

    // Find promo code in database
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promoCode) {
      const error: ErrorWithStatus = new Error('Invalid promo code');
      error.status = 400;
      error.code = 'INVALID_PROMO_CODE';
      throw error;
    }

    // Check if promo code is active
    if (!promoCode.isActive) {
      const error: ErrorWithStatus = new Error('Promo code is no longer active');
      error.status = 400;
      error.code = 'INVALID_PROMO_CODE';
      throw error;
    }

    // Check if promo code is within valid date range
    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      const error: ErrorWithStatus = new Error('Promo code has expired or is not yet valid');
      error.status = 400;
      error.code = 'INVALID_PROMO_CODE';
      throw error;
    }

    // Calculate discount amount
    let discountAmount = 0;
    const discountValue = Number(promoCode.discountValue);

    if (promoCode.discountType === 'percentage') {
      discountAmount = (subtotal * discountValue) / 100;
    } else if (promoCode.discountType === 'flat') {
      discountAmount = discountValue;
    }

    const response: ApiResponse = {
      success: true,
      data: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: discountValue,
        discountAmount: discountAmount
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
