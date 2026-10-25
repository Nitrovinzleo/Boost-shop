// Moteur de tarification et calculs coaching purs de Severum

export const COACHING_ROLES = [
  { id: 'top', name: 'TOP', label: 'Toplane' },
  { id: 'jungle', name: 'JNG', label: 'Jungle' },
  { id: 'mid', name: 'MID', label: 'Midlane' },
  { id: 'adc', name: 'ADC', label: 'Bot ADC' },
  { id: 'support', name: 'SUP', label: 'Support' },
];

export const TIER_COACH_RATES = {
  Iron: 10,
  Bronze: 12,
  Silver: 15,
  Gold: 18,
  Platinum: 22,
  Emerald: 26,
  Diamond: 32,
  Master: 40,
};

export const calculateCoachingPricing = ({
  currentTier = 'Silver',
  desiredTier = 'Gold',
  gamesReview = 1,
  coachingHours = 1,
  addons = {},
  promoDiscount = 0,
}) => {
  const currentTierRate = TIER_COACH_RATES[currentTier] || 15;
  const desiredTierRate = TIER_COACH_RATES[desiredTier] || 18;

  const rankBase = Math.max(0, desiredTierRate - currentTierRate) + currentTierRate;
  const rawBase = rankBase + (gamesReview * 12) + (coachingHours * 20);

  let multiplier = 1.0;
  if (addons.liveSpectate) multiplier += 0.20;
  if (addons.proCoach) multiplier += 0.15;

  const original = rawBase * multiplier;
  let sale = original * 0.60; // -40%

  if (promoDiscount > 0) {
    sale = sale * (1 - promoDiscount);
  }

  return {
    original: Math.max(0, original),
    sale: Math.max(0, sale),
    rawBase,
  };
};
