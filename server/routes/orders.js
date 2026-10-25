import express from 'express';
import prisma from '../db.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Generate unique order code (SV-XXXX)
function generateOrderCode() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SV-${num}`;
}

// Get client orders grouped by active and completed
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { clientId: req.user.id },
      include: {
        booster: {
          select: {
            id: true,
            name: true,
            boosterPeakRank: true,
            boosterMainRole: true,
            boosterIsOnline: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const active = orders.filter((o) => ['PENDING_CLAIM', 'IN_PROGRESS', 'PAUSED'].includes(o.status));
    const completed = orders.filter((o) => ['COMPLETED', 'CANCELLED'].includes(o.status));

    res.json({ active, completed });
  } catch (error) {
    console.error('Error fetching my-orders:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

// Create new order
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      boostType = 'division',
      server = 'EUW',
      queue = 'Solo/Duo (5v5)',
      currentTier,
      currentDivision,
      currentLp = 0,
      targetTier,
      targetDivision,
      targetLp = 0,
      flashKey = 'D',
      favoriteRoles,
      favoriteChampions,
      offlineMode = true,
      totalPrice,
      accountLogin,
      accountPassword,
      clientNote,
    } = req.body;

    if (!currentTier || !targetTier || !totalPrice) {
      return res.status(400).json({ error: 'Paramètres de commande manquants' });
    }

    const price = parseFloat(totalPrice);
    const boosterPayout = parseFloat((price * 0.7).toFixed(2));
    const severumFee = parseFloat((price * 0.3).toFixed(2));

    let orderCode = generateOrderCode();
    let exists = await prisma.order.findUnique({ where: { orderCode } });
    while (exists) {
      orderCode = generateOrderCode();
      exists = await prisma.order.findUnique({ where: { orderCode } });
    }

    const order = await prisma.order.create({
      data: {
        orderCode,
        status: 'PENDING_CLAIM',
        clientId: req.user.id,
        boostType,
        server,
        queue,
        currentTier,
        currentDivision,
        currentLp: parseInt(currentLp, 10) || 0,
        targetTier,
        targetDivision,
        targetLp: parseInt(targetLp, 10) || 0,
        liveTier: currentTier,
        liveDivision: currentDivision,
        liveLp: parseInt(currentLp, 10) || 0,
        flashKey,
        favoriteRoles,
        favoriteChampions,
        offlineMode,
        totalPrice: price,
        boosterPayout,
        severumFee,
        accountLogin,
        accountPassword,
        clientNote,
      },
    });

    res.status(201).json({
      message: 'Commande créée avec succès',
      order,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

// Get single order details
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        client: {
          select: { id: true, name: true, discordTag: true, email: true },
        },
        booster: {
          select: {
            id: true,
            name: true,
            boosterPeakRank: true,
            boosterMainRole: true,
            boosterIsOnline: true,
          },
        },
        messages: {
          include: {
            sender: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Commande introuvable' });
    }

    // Access check: only client, booster assigned, or admin
    if (
      req.user.role !== 'ADMIN' &&
      order.clientId !== req.user.id &&
      order.boosterId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Accès non autorisé à cette commande' });
    }

    // Hide account password from client response (even though they know it) and ensure privacy
    if (req.user.role === 'CLIENT') {
      delete order.accountPassword;
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Erreur de récupération' });
  }
});

// Pause / Resume order
router.patch('/:id/toggle-pause', verifyToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Commande non trouvée' });

    if (
      req.user.role !== 'ADMIN' &&
      order.clientId !== req.user.id &&
      order.boosterId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    let newStatus = order.status;
    if (order.status === 'IN_PROGRESS') {
      newStatus = 'PAUSED';
    } else if (order.status === 'PAUSED') {
      newStatus = 'IN_PROGRESS';
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus },
    });

    res.json({ message: `Statut mis à jour : ${newStatus}`, order: updated });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du changement de statut' });
  }
});

export default router;
