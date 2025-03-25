import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

interface Activity {
  actividadId: number;
  usuario: string;
  seccion: string;
  accion: string;
  ip: string;
  descripcion: string;
  fechaRegistro: string;
}

interface Accion {
  accionId: number;
  descripcion: string;
}

interface Modulo {
  moduloId: number;
  nombreModulo: string;
}

const ActivityModule = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [acciones, setAcciones] = useState<Accion[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [totalActivities, setTotalActivities] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const itemsPerPage = 8;

  useEffect(() => {
    fetchActivities();
    fetchAcciones();
    fetchModulos();
  }, [currentPage, searchTerm, filterAction, filterModule, filterDate]);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;
      if (filterModule) {
        response = await axios.get(`https://localhost:7251/api/RegistroActividad/actividades-modulos`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            moduloId: filterModule,
            pageNumber: currentPage,
            pageSize: itemsPerPage,
            searchTerm: searchTerm.trim(),
            accionId: filterAction,
            date: filterDate,
          },
        });
      } else {
        response = await axios.get(`https://localhost:7251/api/RegistroActividad/paginated-list`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            pageNumber: currentPage,
            pageSize: itemsPerPage,
            searchTerm: searchTerm.trim(),
            action: filterAction,
            date: filterDate,
          },
        });
      }
      setActivities(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalActivities(response.data.totalData);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchModulos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7251/api/RegistroActividad/modulos', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setModulos(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchAcciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://localhost:7251/api/RegistroActividad/acciones', {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      setAcciones(response.data);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  const exportToPDF = () => {
    // Lógica para exportar a PDF
    console.log('Exportar a PDF');
  };

  const exportToExcel = () => {
    // Lógica para exportar a Excel
    console.log('Exportar a Excel');
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalActivities);

  return (
    <div className="flex h-screen bg-gray-50 mx-6 mt-2">
      <div className="flex-1">
        <div className="flex-1 overflow-auto">
          <div className="max-w-full mx-auto p-6 space-y-4 bg-white border rounded-md shadow-sm h-[835px]">
            <div className="p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="p-2 font-heading text-3xl font-medium mb-2">Registro de Actividad</h1>
                  <div className='mb-6 flex justify-between items-center'>
                    <div className='relative w-72'>
                      <MagnifyingGlassIcon className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 mt-1' />
                      <input
                        type="text"
                        placeholder='Buscar...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-2 h-[40px]'
                      />
                    </div>
                    <div className='relative w-72'>
                      <select
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className='w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-2 h-[40px]'
                      >
                        <option value="">Filtrar por Acción</option>
                        {acciones && acciones.map((accion) => (
                          <option key={accion.accionId} value={accion.descripcion}>{accion.descripcion}</option>
                        ))}
                      </select>
                    </div>
                    <div className='relative w-72'>
                      <select
                        value={filterModule}
                        onChange={(e) => setFilterModule(e.target.value)}
                        className='w-full h-[40px] pl-3 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-2'
                      >
                        <option value="">Filtrar por Módulo</option>
                        {modulos && modulos.map((modulo) => (
                          <option key={modulo.moduloId} value={modulo.moduloId}>{modulo.nombreModulo}</option>
                        ))}
                      </select>
                    </div>
                    <div className='relative w-72'>
                      <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        className='w-full pl-3 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-2 h-[40px]'
                      />
                    </div>
                    <div className="flex space-x-2 mt-1">
                      <button
                        onClick={exportToPDF}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-[165px] h-[40px]"
                      >
                        <FaFilePdf className="w-5 h-5 mr-2" />
                        Exportar a PDF
                      </button>
                      <button
                        onClick={exportToExcel}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-[165px] h-[40px]"
                      >
                        <FaFileExcel className="w-5 h-5 mr-2" />
                        Exportar a Excel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex flex-col ">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ">
                      <table className="min-w-full divide-y divide-gray-300 text-xl">
                        <thead className="bg-gray-200">
                          <tr>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                              Módulo/Sección
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900">
                              Acción
                            </th>
                            <th scope="col" className="px-8 pl-8 py-3.5 text-justify text-sm font-bold text-gray-900">
                              Usuario
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900">
                              IP del Usuario
                            </th>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-justify text-sm font-bold text-gray-900 sm:pl-6">
                              Descripción
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900">
                              Fecha y Hora de Registro
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white ">
                          {activities.map((activity) => (
                            <tr key={activity.actividadId}>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-justify">
                                {activity.seccion}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-justify">
                                {activity.accion}
                              </td>
                              <td className="whitespace-nowrap px-8 pl-8 py-4 text-sm text-gray-900 text-justify">
                                {activity.usuario}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-justify">
                                {activity.ip}
                              </td>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 text-justify">
                                {activity.descripcion}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-justify">
                                {new Date(activity.fechaRegistro).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Anterior
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Siguiente
                        </button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"> 
                        <p className="text-sm text-gray-700">
                          Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                          <span className="font-medium">{endIndex}</span> de <span className="font-medium">{totalActivities}</span> resultados
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Anterior</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                page === currentPage
                                  ? 'z-10 bg-custom-blue text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-custom-blue'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Siguiente</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModule;