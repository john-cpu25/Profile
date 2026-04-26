"use client";

import { motion } from "framer-motion";

export function Section({ icon: Icon, title, children, isEditing, large }) {
  return (
    <div className={`glass-dark rounded-3xl overflow-hidden border transition-all duration-500 ${large ? 'p-8' : 'p-6'} border-slate-800/50`}>
      <h3 className="text-lg font-black mb-6 flex items-center gap-4 tracking-tighter uppercase">
        <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 shadow-sm">
          <Icon size={18} className="text-blue-500" />
        </div>
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ContactLine({ icon: Icon, value, isEditing, onChange, label, currentTheme }) {
  const isLight = currentTheme === 'light';
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/30 border-slate-700/50'}`}>
        <Icon size={14} className={isLight ? 'text-slate-600' : 'text-slate-400'} />
      </div>
      <div className="flex-1">
        {isEditing ? (
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className={`border rounded-lg px-2 py-0.5 text-xs w-full ${isLight ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-950 border-slate-800 text-slate-300'}`} 
          />
        ) : (
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter leading-tight">{label}</span>
            <span className={`text-[11px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>{value}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function EditableField({ value, isEditing, onChange, className, currentTheme, placeholder }) {
  const isLight = currentTheme === 'light';
  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-transparent border-b border-blue-500/30 focus:border-blue-500 focus:outline-none ${className}`}
        placeholder={placeholder}
      />
    );
  }
  return <span className={className}>{value}</span>;
}

export function EditableList({ items, isEditing, onChange, currentTheme }) {
  const isLight = currentTheme === 'light';
  
  const handleItemChange = (index, newValue) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="relative group">
          {isEditing ? (
            <input
              value={item}
              onChange={(e) => handleItemChange(i, e.target.value)}
              className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'} focus:outline-none focus:border-blue-500`}
            />
          ) : (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/50 text-slate-400'}`}>
              {item}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
