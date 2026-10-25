import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({
  options = [],
  value,
  onChange,
  ariaLabel = 'Select option',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          e.preventDefault();
          onChange(options[focusedIndex]);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, options, onChange]);

  useEffect(() => {
    if (isOpen) {
      const idx = options.indexOf(value);
      setFocusedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, options, value]);

  return (
    <div className={`relative w-full text-left ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="custom-select-list"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border flex items-center justify-between font-semibold text-sm transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-[#18101d] border-[#f43f5e] ring-2 ring-[#e11d48]/25 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
            : 'bg-[#120d16]/85 border-[#e11d48]/20 hover:border-[#f43f5e]/40 hover:bg-[#18111d] text-slate-200'
        }`}
      >
        <span>{value}</span>
        <ChevronDown 
          size={16} 
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#f43f5e]' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
            aria-hidden="true" 
          />
          <ul
            ref={listRef}
            id="custom-select-list"
            role="listbox"
            aria-label={ariaLabel}
            className="absolute top-[calc(100%+6px)] left-0 w-full z-50 p-1.5 rounded-xl bg-[#130d17]/95 border border-[#e11d48]/25 shadow-[0_16px_36px_rgba(0,0,0,0.8),0_0_20px_rgba(225,29,72,0.15)] backdrop-blur-xl max-h-56 overflow-y-auto"
          >
            {options.map((option, idx) => {
              const isSelected = option === value;
              const isHighlighted = idx === focusedIndex;

              return (
                <li key={option} role="none">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white shadow-[0_2px_10px_rgba(225,29,72,0.4)]'
                        : isHighlighted
                        ? 'bg-[#e11d48]/15 text-white'
                        : 'text-slate-300 hover:bg-[#e11d48]/10 hover:text-white'
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
