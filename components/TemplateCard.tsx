
import React from 'react';
import { Template } from '../types';
import { ICONS } from '../constants';

interface TemplateCardProps {
  template: Template;
  onSelect: (prompt: string) => void;
  isActive: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect, isActive }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'notes-budgeting': return ICONS.Notes;
      case 'ecommerce': return ICONS.Shop;
      case 'saas-core': return ICONS.Users;
      default: return ICONS.Database;
    }
  };

  return (
    <button
      onClick={() => onSelect(template.prompt)}
      className={`text-left p-4 rounded-xl border transition-all group ${
        isActive 
          ? 'bg-indigo-500/10 border-indigo-500/50' 
          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors ${
        isActive ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-indigo-400'
      }`}>
        {getIcon(template.id)}
      </div>
      <h3 className={`font-semibold mb-1 ${isActive ? 'text-indigo-300' : 'text-zinc-200'}`}>
        {template.title}
      </h3>
      <p className="text-xs text-zinc-500 leading-snug">
        {template.description}
      </p>
    </button>
  );
};

export default TemplateCard;
