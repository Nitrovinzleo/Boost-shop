// Moteur de calcul pour les abonnements Anti-Decay et Maintien d'Elo

export const ANTI_DECAY_PLANS = [
  {
    id: 'master',
    tier: 'Master',
    name: 'Master Retainer',
    monthlyPrice: 39.00,
    frequency: '1 match / jour (banque)',
    targetRanks: 'Master (0 - 500 LP)',
    riotBankRule: 'Riot exige 1 partie par jour de réserve (banque max de 14 jours, 1 match stocke 1 jour).',
    badge: 'Maintien Essentiel',
    features: [
      'Garantie totale contre le decay de LP (-75 LP/jour évités)',
      'VPN appairé à votre zone géographique',
      'Mode hors-ligne gratuit (invisible sur le client)',
      'Préservation de votre MMR compétitif',
      'Rapport hebdomadaire sur Discord',
    ],
  },
  {
    id: 'grandmaster',
    tier: 'Grandmaster',
    name: 'GrandMaster Retainer',
    monthlyPrice: 89.00,
    frequency: 'Maintien régulier & défense de seuil',
    targetRanks: 'GrandMaster (Cutoff ladder)',
    riotBankRule: 'Défense active du seuil de coupure GrandMaster pour sécuriser votre place dans le Top 700.',
    badge: 'Formule Populaire',
    popular: true,
    features: [
      'Entretien quotidien régulier de la banque de 14 jours',
      'Booster GrandMaster / Challenger dédié',
      'Winrate positif garanti (55%+)',
      'Choix de 2 champions de prédilection',
      'Notification Discord avant chaque session',
    ],
  },
  {
    id: 'challenger',
    tier: 'Challenger',
    name: 'Challenger Elite',
    monthlyPrice: 179.00,
    frequency: 'Maintien quotidien Top Ladder',
    targetRanks: 'Challenger (Top 300 EUW)',
    riotBankRule: 'Défense active du cutoff quotidien de LP pour rester dans le sommet absolu du ladder.',
    badge: 'Top 0.1% Protégé',
    features: [
      'Booster Top 50 ladder européen/mondial assigné',
      'Protection active contre la perte du statut Challenger',
      'Maintien de LP élevés (800 LP à 1200+ LP)',
      'Suivi en direct et stream privé Discord inclus',
      'Assistance VIP prioritaire 24/7',
    ],
  },
];

export const calculateAntiDecayPrice = ({
  planId = 'master',
  addons = { duoRetainer: false, specificChampions: false },
}) => {
  const plan = ANTI_DECAY_PLANS.find((p) => p.id === planId) || ANTI_DECAY_PLANS[1];
  let price = plan.monthlyPrice;

  let duoMultiplier = 0;
  if (addons.duoRetainer) {
    duoMultiplier = 0.35; // +35%
  }

  let champMultiplier = 0;
  if (addons.specificChampions) {
    champMultiplier = 0.15; // +15%
  }

  const finalPrice = price * (1 + duoMultiplier + champMultiplier);

  return {
    basePrice: price,
    finalPrice: parseFloat(finalPrice.toFixed(2)),
    plan,
  };
};
