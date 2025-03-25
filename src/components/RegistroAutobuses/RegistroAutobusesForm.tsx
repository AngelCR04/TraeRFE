import { useState, useEffect } from 'react';
import axios from 'axios';

import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TruckIcon,
} from '@heroicons/react/24/solid';

import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { Autobus, Estado, Marca, Modelo, Agencia } from '../../features/dashboard/presentation/types/AutobusType';
import RegistroTable from './RegistroTable';
import RegistroModal from './RegistroModal';
import { Region } from '../../features/dashboard/presentation/types/LocationType';

const RegistroAutobuses: React.FC = () => {
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [selectedMarca, setSelectedMarca] = useState<number | null>(null);
  const [autobuses, setAutobuses] = useState<Autobus[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');
  const [newAutobus, setNewAutobus] = useState<Omit<Autobus, 'marcaId'>>({
    autobusId: 0,
    placa: '',
    chasis:'',
    modelo: '',
    marca: '',
    movilidad:'',
    capacidad: 0,
    codigoAutobus: '',
    estado: '',
    modeloId: 0,
    estadoAutobusId: 0,
    ruta: '',
    municipioId: 0,
    provincia: '',
    municipio: '',
    agenciaId: 0,
    agencia: '',
    diasRestantesGarantia: 0,
  });

  const [editAutobus, setEditAutobus] = useState<Omit<Autobus, 'marcaId'> | null>(null);

  const itemsPerPage = 8;

  useEffect(() => {
    fetchAutobuses(currentPage, searchTerm);
    fetchMarcas();
    fetchEstados();
    fetchRegiones();
    fetchAgencias();
  }, [currentPage, searchTerm]);

  const fetchAutobuses = async (page: number, searchTerm: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://localhost:7251/api/Autobus/paginated-list?pageNumber=${page}&pageSize=${itemsPerPage}&searchTerm=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al cargar los autobuses');

      const data = await response.json();
      setTotalPages(data.totalPages);
      setAutobuses(data.data);
      setTotalResults(data.totalData);
    } catch (err) {
      console.error('Error al cargar los autobuses:', err);
      setError('Error al cargar los autobuses');
    } finally {
      setLoading(false);
    }
  };

  const fetchMarcas = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get<Marca[]>('https://localhost:7251/api/Autobus/MarcaAutobus', { headers });
      setMarcas(response.data);
    } catch (err) {
      console.error('Error fetching marcas:', err);
      setError('Error fetching marcas');
    }
  };

  const fetchModelos = async (marcaId: number) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get<Modelo[]>(`https://localhost:7251/api/Autobus/ModeloAutobus?marcaId=${marcaId}`, { headers });
      setModelos(response.data);
    } catch (err) {
      console.error('Error fetching modelos:', err);
      setError('Error fetching modelos');
    }
  };

  const fetchEstados = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get<Estado[]>('https://localhost:7251/api/Autobus/EstadoAutobus', { headers });
      setEstados(response.data);
    } catch (err) {
      console.error('Error fetching estados:', err);
      setError('Error fetching estados');
    }
  };

  const fetchRegiones = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };
      const response = await axios.get<Region[]>('https://localhost:7251/api/Regiones', { headers });
      setRegiones(response.data);
    } catch (err) {
      console.error('Error fetching regiones:', err);
      setError('Error fetching regiones');
    }
  };

  const fetchAgencias = async () => {
    try {
      const response = await axios.get<Agencia[]>('https://localhost:7251/api/Autobus/AgenciaAutobus', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAgencias(response.data);
    } catch (error) {
      console.error('Error al cargar agencias:', error);
    }
  };

  const handleAddAutobus = async () => {
    try {
      const autobusData = {
        capacidad: newAutobus.capacidad,
        modeloId: newAutobus.modeloId,
        placa: newAutobus.placa,
        codigoAutobus: newAutobus.codigoAutobus,
        chasis: newAutobus.chasis,
        municipioId: newAutobus.municipioId,
        agenciaId: newAutobus.agenciaId,
      };
  
      console.log('Datos que se envían:', autobusData);
  
      const response = await fetch('https://localhost:7251/api/Autobus/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(autobusData)
      });
  
      console.log('Respuesta:', response);
  
      if (!response.ok) {
        console.error('Error en la respuesta:', response);
        return;
      }
  
      await fetchAutobuses(currentPage, searchTerm);
      setIsModalOpen(false);
      setNewAutobus({
        autobusId: 0,
        capacidad: 0,
        modeloId: 0,
        placa: '',
        chasis:'',
        movilidad:'',
        municipioId: 0,
        estadoAutobusId: 0,
        codigoAutobus: '',
        modelo: '',
        estado: '',
        marca: '',
        ruta: '',
        provincia: '',
        municipio: '',
        agenciaId: 0,
        agencia: '',
        diasRestantesGarantia: 0
      });
    } catch (err) {
      console.error('Error al crear:', err);
    }
  };

  const handleEdit = (autobus: Autobus) => {
    setEditAutobus({
      ...autobus,
      modeloId: modelos.find(modelo => modelo.nombreModelo === autobus.modelo)?.modeloId || 0,
      estadoAutobusId: estados.find(estado => estado.descripcion === autobus.estado)?.estadoAutobusId || 0,
      ruta: autobus.ruta !== 'Sin asignar' ? autobus.ruta : ''
    });
    setSelectedMarca(marcas.find(marca => marca.nombreMarca === autobus.marca)?.marcaId || null);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editAutobus) return;

    try {
      const payload = [
        { op: 'replace', path: '/capacidad', value: editAutobus.capacidad },
        { op: 'replace', path: '/modeloId', value: editAutobus.modeloId },
        { op: 'replace', path: '/placa', value: editAutobus.placa },
        { op: 'replace', path: '/estadoAutobusId', value: editAutobus.estadoAutobusId },
        { op: 'replace', path: '/codigoAutobus', value: editAutobus.codigoAutobus },
        { op: 'replace', path: '/chasis', value: editAutobus.chasis },
        { op: 'replace', path: '/municipioId', value: editAutobus.municipioId },
        { op: 'replace', path: '/agenciaId', value: editAutobus.agenciaId },
      ];

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json'
      };

      const response = await fetch(`https://localhost:7251/api/Autobus/update/${editAutobus.autobusId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al editar el autobus');
      }

      await fetchAutobuses(currentPage, searchTerm);
      setIsModalOpen(false);
      setEditAutobus(null);
    } catch (err) {
      console.error('Error al editar:', err);
      setError('Error al editar el autobus');
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
              <div className="sm:flex sm:items-center">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="p-2 font-heading text-3xl font-medium">
                    Registro de Autobuses
                  </h1>
                </div>
              </div>
              {/* Barra de búsqueda y botones */}
              <div className='mb-6 flex justify-between items-center'>
                <div className='relative w-72'>
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar autobuses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex space-x-2 ">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue-light px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                  >
                    <TruckIcon className="h-6 w-6 mr-2" />
                    Añadir Autobus
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
              {/* Tabla del componente externo */}
              <div className="mt-4 flex flex-col">
                <RegistroTable autobuses={autobuses} handleEdit={handleEdit} />
              </div>
              {/* Paginación */}
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
                        {Math.min((currentPage - 1) * itemsPerPage + 1, autobuses.length)}
                      </span>{' '}
                      a{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, autobuses.length)}
                      </span>{' '}
                      de <span className="font-medium">{autobuses.length}</span>{' '}
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
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
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
                        )
                      )}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      >
                        <span className="sr-only">Siguiente</span>
                        <ChevronRightIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RegistroModal
      isOpen={isModalOpen}
      editAutobus={editAutobus}
      newAutobus={newAutobus}
      onClose={() => setIsModalOpen(false)}
      handleSaveEdit={handleSaveEdit}
      handleAddAutobus={handleAddAutobus}
      setEditAutobus={setEditAutobus}
      setNewAutobus={setNewAutobus}
      marcas={marcas}
      modelos={modelos}
      estados={estados}
      regiones={regiones}
      agencias={agencias}
      token={token}
      selectedMarca={selectedMarca}
      setSelectedMarca={setSelectedMarca}
      fetchModelos={fetchModelos}
    />
    </div>
  );
}

export default RegistroAutobuses;