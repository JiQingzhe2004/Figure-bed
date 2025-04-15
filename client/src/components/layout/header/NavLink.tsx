import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  to: string;
  label: string;
  color: 'blue' | 'purple' | 'green' | 'yellow' | 'red';
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, label, color, onClick }) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'hover:text-blue-600 dark:hover:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'purple': return 'hover:text-purple-600 dark:hover:text-purple-400 bg-purple-50 dark:bg-purple-900/20';
      case 'green': return 'hover:text-green-600 dark:hover:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'yellow': return 'hover:text-yellow-600 dark:hover:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'red': return 'hover:text-red-600 dark:hover:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'hover:text-blue-600 dark:hover:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
    }
  };
  
  return (
    <Link 
      to={to} 
      className="relative px-4 py-2 text-gray-700 dark:text-gray-200 group overflow-hidden rounded-md"
      onClick={onClick}
    >
      <span className="relative z-10">{label}</span>
      <div className={`absolute inset-0 ${getColorClass()} transform translate-y-full group-hover:translate-y-0 transition-transform`}></div>
    </Link>
  );
};

export default NavLink;
