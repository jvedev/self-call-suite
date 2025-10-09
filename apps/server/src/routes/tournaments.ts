import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error-handler.js';

const router = Router();
const prisma = global.__prisma || new PrismaClient();

// Get all tournaments
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const tournaments = await prisma.tournament.findMany({
      include: {
        organizer: {
          select: { id: true, username: true }
        },
        _count: {
          select: { matches: true }
        }
      },
      skip,
      take: Number(limit),
      orderBy: { startDate: 'desc' }
    });

    res.json({
      status: 'success',
      tournaments
    });
  } catch (error) {
    next(error);
  }
});

// Get tournament by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const tournament = await prisma.tournament.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, username: true, email: true }
        },
        matches: {
          include: {
            redFighter: {
              select: { id: true, username: true }
            },
            blueFighter: {
              select: { id: true, username: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!tournament) {
      throw new AppError('Tournament not found', 404);
    }

    res.json({
      status: 'success',
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// Create tournament
router.post('/', async (req, res, next) => {
  try {
    const { 
      name, 
      description, 
      startDate, 
      endDate, 
      location, 
      organizerId 
    } = req.body;

    if (!name || !startDate || !organizerId) {
      throw new AppError('Name, start date, and organizer are required', 400);
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        organizerId
      },
      include: {
        organizer: {
          select: { id: true, username: true }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// Update tournament
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      startDate, 
      endDate, 
      location 
    } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (location !== undefined) updateData.location = location;

    const tournament = await prisma.tournament.update({
      where: { id },
      data: updateData,
      include: {
        organizer: {
          select: { id: true, username: true }
        },
        _count: {
          select: { matches: true }
        }
      }
    });

    res.json({
      status: 'success',
      tournament
    });
  } catch (error) {
    next(error);
  }
});

// Delete tournament
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if tournament has matches
    const matchCount = await prisma.match.count({
      where: { tournamentId: id }
    });

    if (matchCount > 0) {
      throw new AppError('Cannot delete tournament with existing matches', 400);
    }

    await prisma.tournament.delete({
      where: { id }
    });

    res.status(204).json({
      status: 'success',
      message: 'Tournament deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export { router as tournamentRoutes };