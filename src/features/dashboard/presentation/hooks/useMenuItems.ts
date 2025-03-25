import { 
  HomeIcon, UsersIcon, InboxIcon, MapIcon, 
  ClockIcon, MapPinIcon, WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon, ChartBarIcon 
} from '@heroicons/react/24/outline';
import { MenuItem } from '../interfaces/MenuItem';

export const useMenuItems = (): MenuItem[] => {
  return [
    //sistema
    { type: 'header', name: 'Sistema' },
    { name: 'Dashboard', icon: HomeIcon, active: true },
    { name: 'Usuarios', icon: UsersIcon },
    { name: 'Solicitudes', icon: InboxIcon, count: 12 },
    
    //personal
    { type: 'header', name: 'Personal' },
    { name: 'Auxiliares', icon: UsersIcon, indent: true },
    { name: 'Conductores', icon: UsersIcon, indent: true },
    
    //transporte
    { type: 'header', name: 'Transporte' },
    { name: 'Rutas', icon: MapIcon, indent: true },
    { name: 'Horarios', icon: ClockIcon, indent: true },
    { name: 'Paradas', icon: MapPinIcon, indent: true },
    
    //autobuses
    { type: 'header', name: 'Autobuses' },
    { name: 'Mantenimientos', icon: WrenchScrewdriverIcon, indent: true },
    { name: 'Registros', icon: ClipboardDocumentListIcon, indent: true },
    
    //reportes
    { type: 'header', name: 'Reportes' },
    { name: 'Rendimiento', icon: ChartBarIcon, indent: true },
    { name: 'Estadísticas', icon: ChartBarIcon, indent: true },
  ];
}; 