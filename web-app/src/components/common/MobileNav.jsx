import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, FolderUp, Layers, BookMarked } from 'lucide-react';

export default function MobileNav() {
  const items = [
    { to: '/', label: 'Assistant', icon: MessageSquare },
    { to: '/documents', label: 'Docs', icon: FolderUp },
    { to: '/explorer', label: 'Vectors', icon: Layers },
    { to: '/research', label: 'Arxiv', icon: BookMarked },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 flex items-center justify-around z-30 px-2 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
