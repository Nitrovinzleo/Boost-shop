import jwt from 'jsonwebtoken';
import prisma from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'severum-super-secret-jwt-key-2026';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant ou format invalide' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        discordTag: true,
        boosterPeakRank: true,
        boosterMainRole: true,
        boosterBalance: true,
        boosterTotalEarned: true,
        boosterIsApproved: true,
        boosterIsOnline: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expirée ou invalide' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès interdit : privilèges insuffisants' });
    }
    next();
  };
};
