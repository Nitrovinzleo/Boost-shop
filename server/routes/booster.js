import express from 'express';
import prisma from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Middleware: all booster routes require BOOSTER or ADMIN
router.use(verifyToken, requireRole('BOOSTER', 'ADMIN'));

// 1. Available order pool (Marketplace)
router.get('/pool', async (req, res) => {
  try {
    const availableOrders = await prisma.order.findMany({
      where: { status: 'PENDING_CLAIM' },
      select: {
        id: true,
        orderCode: true,
        boostType: true,
        server: true,
        queue: true,
        currentTier: true,
        currentDivision: true,
        targetTier: true,
        targetDivision: true,
        flashKey: true,
        favoriteRoles: true,
        favoriteChampions: true,
        offlineMode: true,
        boosterPayout: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders: availableOrders });
  } catch (error) {
    console.error('Error fetching pool:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes disponibles' });
  }
});

// 2. Claim an available order
router.post('/claim/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    if (order.status !== 'PENDING_CLAIM') {
      return res.status(400).json({ error: 'Cette commande a déjà été prise par un autre booster' });
    }

    // Check if booster is approved
    if (!req.user.boosterIsApproved && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Votre compte booster est en attente d\'approbation par l\'administration' });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        boosterId: req.user.id,
        status: 'IN_PROGRESS',
      },
    });

    // Send automatic kickoff system message
    await prisma.chatMessage.create({
      data: {
        orderId: order.id,
        senderId: req.user.id,
        senderRole: 'BOOSTER',
        content: `Bonjour ! J'ai pris en charge votre commande. Je prépare la session avec VPN ${order.server} et mode hors-ligne.`,
      },
    });

    res.json({ message: 'Commande prise en charge avec succès !', order: updated });
  } catch (error) {
    console.error('Claim error:', error);
    res.status(500).json({ error: 'Erreur lors de la prise de commande' });
  }
});

// 3. Get currently active orders for this booster
router.get('/active', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        boosterId: req.user.id,
        status: { in: ['IN_PROGRESS', 'PAUSED'] },
      },
      include: {
        client: {
          select: { id: true, name: true, discordTag: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de récupération de la commande active' });
  }
});

// 4. Update match progress (wins, losses, live division, live LP)
router.patch('/progress/:id', async (req, res) => {
  try {
    const { winsCount, lossesCount, liveTier, liveDivision, liveLp } = req.body;

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order || (order.boosterId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        winsCount: winsCount !== undefined ? parseInt(winsCount, 10) : order.winsCount,
        lossesCount: lossesCount !== undefined ? parseInt(lossesCount, 10) : order.lossesCount,
        liveTier: liveTier || order.liveTier,
        liveDivision: liveDivision !== undefined ? liveDivision : order.liveDivision,
        liveLp: liveLp !== undefined ? parseInt(liveLp, 10) : order.liveLp,
      },
    });

    res.json({ message: 'Progression mise à jour', order: updated });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Erreur de mise à jour de la progression' });
  }
});

// 5. Complete an order
router.post('/complete/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order || (order.boosterId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    if (order.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Commande déjà terminée' });
    }

    // Transaction: update order to COMPLETED & credit booster balance
    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: order.boosterId },
        data: {
          boosterBalance: { increment: order.boosterPayout },
          boosterTotalEarned: { increment: order.boosterPayout },
        },
      }),
      prisma.chatMessage.create({
        data: {
          orderId: order.id,
          senderId: req.user.id,
          senderRole: 'BOOSTER',
          content: '🎉 Mission accomplie ! Le rang cible a été atteint avec succès. Merci pour votre confiance !',
        },
      }),
    ]);

    res.json({
      message: `Commande validée ! ${order.boosterPayout}€ ont été crédités à votre solde.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Complete order error:', error);
    res.status(500).json({ error: 'Erreur lors de la finalisation' });
  }
});

// 6. Booster Wallet & Payout history
router.get('/wallet', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        boosterBalance: true,
        boosterTotalEarned: true,
        payouts: {
          orderBy: { requestedAt: 'desc' },
        },
        boosterOrders: {
          where: { status: 'COMPLETED' },
          select: {
            id: true,
            orderCode: true,
            boosterPayout: true,
            completedAt: true,
          },
        },
      },
    });

    res.json({ wallet: user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération portefeuille' });
  }
});

// 7. Request Payout
router.post('/payout', async (req, res) => {
  try {
    const { amount, method = 'PAYPAL', destination } = req.body;
    const reqAmount = parseFloat(amount);

    if (!reqAmount || reqAmount <= 0 || !destination) {
      return res.status(400).json({ error: 'Montant et coordonnées requis' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.boosterBalance < reqAmount) {
      return res.status(400).json({ error: 'Solde insuffisant pour ce montant' });
    }

    const payout = await prisma.$transaction([
      prisma.payout.create({
        data: {
          boosterId: user.id,
          amount: reqAmount,
          method,
          destination,
          status: 'PENDING',
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          boosterBalance: { decrement: reqAmount },
        },
      }),
    ]);

    res.status(201).json({
      message: 'Demande de virement envoyée à l\'administration avec succès',
      payout: payout[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la demande de virement' });
  }
});

// 8. Toggle online availability
router.patch('/toggle-online', async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { boosterIsOnline: !req.user.boosterIsOnline },
      select: { id: true, boosterIsOnline: true },
    });

    res.json({ boosterIsOnline: updated.boosterIsOnline });
  } catch (error) {
    res.status(500).json({ error: 'Erreur mise à jour disponibilité' });
  }
});

export default router;
