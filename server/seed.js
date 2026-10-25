import bcrypt from 'bcryptjs';
import prisma from './db.js';

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany({});
  await prisma.payout.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('severum1234', salt);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@severum.gg',
      passwordHash,
      name: 'Severum Chief',
      role: 'ADMIN',
      discordTag: 'SeverumAdmin#0001',
    },
  });

  // 2. Create Booster
  const booster = await prisma.user.create({
    data: {
      email: 'booster@severum.gg',
      passwordHash,
      name: 'Aether (Challenger)',
      role: 'BOOSTER',
      discordTag: 'Aether#1337',
      boosterPeakRank: 'Challenger',
      boosterMainRole: 'Jungle',
      boosterBalance: 168.0,
      boosterTotalEarned: 1450.0,
      boosterIsApproved: true,
      boosterIsOnline: true,
    },
  });

  // 3. Create Second Booster (Top)
  const booster2 = await prisma.user.create({
    data: {
      email: 'vanguard@severum.gg',
      passwordHash,
      name: 'Vanguard (Top)',
      role: 'BOOSTER',
      discordTag: 'Vanguard#2026',
      boosterPeakRank: 'Challenger',
      boosterMainRole: 'Top',
      boosterBalance: 84.0,
      boosterTotalEarned: 920.0,
      boosterIsApproved: true,
      boosterIsOnline: true,
    },
  });

  // 4. Create Client
  const client = await prisma.user.create({
    data: {
      email: 'client@severum.gg',
      passwordHash,
      name: 'Maxime L.',
      role: 'CLIENT',
      discordTag: 'Maxime#4452',
    },
  });

  // 5. Orders:
  // Order 1: Active in progress with Booster 1
  const activeOrder = await prisma.order.create({
    data: {
      orderCode: 'SV-8492',
      status: 'IN_PROGRESS',
      clientId: client.id,
      boosterId: booster.id,
      boostType: 'division',
      server: 'EUW',
      queue: 'Solo/Duo (5v5)',
      currentTier: 'Gold',
      currentDivision: 'IV',
      currentLp: 24,
      targetTier: 'Emerald',
      targetDivision: 'IV',
      targetLp: 0,
      liveTier: 'Platinum',
      liveDivision: 'II',
      liveLp: 65,
      winsCount: 7,
      lossesCount: 1,
      flashKey: 'D',
      favoriteRoles: 'Jungle, Mid',
      favoriteChampions: 'Xin Zhao, Viego, Sylas',
      offlineMode: true,
      totalPrice: 85.0,
      boosterPayout: 59.5, // 70%
      severumFee: 25.5,    // 30%
      accountLogin: 'ClientLoLAcc_2026',
      accountPassword: 'SecretPasswordEncrypted!',
    },
  });

  // Order 2: Available in the marketplace pool (PENDING_CLAIM)
  await prisma.order.create({
    data: {
      orderCode: 'SV-9104',
      status: 'PENDING_CLAIM',
      clientId: client.id,
      boostType: 'netwins',
      server: 'EUW',
      queue: 'Solo/Duo (5v5)',
      currentTier: 'Emerald',
      currentDivision: 'II',
      currentLp: 50,
      targetTier: 'Diamond',
      targetDivision: 'IV',
      targetLp: 0,
      liveTier: 'Emerald',
      liveDivision: 'II',
      liveLp: 50,
      winsCount: 0,
      lossesCount: 0,
      flashKey: 'F',
      favoriteRoles: 'Top',
      favoriteChampions: 'Aatrox, Renekton, Camille',
      offlineMode: true,
      totalPrice: 65.0,
      boosterPayout: 45.5,
      severumFee: 19.5,
      accountLogin: 'TopLanerAcc',
      accountPassword: 'PasswordTopLane123!',
    },
  });

  // Order 3: Completed Order for Client's past history
  await prisma.order.create({
    data: {
      orderCode: 'SV-7210',
      status: 'COMPLETED',
      clientId: client.id,
      boosterId: booster.id,
      boostType: 'division',
      server: 'EUW',
      queue: 'Solo/Duo (5v5)',
      currentTier: 'Silver',
      currentDivision: 'I',
      currentLp: 75,
      targetTier: 'Gold',
      targetDivision: 'IV',
      targetLp: 0,
      liveTier: 'Gold',
      liveDivision: 'IV',
      liveLp: 30,
      winsCount: 4,
      lossesCount: 0,
      flashKey: 'D',
      offlineMode: true,
      totalPrice: 29.0,
      boosterPayout: 20.3,
      severumFee: 8.7,
      completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  });

  // 6. Chat messages on active order
  await prisma.chatMessage.create({
    data: {
      orderId: activeOrder.id,
      senderId: booster.id,
      senderRole: 'BOOSTER',
      content: 'Bonjour Maxime ! Je viens de commencer ta commande avec VPN FR et mode hors-ligne actif. Première game lancée.',
    },
  });

  await prisma.chatMessage.create({
    data: {
      orderId: activeOrder.id,
      senderId: client.id,
      senderRole: 'CLIENT',
      content: 'Salut ! Super, merci beaucoup. N\'hésite pas à jouer Xin Zhao jungle en priorité si dispo !',
    },
  });

  await prisma.chatMessage.create({
    data: {
      orderId: activeOrder.id,
      senderId: booster.id,
      senderRole: 'BOOSTER',
      content: 'C\'est noté ! Déjà 2 victoires enchaînées, passage en Platinum II validé. Je continue la session cet après-midi.',
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('Credentials:');
  console.log('Admin:   admin@severum.gg   / severum1234');
  console.log('Booster: booster@severum.gg / severum1234');
  console.log('Client:  client@severum.gg  / severum1234');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
