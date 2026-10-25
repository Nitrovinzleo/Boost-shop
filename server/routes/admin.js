import express from 'express';
import prisma from '../db.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Middleware: all routes require ADMIN role
router.use(verifyToken, requireRole('ADMIN'));

// 1. Global KPIs & Metrics
router.get('/metrics', async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    const users = await prisma.user.findMany();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const platformProfit = orders.reduce((sum, o) => sum + (o.severumFee || 0), 0);
    const boosterPayoutsTotal = orders
      .filter((o) => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + (o.boosterPayout || 0), 0);

    const activeOrdersCount = orders.filter((o) =>
      ['PENDING_CLAIM', 'IN_PROGRESS', 'PAUSED'].includes(o.status)
    ).length;

    const completedOrdersCount = orders.filter((o) => o.status === 'COMPLETED').length;

    const totalBoosters = users.filter((u) => u.role === 'BOOSTER').length;
    const onlineBoosters = users.filter((u) => u.role === 'BOOSTER' && u.boosterIsOnline).length;
    const totalClients = users.filter((u) => u.role === 'CLIENT').length;

    const pendingPayouts = await prisma.payout.findMany({
      where: { status: 'PENDING' },
      include: {
        booster: { select: { id: true, name: true, email: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });

    res.json({
      metrics: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        platformProfit: parseFloat(platformProfit.toFixed(2)),
        boosterPayoutsTotal: parseFloat(boosterPayoutsTotal.toFixed(2)),
        activeOrdersCount,
        completedOrdersCount,
        totalOrdersCount: orders.length,
        totalBoosters,
        onlineBoosters,
        totalClients,
        pendingPayoutsCount: pendingPayouts.length,
      },
      pendingPayouts,
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des métriques' });
  }
});

// 2. All orders with full relations
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        client: { select: { id: true, name: true, email: true, discordTag: true } },
        booster: { select: { id: true, name: true, email: true, discordTag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de récupération des commandes' });
  }
});

// 3. All platform users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
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
        createdAt: true,
        _count: {
          select: {
            clientOrders: true,
            boosterOrders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Erreur de récupération des utilisateurs' });
  }
});

// 4. Approve / Disapprove booster
router.patch('/users/:id/approve-booster', async (req, res) => {
  try {
    const { approved = true } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { boosterIsApproved: approved },
    });

    res.json({ message: `Statut booster mis à jour (${approved ? 'Approuvé' : 'Révoqué'})`, user });
  } catch (error) {
    res.status(500).json({ error: 'Erreur mise à jour statut' });
  }
});

// 5. Reassign or cancel order
router.patch('/orders/:id/reassign', async (req, res) => {
  try {
    const { boosterId, status } = req.body;

    const data = {};
    if (boosterId !== undefined) {
      data.boosterId = boosterId || null;
      if (!boosterId) {
        data.status = status || 'PENDING_CLAIM';
      } else {
        data.status = status || 'IN_PROGRESS';
      }
    } else if (status) {
      data.status = status;
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ message: 'Commande réassignée avec succès', order: updated });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la réassignation' });
  }
});

// 6. Process Payout (Approve or Reject)
router.post('/payouts/:id/process', async (req, res) => {
  try {
    const { action } = req.body; // 'APPROVE' or 'REJECT'

    const payout = await prisma.payout.findUnique({ where: { id: req.params.id } });
    if (!payout) return res.status(404).json({ error: 'Demande introuvable' });

    if (action === 'APPROVE') {
      const updated = await prisma.payout.update({
        where: { id: payout.id },
        data: { status: 'APPROVED', processedAt: new Date() },
      });
      return res.json({ message: 'Virement marqué comme payé !', payout: updated });
    }

    if (action === 'REJECT') {
      // Refund balance back to booster
      const [updated] = await prisma.$transaction([
        prisma.payout.update({
          where: { id: payout.id },
          data: { status: 'REJECTED', processedAt: new Date() },
        }),
        prisma.user.update({
          where: { id: payout.boosterId },
          data: { boosterBalance: { increment: payout.amount } },
        }),
      ]);
      return res.json({ message: 'Virement rejeté, montant recrédité au booster.', payout: updated });
    }

    res.status(400).json({ error: 'Action non reconnue' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur traitement virement' });
  }
});

// 7. Get full dispute package for PayPal / Stripe with legal text
router.get('/orders/:id/dispute-package', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        client: { select: { id: true, name: true, email: true, discordTag: true, createdAt: true } },
        booster: { select: { id: true, name: true, email: true, discordTag: true } },
        messages: {
          select: { id: true, senderRole: true, content: true, createdAt: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!order) return res.status(404).json({ error: 'Commande introuvable' });

    const paypalLegalDefense = `
DOSSIER DE CONTESTATION LITIGE PAYPAL - BIEN NUMÉRIQUE LIVRÉ
Référence Commande Severum : ${order.orderCode}
Montant : ${order.totalPrice.toFixed(2)} EUR
Date de commande : ${new Date(order.createdAt).toISOString()}
Client : ${order.client?.name} (${order.client?.email})
IP Client enregistrée : ${order.clientIp || '127.0.0.1'}
Moyen de paiement : ${order.paymentMethod || 'PAYPAL_DIGITAL'}

1. RENONCIATION LÉGALE AU DROIT DE RÉTRACTATION (Art. L. 221-28 1° & 13°) :
Le client a expressément renoncé à son droit de rétractation lors de la validation du paiement le ${order.waiverAcceptedAt ? new Date(order.waiverAcceptedAt).toISOString() : new Date(order.createdAt).toISOString()} :
"J'accepte que la prestation commence immédiatement et je renonce expressément à mon droit de rétractation de 14 jours (Article L. 221-28 du Code de la consommation)."

2. PREUVE DE LIVRAISON DU BIEN NUMÉRIQUE :
- Service commandé : Boosting League of Legends (${order.queue})
- Palier de départ : ${order.currentTier} ${order.currentDivision || ''}
- Palier cible livré : ${order.targetTier} ${order.targetDivision || ''}
- Palier final atteint sur le compte : ${order.liveTier} ${order.liveDivision || ''} (${order.winsCount} victoires enregistrées)
- Date d'achèvement de la prestation : ${order.completedAt ? new Date(order.completedAt).toISOString() : 'En cours / Livré'}
${order.proofScreenshot ? `- Preuve de partie / Capture d'écran certifiée : ${order.proofScreenshot}` : ''}

3. PREUVE D'ENGAGEMENT DIRECT ET MESSAGERIE :
Le client a directement interagi avec le prestataire via notre messagerie chiffrée (${order.messages.length} messages échangés).
La prestation de service immatériel a été intégralement honorée et personnalisée. Toute contestation pour "objet non reçu" ou "non autorisé" est infondée et frauduleuse.
`.trim();

    res.json({ order, paypalLegalDefense });
  } catch (error) {
    console.error('Dispute package error:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du dossier litige' });
  }
});

export default router;
