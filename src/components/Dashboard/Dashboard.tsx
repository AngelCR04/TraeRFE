import { useState, useEffect, useCallback } from 'react';
import { 
  InboxIcon, 
  UsersIcon, 
  MapIcon, 
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import FleetStatus from './FleetStatus';
import TransportStatistics from './TransportStatistics';

interface Autobus {
  estado: string;
  ruta: string | null;
}

interface Personal {
  tipoPersonal: string;
  ruta: string | null;
}

interface Parada {
  latitud: number;
  longitud: number;
  descripcion: string;
}

interface User {
  nombreCompleto: string;
  correo: string;
  rol: string;
  estado: string;
}

interface ApiError {
  response?: {
    data: any;
    status: number;
    headers: any;
  };
  request?: any;
  message?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 18.4655, // Latitud central
  lng: -69.3166, // Longitud central
};

type StatKey = 'usuarios' | 'rutas' | 'autobuses' | 'solicitudes' | 'solicitudesPendientes' | 'autobusesOperacion' | 'autobusesMantenimiento' | 'conductoresDisponibles' | 'conductoresNoDisponibles' | 'paradasHabilitadas' | 'autobusesServicio' | 'totalAutobuses' | 'userName';

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0,
    rutas: 0,
    autobuses: 0,
    solicitudes: 0,
    solicitudesPendientes: 0,
    autobusesOperacion: 0,
    autobusesMantenimiento: 0,
    conductoresDisponibles: 0,
    conductoresNoDisponibles: 0,
    paradasHabilitadas: 0,
    autobusesServicio: 0,
    totalAutobuses: 0,
  });
  const [paradas, setParadas] = useState<Parada[]>([]);
  const [userName, setUserName] = useState('');
  const [authorized, setAuthorized] = useState<Record<StatKey, boolean>>({
    usuarios: true,
    rutas: true,
    autobuses: true,
    solicitudes: true,
    solicitudesPendientes: true,
    autobusesOperacion: true,
    autobusesMantenimiento: true,
    conductoresDisponibles: false,
    conductoresNoDisponibles: false,
    paradasHabilitadas: true,
    autobusesServicio: true,
    totalAutobuses: true,
    userName: true,
  });
  const navigate = useNavigate();

  const getTokenHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    return {
      Authorization: `Bearer ${token}`
    };
  };

  const handleApiError = (error: any, key: StatKey) => {
    if (axios.isAxiosError(error) && (error.response?.status === 403 || error.response?.status === 401)) {
      setAuthorized(prev => ({ ...prev, [key]: false }));
    } else {
      console.error(`Error fetching ${key}:`, error);
    }
  };

  const fetchRutas = async () => {
    const headers = getTokenHeaders();
    try {
      const response = await axios.get('https://localhost:7251/api/Ruta/lista/rutas', { headers });
      return response?.data?.totalData || 0;
    } catch (error) {
      handleApiError(error, 'rutas');
      return 0;
    }
  };

  const fetchAutobuses = async () => {
    const headers = getTokenHeaders();
    try {
      const response = await axios.get('https://localhost:7251/api/Autobus/paginated-list', { headers });
      return response?.data?.totalData || 0;
    } catch (error) {
      handleApiError(error, 'autobuses');
      return 0;
    }
  };

  const fetchAutobusesOperacion = async () => {
    const headers = getTokenHeaders();
    try {
      const response = await axios.get('https://localhost:7251/api/Autobus/paginated-list', { headers });
      return response.data.data.filter(
        (bus: Autobus) => bus.estado === 'Disponible' && bus.ruta !== 'Sin asignar'
      ).length || 0;
    } catch (error) {
      handleApiError(error, 'autobusesOperacion');
      return 0;
    }
  };

  const fetchAutobusesMantenimiento = async () => {
    const headers = getTokenHeaders();
    try {
      const response = await axios.get('https://localhost:7251/api/Autobus/mantenimiento', { headers });
      return response.data.totalData || 0;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.warn('Endpoint de mantenimiento no encontrado, continuando...');
        return 0;
      } else {
        handleApiError(error, 'autobusesMantenimiento');
        return 0;
      }
    }
  };

  const fetchConductores = async () => {
    const headers = getTokenHeaders();
    try {
      const response = await axios.get('https://localhost:7251/api/Personal/aux-chof/paginated-list', { headers });
      const conductoresDisponibles = response?.data?.data.filter((personal: Personal) => personal.tipoPersonal === 'Conductor' && personal.ruta === 'Sin asignar').length || 0;
      const conductoresNoDisponibles = response?.data?.data.filter((personal: Personal) => personal.tipoPersonal === 'Conductor' && personal.ruta !== 'Sin asignar').length || 0;
      setAuthorized(prev => ({ ...prev, conductoresDisponibles: true, conductoresNoDisponibles: true }));
      return { conductoresDisponibles, conductoresNoDisponibles };
    } catch (error) {
      handleApiError(error, 'conductoresDisponibles');
      handleApiError(error, 'conductoresNoDisponibles');
      return { conductoresDisponibles: 0, conductoresNoDisponibles: 0 };
    }
  };

  const fetchParadas = async () => {
    const headers = getTokenHeaders();
    try {
      //pendiente cambiar esto a ruta para obtener paradas, rutas y escuelas
      const response = await axios.get('https://localhost:7251/api/Paradas/lista', { headers });
      return response?.data?.data || [];
    } catch (error) {
      handleApiError(error, 'paradasHabilitadas');
      return [];
    }
  };

  const fetchUsuarios = async () => {
    const headers = getTokenHeaders();
    try {
      const response = await axios.get('https://localhost:7251/api/Usuarios/paginated-list', { headers });
      return response?.data?.totalData || 0;
    } catch (error) {
      handleApiError(error, 'usuarios');
      return 0;
    }
  };

  const fetchSolicitudes = async () => {
    const headers = getTokenHeaders();
    let solicitudesPendientes = 0;
    let totalSolicitudes = 0;
    let page = 1;
    let totalPages = 1;

    try {
      do {
        const response = await axios.get(`https://localhost:7251/api/Solicitud?pageNumber=${page}`, { headers });
        const solicitudes = response.data.data || [];
        totalSolicitudes = response.data.totalData;
        solicitudesPendientes += solicitudes.filter((solicitud: { estado: string }) => solicitud.estado === 'Pendiente').length;

        totalPages = response.data.totalPages;
        page += 1;
      } while (page <= totalPages);

      return { totalSolicitudes, solicitudesPendientes };
    } catch (error) {
      handleApiError(error, 'solicitudes');
      handleApiError(error, 'solicitudesPendientes');
      return { totalSolicitudes: 0, solicitudesPendientes: 0 };
    }
  };

  const fetchUserName = async () => {
    const headers = getTokenHeaders();
    try {
      const response = await axios.get('https://localhost:7251/api/Usuarios/me', { headers });
      return response.data.nombreCompleto;
    } catch (error) {
      handleApiError(error, 'userName');
      return '';
    }
  };

  const fetchStats = useCallback(async () => {
    const [totalRutas, totalAutobuses, autobusesOperacion, autobusesMantenimiento, conductoresData, paradasData, usuarios, solicitudesData, userName] = await Promise.all([
      fetchRutas(),
      fetchAutobuses(),
      fetchAutobusesOperacion(),
      fetchAutobusesMantenimiento(),
      fetchConductores(),
      fetchParadas(),
      fetchUsuarios(),
      fetchSolicitudes(),
      fetchUserName(),
    ]);

    const newStats = {
      usuarios,
      rutas: totalRutas,
      autobuses: totalAutobuses,
      solicitudes: solicitudesData.totalSolicitudes || 0,
      solicitudesPendientes: solicitudesData.solicitudesPendientes || 0,
      autobusesOperacion,
      autobusesMantenimiento,
      conductoresDisponibles: conductoresData.conductoresDisponibles,
      conductoresNoDisponibles: conductoresData.conductoresNoDisponibles,
      paradasHabilitadas: paradasData.length,
      autobusesServicio: autobusesOperacion,
      totalAutobuses,
    };
    setStats(newStats);
    setUserName(userName);
    setParadas(paradasData);
  }, [navigate]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (window.google && window.google.maps) {
    }
  }, []);

  const renderStat = (label: string, value: any, icon: JSX.Element, bgColor: string, textColor: string, additionalText?: string) => {
    return (
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{value}</h3>
            {additionalText && <p className="text-xs text-gray-500 mt-1">{additionalText}</p>}
          </div>
          <div className={`w-12 h-12 md:w-16 md:h-16 ${bgColor} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  //dinamismo para las cartas
  const visibleStats = [
    authorized.solicitudes && stats.solicitudes > 0 && renderStat('Solicitudes', stats.solicitudes, <InboxIcon className="w-6 h-6 md:w-8 md:h-8 text-custom-blue" />, 'bg-blue-50', 'text-custom-blue', `${stats.solicitudesPendientes} pendientes`),
    authorized.usuarios && stats.usuarios > 0 && renderStat('Usuarios Registrados', stats.usuarios, <UsersIcon className="w-6 h-6 md:w-8 md:h-8 text-indigo-600" />, 'bg-indigo-50', 'text-indigo-600', '3 nuevos este mes'),
    authorized.autobuses && stats.autobuses > 0 && renderStat('Autobuses Activos', stats.autobuses, <WrenchScrewdriverIcon className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />, 'bg-yellow-50', 'text-yellow-600', `${stats.autobusesMantenimiento} en mantenimiento`),
    authorized.rutas && stats.rutas > 0 && renderStat('Rutas Activas', stats.rutas, <MapIcon className="w-6 h-6 md:w-8 md:h-8 text-green-600" />, 'bg-green-50', 'text-green-600', `${stats.rutas} en servicio`),
  ].filter(Boolean);

  return (
    <div className="flex-1 overflow-auto">
      <main className="p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            ¡Bienvenido, {userName}!
          </h1>
          <p className="text-md text-gray-600 ml-1">
            Aquí tienes un resumen general del sistema.
          </p>
        </div>

        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8`}>
          {visibleStats}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {authorized.autobusesOperacion && authorized.autobusesMantenimiento && (
            <FleetStatus stats={stats} />
          )}
          {authorized.conductoresDisponibles && authorized.conductoresNoDisponibles && (
          <TransportStatistics stats={stats} />
        )}
        </div>

        {/* Mapa */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Paradas de transporte registradas</h3>        
          </div>
          <div className="text-sm text-gray-500 p-1">Mapa representativo</div>
          <LoadScript googleMapsApiKey="AIzaSyCP27C35blbfm1I7J4jjEcoSb8rHf0JOY8">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
            >
              {paradas.map((parada, index) => (
                <MarkerF
                  key={index}
                  position={{ lat: parada.latitud, lng: parada.longitud }}
                  icon={{
                    scaledSize: new window.google.maps.Size(32, 32),
                    url: 'https://maps.google.com/mapfiles/ms/icons/bus.png'
                  }}
                  title={parada.descripcion}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
        
      </main>
    </div>
  );
}