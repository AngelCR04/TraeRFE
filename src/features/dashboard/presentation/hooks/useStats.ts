import { 
  InboxIcon, UsersIcon, WrenchScrewdriverIcon, MapIcon 
} from '@heroicons/react/24/outline';

export const useStats = () => {
  return [
    {
      title: 'Solicitudes',
      value: '1,247',
      subtitle: '124 pendientes',
      icon: InboxIcon,
      color: 'blue'
    },
    {
      title: 'Usuarios Registrados',
      value: '1,482',
      subtitle: '45 nuevos este mes',
      icon: UsersIcon,
      color: 'indigo'
    },
    {
      title: 'Autobuses Activos',
      value: '47',
      subtitle: '2 en mantenimiento',
      icon: WrenchScrewdriverIcon,
      color: 'yellow'
    },
    {
      title: 'Rutas Activas',
      value: '23',
      subtitle: '18 en servicio',
      icon: MapIcon,
      color: 'green'
    }
  ];
}; 