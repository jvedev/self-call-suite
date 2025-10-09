import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error-handler.js';
import type { MatchSettings } from '@shared/modules/settings';

const router = Router();
const prisma = global.__prisma || new PrismaClient();

// Get all matches
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, tournamentId } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (status) where.status = status;
    if (tournamentId) where.tournamentId = tournamentId;
    
    const matches = await prisma.match.findMany({
      where,
      include: {
        redFighter: {
          select: { id: true, username: true }
        },
        blueFighter: {
          select: { id: true, username: true }
        },
        tournament: {
          select: { id: true, name: true }
        },
        _count: {
          select: { events: true, warnings: true }
        }
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      matches
    });
  } catch (error) {
    next(error);
  }
});

// Get match by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        redFighter: {
          select: { id: true, username: true }
        },
        blueFighter: {
          select: { id: true, username: true }
        },
        tournament: {
          select: { id: true, name: true }
        },
        events: {
          orderBy: { timestamp: 'asc' }
        },
        warnings: {
          orderBy: { timestamp: 'asc' }
        }
      }
    });

    if (!match) {
      throw new AppError('Match not found', 404);
    }

    res.json({
      status: 'success',
      match
    });
  } catch (error) {
    next(error);
  }
});

// Create match
router.post('/', async (req, res, next) => {
  try {
    const { 
      redFighterId, 
      blueFighterId, 
      tournamentId, 
      settings 
    } = req.body;

    if (!redFighterId || !blueFighterId) {
      throw new AppError('Both fighters are required', 400);
    }

    if (redFighterId === blueFighterId) {
      throw new AppError('Fighters must be different', 400);
    }

    const match = await prisma.match.create({
      data: {
        redFighterId,
        blueFighterId,
        tournamentId,
        settings: settings || {}
      },
      include: {
        redFighter: {
          select: { id: true, username: true }
        },
        blueFighter: {
          select: { id: true, username: true }
        },
        tournament: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({
      status: 'success',
      match
    });
  } catch (error) {
    next(error);
  }
});

// Update match
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { redScore, blueScore, status, settings } = req.body;

    const updateData: any = {};
    if (redScore !== undefined) updateData.redScore = redScore;
    if (blueScore !== undefined) updateData.blueScore = blueScore;
    if (status) updateData.status = status;
    if (settings) updateData.settings = settings;

    // Handle status changes
    if (status === 'RUNNING' && !updateData.startedAt) {
      updateData.startedAt = new Date();
    } else if (status === 'FINISHED' && !updateData.finishedAt) {
      updateData.finishedAt = new Date();
    }

    const match = await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        redFighter: {
          select: { id: true, username: true }
        },
        blueFighter: {
          select: { id: true, username: true }
        }
      }
    });

    res.json({
      status: 'success',
      match
    });
  } catch (error) {
    next(error);
  }
});

// Add match event
router.post('/:id/events', async (req, res, next) => {
  try {
    const { id: matchId } = req.params;
    const { type, timestamp, fighter, points, data } = req.body;

    if (!type || timestamp === undefined) {
      throw new AppError('Event type and timestamp are required', 400);
    }

    const event = await prisma.matchEvent.create({
      data: {
        matchId,
        type,
        timestamp,
        fighter,
        points,
        data
      }
    });

    res.status(201).json({
      status: 'success',
      event
    });
  } catch (error) {
    next(error);
  }
});

// Add warning
router.post('/:id/warnings', async (req, res, next) => {
  try {
    const { id: matchId } = req.params;
    const { fighter, warning, timestamp } = req.body;

    if (!fighter || !warning || timestamp === undefined) {
      throw new AppError('Fighter, warning, and timestamp are required', 400);
    }

    const warningRecord = await prisma.warning.create({
      data: {
        matchId,
        fighter,
        warning,
        timestamp
      }
    });

    res.status(201).json({
      status: 'success',
      warning: warningRecord
    });
  } catch (error) {
    next(error);
  }
});

export { router as matchRoutes };