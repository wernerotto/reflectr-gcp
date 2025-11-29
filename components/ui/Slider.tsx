import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  lowLabel?: string;
  highLabel?: string;
  colorClass?: string;
}

export const Slider: React.FC<SliderProps> = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 10, 
  step = 1,
  lowLabel = "Low",
  highLabel = "High",
  colorClass = "accent-neon"
}) => {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <span className="text-neon font-bold text-lg">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer ${colorClass}`}
        style={{
          accentColor: '#32FFF6' // Native fallback
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};
