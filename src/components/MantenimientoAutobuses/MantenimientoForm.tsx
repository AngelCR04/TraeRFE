import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { CalendarIcon, DocumentIcon, DocumentMagnifyingGlassIcon, KeyIcon, PencilSquareIcon, PlusIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { Autobus, Mantenimiento, NewMantenimiento, TipoMantenimiento } from '../../features/dashboard/presentation/types/MantenimientoType';

const MantenimientoForm: React.FC = () => {
  const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
  const [newMantenimiento, setNewMantenimiento] = useState<NewMantenimiento>({
    autobusId: 0,
    fechaMantenimiento: '',
    tipoMantenimientoId: 0,
    descripcion: '',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [autobuses, setAutobuses] = useState<Autobus[]>([]);
  const [tiposMantenimiento, setTiposMantenimiento] = useState<TipoMantenimiento[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const itemsPerPage = 8;
  //token pa validar la autorizacion
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchMantenimientos();
    fetchAutobuses();
    fetchTiposMantenimiento();
  }, [currentPage, searchTerm]);

  const fetchMantenimientos = async () => {
    try {
      const response = await axios.get(`https://localhost:7251/api/Mantenimiento/paginated-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          searchTerm: searchTerm.trim(),
        },
      });
      setMantenimientos(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching mantenimientos:', error);
    }
  };

  const fetchAutobuses = async () => {
    try {
      const response = await axios.get(`https://localhost:7251/api/Autobus/paginated-list?pageNumber=1&pageSize=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAutobuses(response.data.data);
    } catch (error) {
      console.error('Error fetching autobuses:', error);
    }
  };

  const fetchTiposMantenimiento = async () => {
    try {
      const response = await axios.get('https://localhost:7251/TipoMantenimiento', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTiposMantenimiento(response.data);
    } catch (error) {
      console.error('Error fetching tipos de mantenimiento:', error);
    }
  };

  const handleAddMantenimiento = async () => {
    try {
      const { autobusId, fechaMantenimiento, tipoMantenimientoId, descripcion } = newMantenimiento;
      const mantenimientoData = { autobusId, fechaMantenimiento, tipoMantenimientoId, descripcion };

      // cuerpo de la respuesta
      console.log('Datos enviados:', mantenimientoData);

      const response = await axios.post('https://localhost:7251/api/Mantenimiento/create', mantenimientoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Mantenimiento creado exitosamente:', response.data);
        setNewMantenimiento({
          autobusId: 0,
          fechaMantenimiento: '',
          tipoMantenimientoId: 0,
          descripcion: '',
        });
        fetchMantenimientos();
        setIsModalOpen(false);
      } else {
        console.error('Error creating mantenimiento:', response.data);
      }
    } catch (error: any) {
      //logs que ya puedo quitar porque arreglé el problema
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error creating mantenimiento:', error.response.data);
        } else if (error.request) {
          console.error('Error creating mantenimiento: No response received', error.request);
        } else {
          console.error('Error creating mantenimiento:', error.message);
        }
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  const handleUpdateMantenimiento = async (id: number, updatedData: Partial<NewMantenimiento>) => {
    try {
      const response = await axios.patch(`https://localhost:7251/api/Mantenimiento/update/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        fetchMantenimientos();
      } else {
        console.error('Error updating mantenimiento:', response.data);
      }
    } catch (error) {
      console.error('Error updating mantenimiento:', error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex h-screen bg-gray-50 mx-6 mt-2">
      <div className="flex-1">
        <div className="flex-1 overflow-auto">
          <div className="max-w-full mx-auto p-6 space-y-4 bg-white border rounded-md shadow-sm h-[835px]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-3xl font-medium">Registro de Mantenimientos</h1>
                </div>
              </div>
              <div className="mb-6 flex justify-between items-center">
                <div className="relative w-72">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar mantenimientos..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); 
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue-light px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Agregar Mantenimiento
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-[165px] h-[40px]"
                  >
                    <FaFilePdf className="w-5 h-5 mr-2" />
                    Exportar a PDF
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-[165px] h-[40px]"
                  >
                    <FaFileExcel className="w-5 h-5 mr-2" />
                    Exportar a Excel
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            {/* Pendiente mover eta table a un componente principal, recordatorio: Agregar características adicionales del autobus*/}
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 sm:pl-6">
                              Autobús
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                              Fecha de Mantenimiento
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                              Fecha Fin de Mantenimiento
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                              Tipo de Mantenimiento
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                              Detalles
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                              Próximo Mantenimiento
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {mantenimientos.map((mantenimiento) => (
                            <tr key={mantenimiento.mantenimientoId}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                {mantenimiento.autobus}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                {new Date(mantenimiento.fechaMantenimiento).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                {new Date(mantenimiento.fechaFinMantenimiento).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                {mantenimiento.tipoMantenimiento}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                {mantenimiento.detalles}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                {new Date(mantenimiento.proximoMantenimiento).toLocaleDateString()}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                <button
                                  onClick={() => handleUpdateMantenimiento(mantenimiento.mantenimientoId, {})}
                                  className="text-custom-blue hover:text-blue-900 font-medium"
                                >
                                  <PencilSquareIcon className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                        <div className="flex flex-1 justify-between sm:hidden">
                          <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Anterior
                          </button>
                          <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Siguiente
                          </button>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm text-gray-700">
                              Mostrando{' '}
                              <span className="font-medium">
                                {Math.min((currentPage - 1) * itemsPerPage + 1, mantenimientos.length)}
                              </span>{' '}
                              a{' '}
                              <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, mantenimientos.length)}
                              </span>{' '}
                              de <span className="font-medium">{mantenimientos.length}</span>{' '}
                              resultados
                            </p>
                          </div>
                          <div>
                            <nav
                              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                              aria-label="Pagination"
                            >
                              <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                              >
                                <span className="sr-only">Anterior</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                              </button>
                              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
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
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
              {/* Modal para agregar mantenimiento, pendiente moverlo a un componente individual */}
              <div className={`fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center ${isModalOpen ? '' : 'hidden'}`}>
                <div className="bg-white rounded-lg shadow-lg w-[1100px] max-w-[95%] h-auto p-8">
                  {/* Encabezado del modal */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <WrenchScrewdriverIcon className="w-7 h-7 text-gray-600" />
                      <h2 className="text-2xl font-bold text-gray-800">Nuevo Mantenimiento</h2>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Contenido del modal */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Autobús</label>
                      <div className="relative">
                        <KeyIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <select
                          value={newMantenimiento.autobusId}
                          onChange={(e) => setNewMantenimiento({ ...newMantenimiento, autobusId: Number(e.target.value) })}
                          className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecciona un autobús</option>
                          {autobuses
                            .filter((autobus) => !mantenimientos.some((mantenimiento) => mantenimiento.autobus === autobus.codigoAutobus))
                            .map((autobus) => (
                              <option key={autobus.autobusId} value={autobus.codigoAutobus}>
                              {autobus.codigoAutobus}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Mantenimiento</label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={newMantenimiento.fechaMantenimiento}
                        onChange={(e) => setNewMantenimiento({ ...newMantenimiento, fechaMantenimiento: e.target.value })}
                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Mantenimiento</label>
                    <div className="relative">
                      <DocumentIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                      <select
                        value={newMantenimiento.tipoMantenimientoId}
                        onChange={(e) => setNewMantenimiento({ ...newMantenimiento, tipoMantenimientoId: Number(e.target.value) })}
                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Selecciona un tipo de mantenimiento</option>
                        {tiposMantenimiento.map((tipo) => (
                          <option key={tipo.tipoMantenimientoId} value={tipo.tipoMantenimientoId}>
                            {tipo.nombreMantenimiento}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <div className="relative">
                      <DocumentMagnifyingGlassIcon className="absolute left-3 top-5 w-5 h-5 text-gray-400" />
                      <textarea
                        placeholder="Descripción"
                        value={newMantenimiento.descripcion}
                        onChange={(e) => setNewMantenimiento({ ...newMantenimiento, descripcion: e.target.value })}
                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 shadow-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddMantenimiento}
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm"
                  >
                    Guardar
                  </button>
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

export default MantenimientoForm;