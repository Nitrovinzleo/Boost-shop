import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { JWT_SECRET, verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user (CLIENT or BOOSTER)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'CLIENT', discordTag, peakRank, mainRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cette adresse email est déjà enregistrée' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name || email.split('@')[0],
        role: ['CLIENT', 'BOOSTER'].includes(role) ? role : 'CLIENT',
        discordTag: discordTag || null,
        boosterPeakRank: role === 'BOOSTER' ? peakRank || 'Master' : null,
        boosterMainRole: role === 'BOOSTER' ? mainRole || 'Mid' : null,
        boosterIsApproved: role === 'BOOSTER' ? false : true, // Boosters must be approved by admin
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        discordTag: true,
        boosterPeakRank: true,
        boosterMainRole: true,
        boosterBalance: true,
      },
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'Compte créé avec succès',
      user,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Veuillez saisir votre email et mot de passe' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        discordTag: user.discordTag,
        boosterPeakRank: user.boosterPeakRank,
        boosterMainRole: user.boosterMainRole,
        boosterBalance: user.boosterBalance,
        boosterIsApproved: user.boosterIsApproved,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

// Current user profile
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
