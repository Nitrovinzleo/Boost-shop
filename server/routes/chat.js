import express from 'express';
import prisma from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Middleware: all chat endpoints require auth
router.use(verifyToken);

// 1. Get messages for an order
router.get('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    // Authorization: Client, Assigned Booster, or Admin
    if (
      req.user.role !== 'ADMIN' &&
      order.clientId !== req.user.id &&
      order.boosterId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Accès interdit au chat de cette commande' });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { orderId },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération des messages' });
  }
});

// 2. Send a new message
router.post('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Le contenu du message ne peut pas être vide' });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    if (
      req.user.role !== 'ADMIN' &&
      order.clientId !== req.user.id &&
      order.boosterId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Non autorisé à poster dans ce chat' });
    }

    const message = await prisma.chatMessage.create({
      data: {
        orderId,
        senderId: req.user.id,
        senderRole: req.user.role,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, name: true, role: true },
        },
      },
    });

    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: 'Erreur envoi message' });
  }
});

export default router;
