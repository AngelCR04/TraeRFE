import { MenuItem } from './MenuItem';
import { Dispatch, SetStateAction } from 'react';

export interface SidebarProps {
  isOpen: boolean;
  onToggle: Dispatch<SetStateAction<boolean>>;
  menuItems: MenuItem[];
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
} 