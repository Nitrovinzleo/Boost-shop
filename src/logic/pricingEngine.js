// Moteur de tarification et calculs mathématiques purs de Severum Boosting

export const TIERS = [
  'Iron',
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Emerald',
  'Diamond',
  'Master',
  'Grandmaster',
  'Challenger',
];
export const DIVISIONS = ['IV', 'III', 'II', 'I'];
export const SERVERS = ['EUW', 'EUNE', 'NA', 'OCE', 'BR', 'TR', 'LAN', 'LAS', 'KR'];
export const QUEUES = ['Solo/Duo (5v5)', 'Flex Queue (5v5)'];

export const isApexTier = (tier) => ['Master', 'Grandmaster', 'Challenger'].includes(tier);

// Valeurs cumulées de base par palier
export const TIER_BASE_VALUES = {
  Iron: 0,
  Bronze: 14.00,
  Silver: 33.70,
  Gold: 57.60,
  Platinum: 94.70,
  Emerald: 152.70,
  Diamond: 235.70,
  Master: 415.70,
  Grandmaster: 680.00,
  Challenger: 1050.00,
};

export const DIVISION_VALUES = {
  'IV': 0,
  'III': 3.50,
  'II': 7.00,
  'I': 10.50,
};

// Barèmes pour parties de placement
export const PLACEMENT_RATES = {
  Iron: 1.50,
  Bronze: 2.00,
  Silver: 2.50,
  Gold: 3.50,
  Platinum: 4.50,
  Emerald: 6.00,
  Diamond: 9.00,
  Master: 14.00,
  Grandmaster: 18.00,
  Challenger: 24.00,
};

// Barèmes pour victoires nettes
export const WIN_RATES = {
  Iron: 2.00,
  Bronze: 2.50,
  Silver: 3.20,
  Gold: 4.50,
  Platinum: 6.00,
  Emerald: 8.50,
  Diamond: 12.00,
  Master: 20.00,
  Grandmaster: 28.00,
  Challenger: 38.00,
};

/**
 * Calcule la valeur financière cumulée d'un rang pour League of Legends
 */
export const getRankValue = (tier, division, lp = 0) => {
  if (tier === 'Master') {
    return TIER_BASE_VALUES.Master + (lp * 0.60);
  }
  if (tier === 'Grandmaster') {
    return TIER_BASE_VALUES.Grandmaster + (lp * 0.85);
  }
  if (tier === 'Challenger') {
    return TIER_BASE_VALUES.Challenger + (lp * 1.20);
  }

  const base = TIER_BASE_VALUES[tier] || 0;
  let divisionOffset = DIVISION_VALUES[division] || 0;

  if (tier === 'Bronze') {
    divisionOffset = [0, 4.5, 9.5, 14.5][DIVISIONS.indexOf(division)] ?? 0;
  } else if (tier === 'Gold') {
    divisionOffset = [0, 8.3, 15.9, 23.9][DIVISIONS.indexOf(division)] ?? 0;
  } else if (tier === 'Platinum') {
    divisionOffset = [0, 11.0, 22.5, 36.0][DIVISIONS.indexOf(division)] ?? 0;
  } else if (tier === 'Emerald') {
    divisionOffset = [0, 18.0, 38.0, 58.0][DIVISIONS.indexOf(division)] ?? 0;
  } else if (tier === 'Diamond') {
    divisionOffset = [0, 23.0, 53.0, 93.0][DIVISIONS.indexOf(division)] ?? 0;
  }

  // Taux LP par division
  let stepRate = 3.50;
  if (tier === 'Bronze') stepRate = 4.80;
  else if (tier === 'Gold') stepRate = 8.00;
  else if (tier === 'Platinum') stepRate = 12.00;
  else if (tier === 'Emerald') stepRate = 19.00;
  else if (tier === 'Diamond') stepRate = 31.00;

  const lpVal = (lp / 100) * stepRate;
  return base + divisionOffset + lpVal;
};

/**
 * Calcule le devis complet (prix original, prix soldé, remises promo)
 */
export const calculateBoostPricing = ({
  boostType,
  currentTier,
  currentDivision,
  currentLp,
  desiredTier,
  desiredDivision,
  desiredLp,
  placementTier,
  placementGames,
  winTier,
  winCount,
  addons = {},
  isDuo = false,
  promoDiscount = 0,
}) => {
  let basePrice = 0;
  let validationError = '';

  if (boostType === 'division') {
    const currentVal = getRankValue(currentTier, currentDivision, currentLp);
    const desiredVal = getRankValue(desiredTier, desiredDivision, desiredLp);
    basePrice = desiredVal - currentVal;

    if (desiredVal <= currentVal) {
      validationError = 'Le rang désiré doit être strictement supérieur au rang actuel.';
      basePrice = 0;
    }
  } else if (boostType === 'placement') {
    basePrice = placementGames * (PLACEMENT_RATES[placementTier] || 3.50);
  } else if (boostType === 'win') {
    basePrice = winCount * (WIN_RATES[winTier] || 4.50);
  }

  if (basePrice <= 0 || validationError) {
    return {
      original: 0,
      sale: 0,
      validationError,
      rawBase: 0,
    };
  }

  // Multiplicateurs options
  let addonMultiplier = 1.0;
  if (addons.specificChampions) addonMultiplier += 0.15;
  if (addons.priorityOrder) addonMultiplier += 0.20;
  if (addons.streamGames) addonMultiplier += 0.15;

  let subtotal = basePrice * addonMultiplier;

  // Multiplicateur Duo Queue
  if (isDuo) {
    subtotal *= 1.40;
  }

  const original = subtotal;
  
  // Solde officielle -40%
  let sale = original * 0.60;

  // Code promo additionnel
  if (promoDiscount > 0) {
    sale = sale * (1 - promoDiscount);
  }

  return {
    original: Math.max(0, original),
    sale: Math.max(0, sale),
    validationError: '',
    rawBase: basePrice,
  };
};
