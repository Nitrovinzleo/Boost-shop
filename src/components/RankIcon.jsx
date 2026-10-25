import ironImg from '../assets/ranks/Season_2023_-_Iron.webp';
import bronzeImg from '../assets/ranks/Season_2023_-_Bronze.webp';
import silverImg from '../assets/ranks/Season_2023_-_Silver.webp';
import goldImg from '../assets/ranks/Season_2023_-_Gold.webp';
import platinumImg from '../assets/ranks/Season_2023_-_Platinum.webp';
import emeraldImg from '../assets/ranks/Season_2023_-_Emerald.webp';
import diamondImg from '../assets/ranks/Season_2023_-_Diamond.webp';
import masterImg from '../assets/ranks/Season_2023_-_Master.webp';
import grandmasterImg from '../assets/ranks/Season_2023_-_Grandmaster.webp';
import challengerImg from '../assets/ranks/Season_2023_-_Challenger.webp';
import unrankedImg from '../assets/ranks/Season_2023_-_Unranked.webp';

const rankImages = {
  iron: ironImg,
  bronze: bronzeImg,
  silver: silverImg,
  gold: goldImg,
  platinum: platinumImg,
  emerald: emeraldImg,
  diamond: diamondImg,
  master: masterImg,
  grandmaster: grandmasterImg,
  challenger: challengerImg,
  unranked: unrankedImg,
};

const rankGlowColors = {
  iron: 'rgba(156, 163, 175, 0.35)',
  bronze: 'rgba(217, 119, 6, 0.4)',
  silver: 'rgba(203, 213, 225, 0.4)',
  gold: 'rgba(251, 191, 36, 0.45)',
  platinum: 'rgba(20, 184, 166, 0.45)',
  emerald: 'rgba(16, 185, 129, 0.45)',
  diamond: 'rgba(6, 182, 212, 0.5)',
  master: 'rgba(168, 85, 247, 0.55)',
  grandmaster: 'rgba(239, 68, 68, 0.55)',
  challenger: 'rgba(56, 189, 248, 0.55)',
  unranked: 'rgba(107, 114, 128, 0.3)',
};

export default function RankIcon({ tier = 'Iron', size = 96, className = '' }) {
  const currentTier = (tier || 'Iron').toLowerCase();
  const imgSrc = rankImages[currentTier] || rankImages.unranked;
  const glow = rankGlowColors[currentTier] || 'rgba(225, 29, 72, 0.35)';

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Halo de lueur d'ambiance */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-60 transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: glow }}
      />

      <img
        src={imgSrc}
        alt={`${tier} Rank`}
        className="w-full h-full object-contain relative z-10 transition-transform duration-300 hover:scale-105"
        style={{ filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.5))' }}
      />
    </div>
  );
}
