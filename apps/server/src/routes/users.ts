import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error-handler.js';

const router = Router();
const prisma = global.__prisma || new PrismaClient();

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where = role ? { role: role as any } : {};
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          lastLogin: true
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      status: 'success',
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        _count: {
          select: {
            matchesAsRed: true,
            matchesAsBlue: true,
            organizedTournaments: true
          }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
});

// Update user
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        lastLogin: true
      }
    });

    res.json({
      status: 'success',
      user
    });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.status(204).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };