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
            <span className={`text-[13px] font-bold ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>{value}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function EditableField({ value, isEditing, onChange, className, currentTheme, placeholder, type = "text" }) {
  const isLight = currentTheme === 'light';
  if (isEditing) {
    if (type === "textarea") {
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-transparent border border-blue-500/30 rounded-xl p-3 focus:border-blue-500 focus:outline-none w-full min-h-[100px] ${className}`}
          placeholder={placeholder}
        />
      );
    }
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

import { Plus, X } from "lucide-react";

export function EditableList({ items, isEditing, onChange, currentTheme, placeholder = "Add item..." }) {
  const isLight = currentTheme === 'light';
  
  const handleItemChange = (index, newValue) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  return (
    <div className="flex flex-wrap gap-1.5 items-center">
      {items.map((item, i) => (
        <div key={i} className="relative group flex items-center">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <input
                value={item}
                onChange={(e) => handleItemChange(i, e.target.value)}
                className={`text-[10px] font-bold px-2 py-1 rounded-md border ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-300'} focus:outline-none focus:border-blue-500 w-24`}
              />
              <button 
                onClick={() => removeItem(i)}
                className="p-1 rounded-full hover:bg-red-500/20 text-red-500 transition-colors no-print"
              >
                <X size={10} />
              </button>
            </div>
          ) : (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/50 text-slate-400'}`}>
              {item}
            </span>
          )}
        </div>
      ))}
      {isEditing && (
        <button 
          onClick={addItem}
          className="p-1.5 rounded-md border border-dashed border-slate-700 text-slate-500 hover:text-blue-500 hover:border-blue-500 transition-all flex items-center gap-1 text-[10px] font-bold no-print"
        >
          <Plus size={10} />
          Add
        </button>
      )}
    </div>
  );
}
