import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  ArrowRightOnRectangleIcon,
  UserCircleIcon, 
  KeyIcon, 
  HomeIcon, 
  UsersIcon, 
  InboxIcon, 
  MapIcon, 
  ClockIcon, 
  MapPinIcon, 
  WrenchScrewdriverIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  BellIcon, 
  Bars3Icon,
  ChartPieIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { Menu, Transition } from '@headlessui/react';
import ChangePasswordModal from '../../features/dashboard/presentation/components/ChangePasswordModal';
import UserInfoModal from '../../features/dashboard/presentation/components/UserInfoModal';


interface MenuItem {
  type?: 'header';
  name: string;
  icon?: React.ElementType;
  path?: string;
  indent?: boolean;
}

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ nombreCompleto: '', email: '', rol: '', estado: '', telefono: '', fechaCreacion: '' });
  const [allowedModules, setAllowedModules] = useState<string[]>([]);
  const [currentModule, setCurrentModule] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const location = useLocation();

  // const openPasswordModal = () => {
  //   setIsPasswordModalOpen(true);
  // };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const openUserInfoModal = () => {
    setIsUserInfoModalOpen(true);
  };

  const closeUserInfoModal = () => {
    setIsUserInfoModalOpen(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/Usuarios/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserInfo({
          nombreCompleto: response.data.nombreCompleto,
          email: response.data.correo,
          rol: response.data.rol,
          estado: response.data.estado,
          telefono: response.data.telefono,
          fechaCreacion: response.data.fechaCreacion
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchPermissions = async () => {
      const allowed: string[] = [];
      for (const module of menuItems) {
        if (module.type !== 'header') {
          try {
            const response = await axios.get(`https://localhost:7251/api/Modulos/modulo/${module.name}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (response.data.message && response.data.message.includes('Acceso permitido')) {
              allowed.push(module.name);
            }
          } catch (error) {
            console.error(`Error fetching permissions for module ${module.name}:`, error);
          }
        }
      }
      setAllowedModules(allowed);
    };

    fetchUser();
    fetchPermissions();
  }, []);

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop();
    const currentMenuItem = menuItems.find(item => item.path?.includes(currentPath || ''));
    if (currentMenuItem) {
      setCurrentModule(currentMenuItem.name);
    }
  }, [location]);

  const menuItems: MenuItem[] = [
    { type: 'header', name: 'Sistema' },
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard', indent: true },
    { name: 'Usuarios', icon: UsersIcon, path: '/usuarios', indent: true },
    { name: 'Roles', icon: KeyIcon, path: '/roles', indent: true },
    { name: 'Solicitudes', icon: InboxIcon, path: '/solicitudes', indent: true },
    { name: 'Actividad', icon: ClipboardDocumentListIcon, path: '/activity', indent: true },
    { type: 'header', name: 'Transporte' },
    { name: 'Personal', icon: UsersIcon, path: '/personal', indent: true },
    { name: 'Rutas', icon: MapIcon, path: '/rutas', indent: true },
    { name: 'Horarios', icon: ClockIcon, path: '/horarios', indent: true },
    { name: 'Paradas', icon: MapPinIcon, path: '/paradas', indent: true },
    { type: 'header', name: 'Autobuses' },
    { name: 'Mantenimientos', icon: WrenchScrewdriverIcon, path: '/mantenimientos', indent: true },
    { name: 'Registros', icon: ClipboardDocumentListIcon, path: '/registros', indent: true },
    { type: 'header', name: 'Reportes' },
    { name: 'Rendimiento', icon: ChartBarIcon, path: '/rendimiento', indent: true },
    { name: 'Estadísticas', icon: ChartPieIcon, path: '/estadisticas', indent: true },
  ];

  // Filtrar los menuItems para eliminar headers sin módulos accesibles
  const filteredMenuItems = menuItems.filter((item, index, array) => {
    if (item.type === 'header') {
      const nextItems = array.slice(index + 1);
      const hasAccessibleModules = nextItems.some(nextItem => nextItem.type !== 'header' && allowedModules.includes(nextItem.name));
      return hasAccessibleModules;
    }
    return allowedModules.includes(item.name);
  });

  function UserAvatar({ name }: { name: string }) {
    const initials = name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 border-2 border-gray-200 flex items-center justify-center text-sm font-semibold">
        {initials}
      </div>
    );
  }

  function UserMenu() {
    return (
      <Menu as="div" className="relative z-50">
        <Menu.Button className="flex items-center space-x-2 hover:opacity-80">
          <UserAvatar name={userInfo.nombreCompleto} />
          <span className="text-sm font-medium text-white">{userInfo.nombreCompleto}</span>
        </Menu.Button>

        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={openUserInfoModal}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex items-center px-4 py-2 text-sm text-gray-700 w-full text-left`}
                  >
                    <UserCircleIcon className="w-4 h-4 mr-2" />
                    Mi Perfil
                  </button>
                )}
              </Menu.Item>
              
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="/login"
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed bg-white border-r transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} h-full`}>
        <div className="flex items-center justify-between p-3 sm:p-4 mt-6 sm:mt-8">
          <span className={`text-xl sm:text-2xl font-semibold text-black ${!sidebarOpen && 'hidden'} font-serif`}></span>
          {/* <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-gray-100">
              <span className="text-gray-500">
                {sidebarOpen ? (
                  <ArrowLeftIcon className="w-8 h-8" />
                ) : (
                  <ArrowRightIcon className="w-8 h-8" />
                )}
              </span>
          </button> */}
        </div>
        <nav className="mt-2 sm:mt-4 overflow-y-auto h-[calc(100vh-150px)]">
          {filteredMenuItems.map((item, index) => {
            if (item.type === 'header') {
              return (
                <div key={`header-${index}`} className={`mt-4 sm:mt-6 mb-1 sm:mb-2 px-4 py-1 sm:py-2 text-xs font-semibold text-gray-400 uppercase ${!sidebarOpen && 'hidden'}`}>
                  {item.name}
                </div>
              );
            }
            return (
              allowedModules.includes(item.name) && (
                <Link 
                  key={item.name} 
                  to={item.path || '#'}
                  className={`flex items-center px-6 py-2 text-gray-700 hover:bg-gray-100 ${item.indent && sidebarOpen ? 'pl-8' : ''} ${location.pathname === item.path ? 'bg-gray-200 font-semibold' : ''}`}
                >
                  {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                  <span className={`${!sidebarOpen && 'hidden'}`}>{item.name}</span>
                </Link>
              )
            );
          })}
        </nav>
  
        {/* Notificaciones y Modo Oscuro */}
        <div className={`absolute bottom-0 ${sidebarOpen ? 'w-64' : 'w-20'} p-3 sm:p-4 border-t transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BellIcon className="w-5 h-5 text-gray-500" />
              <span className={`ml-2 text-sm text-gray-600 ${!sidebarOpen && 'hidden'}`}>
                Notificaciones
              </span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-10 h-5 rounded-full bg-gray-200 flex items-center ${
                darkMode ? 'justify-end bg-custom-blue' : 'justify-start'
              } ${!sidebarOpen && 'hidden'}`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform"></div>
            </button>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className={`flex-1 relative p-4 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <header className="bg-custom-blue z-10 w-full fixed top-0 left-0 right-0">
          <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">{currentModule}</span>
              <button 
                onClick={() => setSidebarOpen(true)}
                className="text-white lg:hidden"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-custom-blue w-full bg-neutral-100 text-gray-600 placeholder-gray-500"
                />
                <MagnifyingGlassIcon className="absolute top-3 right-3 w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white/70 hover:text-white">
                <BellIcon className="w-6 h-6" />
              </button>
              {/* User Menu */}
              <UserMenu />
            </div>
          </div>
        </header>
        <div className="flex-1 pt-16 sm:pt-20">
          <Outlet /> 
        </div>
      </div>
      <ChangePasswordModal isOpen={isPasswordModalOpen} onRequestClose={closePasswordModal} />
      <UserInfoModal isOpen={isUserInfoModalOpen} onRequestClose={closeUserInfoModal} userInfo={userInfo} />
    </div>
  );
};

export default MainLayout;