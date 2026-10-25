import { GB, FR, ES, IT, PL } from 'country-flag-icons/react/3x2';

const flags = {
  en: GB,
  gb: GB,
  fr: FR,
  es: ES,
  it: IT,
  pl: PL,
};

export default function FlagIcon({ code = 'fr', className = 'w-4 h-3 rounded-xs' }) {
  const FlagComponent = flags[code.toLowerCase()] || FR;
  return (
    <FlagComponent
      className={`inline-block shrink-0 shadow-xs border border-white/20 overflow-hidden ${className}`}
    />
  );
}
