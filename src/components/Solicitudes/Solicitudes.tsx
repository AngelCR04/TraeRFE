import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

type Solicitud = {
  numeroSolicitud: number;
  tipoSolicitud: string | null;
  region: string | null;
  nombreSolicitante: string | null;
  correoSolicitante: string | null;
  descripcion: string | null;
  estado: string;
  encargado: string | null;
};

type EstadoSolicitud = {
  estadoSolicitudId: number;
  descripcion: string;
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Solicitudes() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [estados, setEstados] = useState<EstadoSolicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const solicitudesPorPagina = 8;

  const token = localStorage.getItem('token');
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const estadosResponse = await fetch('https://localhost:7251/api/EstadoSolicitud');
        if (!estadosResponse.ok) throw new Error('Error al cargar estados');
        const estadosData = await estadosResponse.json();
        const estadosArray = Array.isArray(estadosData) ? estadosData : estadosData.$values || [];
        setEstados(estadosArray);

        await cargarSolicitudes(currentPage, searchTerm);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [currentPage, searchTerm]);

  //searchterm aplicado, pendiente agregar solicitudes para probar, also cambiar la llamada a la api a axios
  const cargarSolicitudes = async (page: number, searchTerm: string) => {
    try {
      const response = await fetch(`https://localhost:7251/api/Solicitud?pageNumber=${page}&pageSize=${solicitudesPorPagina}&searchTerm=${searchTerm}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      if (!response.ok) throw new Error('Error al cargar solicitudes');
      const data = await response.json();
      setSolicitudes(data.data || []);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar solicitudes');
    }
  };

  const handleUpdateEstado = async (numeroSolicitud: number, nuevoEstadoId: string) => {
    try {
      const response = await fetch(`https://localhost:7251/api/Solicitud/${numeroSolicitud}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ estadoSolicitud: parseInt(nuevoEstadoId) })
      });

      if (!response.ok) throw new Error('Error al actualizar el estado');

      await cargarSolicitudes(currentPage, searchTerm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 mx-6 mt-2">
      <div className="flex-1">
        <div className="flex-1 overflow-auto">
          <div className="max-w-full mx-auto p-6 space-y-4 bg-white border rounded-md shadow-sm h-[880px]">
            <div className="p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-medium">
                  Solicitudes de Transporte
                </h1>
              </div>
              <div className='mb-6 flex justify-between items-center'>
                <div className='relative w-72'>
                  <MagnifyingGlassIcon className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <input
                    type="text"
                    placeholder='Buscar solicitud...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>
                <div className='text-sm text-gray-500'>
                  Total: {solicitudes.length} solicitudes
                </div>
              </div>
              {error && (
                <div className='mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg'>
                  <div className='flex'>
                    <div className='flex-shrink-0'>
                      <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z' clipRule='evenodd' />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-red-700'>{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className='flex justify-center items-center h-64'>
                  <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {solicitudes.map((solicitud) => (
                    <div 
                      key={solicitud.numeroSolicitud}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
                    >
                      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              #{solicitud.numeroSolicitud}
                            </h3>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {solicitud.tipoSolicitud}
                            </p>
                          </div>
                          <select
                            value={estados.find(e => e.descripcion === solicitud.estado)?.estadoSolicitudId}
                            onChange={(e) => handleUpdateEstado(solicitud.numeroSolicitud, e.target.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 transition-all ${
                              solicitud.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-200' :
                              solicitud.estado === 'Aprobada' ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-200' :
                              solicitud.estado === 'Enviada' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-200' :
                              'bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-200'
                            }`}
                          >
                            {estados.map(estado => (
                              <option key={estado.estadoSolicitudId} value={estado.estadoSolicitudId}>
                                {estado.descripcion}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                            <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Región</p>
                            <p className="text-sm font-medium text-gray-900">{solicitud.region}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                            <svg className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Solicitante</p>
                            <p className="text-sm font-medium text-gray-900">{solicitud.nombreSolicitante}</p>
                            <p className="text-xs text-gray-500">{solicitud.correoSolicitante}</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-xs text-gray-500 mb-1">Descripción</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{solicitud.descripcion}</p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Encargado</p>
                            <p className="text-sm font-medium text-gray-900">{solicitud.encargado}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className='mt-8 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm'>
                <div className='flex items-center'>
                  <p className='text-sm text-gray-700'>
                    Mostrando <span className='font-medium'>{(currentPage - 1) * solicitudesPorPagina + 1}</span> a <span className='font-medium'>{Math.min(currentPage * solicitudesPorPagina, solicitudes.length)}</span> de{' '}
                    <span className='font-medium'>{solicitudes.length}</span> resultados
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className='relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    <ChevronLeftIcon className='h-5 w-5' />
                  </button>
                  <span className='text-sm text-gray-700'>
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className='relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  >
                    <ChevronRightIcon className='h-5 w-5' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}