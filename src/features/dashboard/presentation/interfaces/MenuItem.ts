import { IconType } from "../types/IconType";

export interface MenuItem {
  type?: 'header' | 'divider';
  name: string;
  icon?: IconType;
  active?: boolean;
  indent?: boolean;
  count?: number;
  path?: string;
} 