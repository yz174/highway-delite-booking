import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse, ErrorWithStatus } from '../types';

const prisma = new PrismaClient();

export const getAllExperiences = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { search } = req.query;

    let experiences;

    if (search && typeof search === 'string') {
      // Filter by name or location
      experiences = await prisma.experience.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          name: true,
          location: true,
          description: true,
          imageUrl: true,
          price: true
        }
      });
    } else {
      experiences = await prisma.experience.findMany({
        select: {
          id: true,
          name: true,
          location: true,
          description: true,
          imageUrl: true,
          price: true
        }
      });
    }

    // Format response with startingPrice
    const formattedExperiences = experiences.map((exp: any) => ({
      id: exp.id,
      name: exp.name,
      location: exp.location,
      description: exp.description,
      imageUrl: exp.imageUrl,
      startingPrice: Number(exp.price)
    }));

    const response: ApiResponse = {
      success: true,
      data: formattedExperiences
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getExperienceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const experience = await prisma.experience.findUnique({
      where: { id },
      include: {
        slots: {
          orderBy: [
            { date: 'asc' },
            { time: 'asc' }
          ]
        }
      }
    });

    if (!experience) {
      const error: ErrorWithStatus = new Error('Experience not found');
      error.status = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // Group slots by date
    const slotsByDate = experience.slots.reduce((acc: Record<string, any[]>, slot: any) => {
      const dateStr = slot.date.toISOString().split('T')[0];
      
      if (!acc[dateStr]) {
        acc[dateStr] = [];
      }

      acc[dateStr].push({
        id: slot.id,
        time: slot.time.toISOString().substring(11, 16), // Extract HH:MM
        availableCount: slot.availableCount,
        totalCapacity: slot.totalCapacity
      });

      return acc;
    }, {} as Record<string, any[]>);

    // Convert to array format
    const availableDates = Object.entries(slotsByDate).map(([date, slots]) => ({
      date,
      slots
    }));

    const response: ApiResponse = {
      success: true,
      data: {
        id: experience.id,
        name: experience.name,
        location: experience.location,
        description: experience.description,
        imageUrl: experience.imageUrl,
        price: Number(experience.price),
        about: experience.about,
        availableDates
      }
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};
