import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PencilSquareIcon,
  TruckIcon,
  ClipboardDocumentCheckIcon,
  IdentificationIcon,
  UsersIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';
import { Autobus, Estado, Marca, Modelo, Agencia } from '../../features/dashboard/presentation/types/AutobusType';
import { Region, Provincia, Municipio } from '../../features/dashboard/presentation/types/LocationType';
import { validateAutobus, validateField } from './RegistroValidations';

interface AutobusModalProps {
  isOpen: boolean;
  editAutobus: Omit<Autobus, 'marcaId'> | null;
  newAutobus: Omit<Autobus, 'marcaId'>;
  onClose: () => void;
  handleSaveEdit: () => void;
  handleAddAutobus: () => void;
  setEditAutobus: (value: Omit<Autobus, 'marcaId'> | null) => void;
  setNewAutobus: (value: Omit<Autobus, 'marcaId'>) => void;
  marcas: Marca[];
  modelos: Modelo[];
  estados: Estado[];
  regiones: Region[];
  token: string | null;
  selectedMarca: number | null;
  setSelectedMarca: (value: number | null) => void;
  fetchModelos: (marcaId: number) => void;
  agencias: Agencia[];
}

const AutobusModal: React.FC<AutobusModalProps> = ({
  isOpen,
  editAutobus,
  newAutobus,
  onClose,
  handleSaveEdit,
  handleAddAutobus,
  setEditAutobus,
  setNewAutobus,
  marcas,
  modelos,
  estados,
  token,
  selectedMarca,
  setSelectedMarca,
  fetchModelos,
  regiones,
  agencias,
}) => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
  const [selectedAgencia, setSelectedAgencia] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (selectedRegion) {
      fetchProvincias(selectedRegion);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedProvincia) {
      fetchMunicipios(selectedProvincia);
    }
  }, [selectedProvincia]);

  useEffect(() => {
    if (selectedMarca) {
      fetchModelos(selectedMarca);
    }
  }, [selectedMarca]);

  useEffect(() => {
    if (editAutobus) {
      setNewAutobus(editAutobus);
    }
  }, [editAutobus]);

  const fetchProvincias = async (regionId: number) => {
    try {
      const response = await axios.get<Provincia[]>(`https://localhost:7251/api/Provincias/provincias/${regionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProvincias(response.data);
    } catch (error) {
      console.error('Error al cargar provincias:', error);
    }
  };

  const fetchMunicipios = async (provinciaId: number) => {
    try {
      const response = await axios.get<Municipio[]>(`https://localhost:7251/api/Municipios/municipios/${provinciaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMunicipios(response.data);
    } catch (error) {
      console.error('Error al cargar municipios:', error);
    }
  };

  const validate = () => {
    const newErrors = validateAutobus(newAutobus);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (field: string, value: any) => {
    const newErrors = { ...errors };
    const fieldErrors = validateField(field, value);
  
    if (Object.keys(fieldErrors).length === 0) {
      delete newErrors[field];
    } else {
      newErrors[field] = fieldErrors[field];
    }
  
    setErrors(newErrors);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-[1100px] max-w-[95%] h-auto p-8">
        {/* Encabezado del modal */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {editAutobus ? (
              <PencilSquareIcon className="w-7 h-7 text-gray-600" />
            ) : (
              <TruckIcon className="w-7 h-7 text-gray-600" />
            )}
            <h2 className="text-2xl font-bold text-gray-800">
              {editAutobus ? 'Editar Autobús' : 'Registrar Autobús'}
            </h2>
          </div>
          <button
            onClick={() => {
              onClose();
              setEditAutobus(null);
              setNewAutobus({
                autobusId: 0,
                capacidad: 0,
                modeloId: 0,
                placa: '',
                estadoAutobusId: 0,
                codigoAutobus: '',
                modelo: '',
                estado: '',
                marca: '',
                ruta: '',
                movilidad: '',
                chasis: '',
                municipioId: 0,
                provincia: '',
                municipio: '',
                agenciaId: 0,
                agencia: '',
                diasRestantesGarantia: 0
              });
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Contenido del modal */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Código Autobus</label>
            <div className="relative">
              <ClipboardDocumentCheckIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={editAutobus ? editAutobus.codigoAutobus : newAutobus.codigoAutobus}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, codigoAutobus: value });
                  } else {
                    setNewAutobus({ ...newAutobus, codigoAutobus: value });
                  }
                  handleFieldChange('codigoAutobus', value);
                }}
                readOnly={!!editAutobus}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.codigoAutobus && <p className="text-red-500 text-xs mt-1">{errors.codigoAutobus.join(', ')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
            <div className="relative">
              <IdentificationIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={editAutobus ? editAutobus.placa : newAutobus.placa}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, placa: value });
                  } else {
                    setNewAutobus({ ...newAutobus, placa: value });
                  }
                  handleFieldChange('placa', value);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.placa && <p className="text-red-500 text-xs mt-1">{errors.placa.join(', ')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chasis</label>
            <div className="relative">
              <IdentificationIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={editAutobus ? editAutobus.chasis : newAutobus.chasis}
                onChange={(e) => {
                  const value = e.target.value;
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, chasis: value });
                  } else {
                    setNewAutobus({ ...newAutobus, chasis: value });
                  }
                  handleFieldChange('chasis', value);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.chasis && <p className="text-red-500 text-xs mt-1">{errors.chasis.join(', ')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agencia</label>
            <div className="relative">
              <TruckIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                value={selectedAgencia ?? ''}
                onChange={(e) => {
                  const agenciaId = parseInt(e.target.value);
                  setSelectedAgencia(agenciaId);
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, agenciaId });
                  } else {
                    setNewAutobus({ ...newAutobus, agenciaId });
                  }
                  handleFieldChange('agenciaId', agenciaId);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una agencia</option>
                {agencias.map((agencia) => (
                  <option key={agencia.agenciaId} value={agencia.agenciaId}>
                    {agencia.nombre}
                  </option>
                ))}
              </select>
              {errors.agenciaId && <p className="text-red-500 text-xs mt-1">{errors.agenciaId.join(', ')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <div className="relative">
              <TruckIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                value={selectedMarca ?? ''}
                onChange={(e) => {
                  const marcaId = parseInt(e.target.value);
                  setSelectedMarca(marcaId);
                  fetchModelos(marcaId);
                  const marcaNombre = marcas.find((marca) => marca.marcaId === marcaId)?.nombreMarca || '';
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, marca: marcaNombre });
                  } else {
                    setNewAutobus({ ...newAutobus, marca: marcaNombre });
                  }
                  handleFieldChange('marca', marcaId);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una marca</option>
                {marcas.map((marca) => (
                  <option key={marca.marcaId} value={marca.marcaId}>
                    {marca.nombreMarca}
                  </option>
                ))}
              </select>
              {errors.marca && <p className="text-red-500 text-xs mt-1">{errors.marca.join(', ')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <div className="relative">
              <TruckIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                value={editAutobus ? editAutobus.modeloId : newAutobus.modeloId}
                onChange={(e) => {
                  const modeloId = parseInt(e.target.value);
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, modeloId });
                  } else {
                    setNewAutobus({ ...newAutobus, modeloId });
                  }
                  handleFieldChange('modeloId', modeloId);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona un modelo</option>
                {modelos
                  .filter((modelo) => modelo.marcaId === selectedMarca)
                  .map((modelo) => (
                    <option key={modelo.modeloId} value={modelo.modeloId}>
                      {modelo.nombreModelo}
                    </option>
                  ))}
              </select>
              {errors.modeloId && <p className="text-red-500 text-xs mt-1">{errors.modeloId.join(', ')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
            <div className="relative">
              <UsersIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={editAutobus ? editAutobus.capacidad : newAutobus.capacidad}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, capacidad: value });
                  } else {
                    setNewAutobus({ ...newAutobus, capacidad: value });
                  }
                  handleFieldChange('capacidad', value);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.capacidad && <p className="text-red-500 text-xs mt-1">{errors.capacidad.join(', ')}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                value={selectedRegion ?? ''}
                onChange={(e) => {
                  const regionId = parseInt(e.target.value);
                  setSelectedRegion(regionId);
                  handleFieldChange('regionId', regionId);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una región</option>
                {regiones.map((region) => (
                  <option key={region.regionId} value={region.regionId}>
                    {region.nombreRegion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                value={selectedProvincia ?? ''}
                onChange={(e) => {
                  const provinciaId = parseInt(e.target.value);
                  setSelectedProvincia(provinciaId);
                  handleFieldChange('provinciaId', provinciaId);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecciona una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.provinciaId} value={provincia.provinciaId}>
                    {provincia.provincia}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <select
                value={editAutobus ? editAutobus.municipioId : newAutobus.municipioId}
                onChange={(e) => {
                  const municipioId = parseInt(e.target.value);
                  if (editAutobus) {
                    setEditAutobus({ ...editAutobus, municipioId });
                  } else {
                    setNewAutobus({ ...newAutobus, municipioId });
                  }
                  handleFieldChange('municipioId', municipioId);
                }}
                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecciona un municipio</option>
                  {municipios.map((municipio) => (
                    <option key={municipio.municipioId} value={municipio.municipioId}>
                      {municipio.municipio}
                    </option>
                  ))}
                </select>
                {errors.municipioId && <p className="text-red-500 text-xs mt-1">{errors.municipioId.join(', ')}</p>}
              </div>
            </div>
            {editAutobus && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div className="relative">
                  {editAutobus.estadoAutobusId === 1 ? (
                    <CheckCircleIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  ) : (
                    <XCircleIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  )}
                  <select
                    value={editAutobus.estadoAutobusId}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      setEditAutobus({ ...editAutobus, estadoAutobusId: value });
                      handleFieldChange('estadoAutobusId', value);
                    }}
                    className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Selecciona un estado</option>
                    {estados.map((estado) => (
                      <option key={estado.estadoAutobusId} value={estado.estadoAutobusId}>
                        {estado.descripcion}
                      </option>
                    ))}
                  </select>
                  {errors.estadoAutobusId && <p className="text-red-500 text-xs mt-1">{errors.estadoAutobusId.join(', ')}</p>}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => {
                onClose();
                setEditAutobus(null);
                setNewAutobus({
                  autobusId: 0,
                  capacidad: 0,
                  modeloId: 0,
                  placa: '',
                  estadoAutobusId: 0,
                  codigoAutobus: '',
                  modelo: '',
                  estado: '',
                  marca: '',
                  ruta: '',
                  movilidad: '',
                  chasis: '',
                  municipioId: 0,
                  provincia: '',
                  municipio: '',
                  agenciaId: 0,
                  agencia: '',
                  diasRestantesGarantia: 0
                });
              }}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (validate()) {
                  if (editAutobus) {
                    handleSaveEdit();
                  } else {
                    handleAddAutobus();
                  }
                  onClose();
                }
              }}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm"
            >
              {editAutobus ? 'Guardar Cambios' : 'Crear Autobus'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default AutobusModal;