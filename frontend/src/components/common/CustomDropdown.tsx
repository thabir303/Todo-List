import { useEffect, useState, useRef } from 'react';
import { ChevronUpIcon } from '../../assets/icons';

interface CustomDropdownProps {
  value: number;
  options: number[];
  onChange: (value: number) => void;
  label?: string;
  testId?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ 
  value, 
  options, 
  onChange, 
  label = "per page",
  testId = "page-size-select"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg cursor-pointer transition-all text-sm"
        data-testid={testId}
      >
        <span className="font-semibold text-slate-700">{value}</span>
        <span className="text-slate-500">{label}</span>
        <ChevronUpIcon className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-full bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left text-sm transition-all cursor-pointer ${
                value === option 
                  ? 'bg-sky-50 text-sky-700 font-semibold' 
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              {option} items
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
