import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
    PencilSquareIcon,
    KeyIcon,
    UserIcon,
    DocumentIcon,
    MapPinIcon,
    AcademicCapIcon,
    ClockIcon,
    PlusIcon,
    TruckIcon,
} from '@heroicons/react/24/solid';
import { Ruta, TipoRuta, Parada, Escuela, Horario, NewRuta } from '../../features/dashboard/presentation/types/RutaType';
import { Autobus } from '../../features/dashboard/presentation/types/AutobusType';
import { Personal } from '../../features/dashboard/presentation/types/PersonalType';
import { Region, Provincia, Municipio } from '../../features/dashboard/presentation/types/LocationType';
import { validateRuta } from './RutasValidations';
//MODAL PENDIENTE DE RESPONSIVIDAD
interface RutasModalProps {
    isOpen: boolean;
    editRuta: Ruta | null;
    newRuta: NewRuta;
    tiposRuta: TipoRuta[];
    centrosEducativos: Escuela[];
    paradas: Parada[];
    regiones: Region[];
    provincias: Provincia[];
    municipios: Municipio[];
    horarios: Horario[];
    autobuses: Autobus[];
    conductores: Personal[];
    auxiliares: Personal[];
    onClose: () => void;
    handleSaveEdit: () => void;
    handleAddRuta: () => void;
    setEditRuta: (value: Ruta | null) => void;
    setNewRuta: (value: NewRuta) => void;
    fetchProvincias: (regionId: number) => void;
    fetchMunicipios: (provinciaId: number) => void;
}

const RutasModal: React.FC<RutasModalProps> = ({
    isOpen,
    editRuta,
    newRuta,
    tiposRuta,
    centrosEducativos,
    paradas,
    regiones,
    provincias,
    municipios,
    horarios,
    autobuses,
    conductores,
    auxiliares,
    onClose,
    handleSaveEdit,
    handleAddRuta,
    setEditRuta,
    setNewRuta,
    fetchProvincias,
    fetchMunicipios,
}) => {
    const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
    const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
    const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
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

    if (!isOpen) return null;

    const handleSelectChange = (selectedOptions: any, field: 'paradas' | 'escuelas' | 'horarios' | 'autobuses' | 'conductores' | 'auxiliares') => {
        const selectedValues = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
        if (field === 'paradas') {
            const paradasSeleccionadas: number[] = selectedValues;
            if (editRuta) {
                setEditRuta({ ...editRuta, paradas: paradasSeleccionadas });
            } else {
                setNewRuta({ ...newRuta, paradas: paradasSeleccionadas });
            }
        } else if (field === 'escuelas') {
            const escuelasSeleccionadas: number[] = selectedValues;
            if (editRuta) {
                setEditRuta({ ...editRuta, centroEducativoIds: escuelasSeleccionadas });
            } else {
                setNewRuta({ ...newRuta, centroEducativoIds: escuelasSeleccionadas });
            }
        } else if (field === 'horarios') {
            const horariosSeleccionados: number[] = selectedValues;
            if (editRuta) {
                setEditRuta({ ...editRuta, horariosIds: horariosSeleccionados });
            } else {
                setNewRuta({ ...newRuta, horariosIds: horariosSeleccionados });
            }
        } else if (field === 'autobuses') {
            const autobusesSeleccionados: number[] = selectedValues;
            if (editRuta) {
                setEditRuta({ ...editRuta, autobusIds: autobusesSeleccionados });
            } else {
                setNewRuta({ ...newRuta, autobusIds: autobusesSeleccionados });
            }
        } else if (field === 'conductores' || field === 'auxiliares') {
            const personalSeleccionado: number[] = selectedValues;
            const updatedPersonalIds = [
                ...(editRuta ? editRuta.personalIds : newRuta.personalIds || []),
                ...personalSeleccionado,
            ];
            if (editRuta) {
                setEditRuta({ ...editRuta, personalIds: updatedPersonalIds });
            } else {
                setNewRuta({ ...newRuta, personalIds: updatedPersonalIds });
            }
        }
    };

    const handleSave = () => {
        const validationErrors = validateRuta(editRuta || newRuta);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            if (editRuta) {
                handleSaveEdit();
            } else {
                handleAddRuta();
            }
        }
    };

    const paradasOptions = (paradas || []).filter(parada => parada.municipioId === selectedMunicipio).map((parada) => ({
        value: parada.paradaId,
        label: parada.nombreParada,
    }));

    const escuelasOptions = (centrosEducativos || []).filter(centro => centro.municipioId === selectedMunicipio).map((centro) => ({
        value: centro.centroEducativoId,
        label: centro.nombreCentro,
    }));

    const autobusesOptions = (autobuses || []).filter(autobus => autobus.municipioId === selectedMunicipio).map((autobus) => ({
        value: autobus.autobusId,
        label: `${autobus.placa} - ${autobus.modelo} (${autobus.marca})`,
    }));

    const provinciasOptions = (provincias || []).map((provincia) => ({
        value: provincia.provinciaId,
        label: provincia.provincia,
    }));

    const municipiosOptions = (municipios || []).map((municipio) => ({
        value: municipio.municipioId,
        label: municipio.municipio,
    }));

    const horariosOptions = (horarios || []).map((horario) => ({
        value: horario.horarioId,
        label: horario.tipoHorario,
    }));

    const conductoresOptions = (conductores || []).map((conductor) => ({
        value: conductor.personalId,
        label: conductor.nombreCompleto,
    }));

    const auxiliaresOptions = (auxiliares || []).map((auxiliar) => ({
        value: auxiliar.personalId,
        label: auxiliar.nombreCompleto,
    }));

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-lg w-[1100px] max-w-[95%] h-auto p-8">
                {/* Encabezado del modal */}
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {editRuta ? (
                            <PencilSquareIcon className="w-7 h-7 text-gray-600" />
                        ) : (
                            <PlusIcon className="w-7 h-7 text-gray-600" />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editRuta ? 'Editar Ruta' : 'Nueva Ruta'}
                        </h2>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            setEditRuta(null);
                        }}
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
                <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de la Ruta
                        {errors.nombreRuta && <span className="text-red-500 text-sm">{errors.nombreRuta[0]}</span>}
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={editRuta ? editRuta.nombreRuta : newRuta.nombreRuta}
                                onChange={(e) =>
                                    editRuta
                                        ? setEditRuta({ ...editRuta, nombreRuta: e.target.value })
                                        : setNewRuta({ ...newRuta, nombreRuta: e.target.value })
                                }
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                        {errors.descripcion && <span className="text-red-500 text-sm ml-2">{errors.descripcion[0]}</span>}
                        </label>
                        <div className="relative">
                            <DocumentIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={editRuta ? editRuta.descripcion : newRuta.descripcion}
                                onChange={(e) =>
                                    editRuta
                                        ? setEditRuta({ ...editRuta, descripcion: e.target.value })
                                        : setNewRuta({ ...newRuta, descripcion: e.target.value })
                                }
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Ruta
                        {errors.tipoRutaId && <span className="text-red-500 text-sm ml-2">{errors.tipoRutaId[0]}</span>}
                        </label>
                        <div className="relative">
                            <KeyIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                value={editRuta ? editRuta.tipoRuta?.tipoRutaId : newRuta.tipoRutaId}
                                onChange={(e) => {
                                    const selectedTipoRutaId = Number(e.target.value);
                                    const selectedTipoRuta = tiposRuta.find(
                                        (tipo) => tipo.tipoRutaId === selectedTipoRutaId
                                    );
                                    if (selectedTipoRuta) {
                                        editRuta
                                            ? setEditRuta({
                                                  ...editRuta,
                                                  tipoRuta: selectedTipoRuta,
                                                  tipoRutaId: selectedTipoRutaId,
                                              })
                                            : setNewRuta({
                                                  ...newRuta,
                                                  tipoRutaId: selectedTipoRutaId,
                                              });
                                    }
                                }}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecciona un tipo de ruta</option>
                                {tiposRuta.map((tipo) => (
                                    <option key={tipo.tipoRutaId} value={tipo.tipoRutaId}>
                                        {tipo.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Región
                        {errors.regionId && <span className="text-red-500 text-sm ml-2">{errors.regionId[0]}</span>}
                        </label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                value={selectedRegion || (editRuta ? editRuta.regionId : newRuta.regionId)}
                                onChange={(e) => {
                                    const selectedRegionId = Number(e.target.value);
                                    setSelectedRegion(selectedRegionId);
                                    setSelectedProvincia(null);
                                    setSelectedMunicipio(null);
                                    if (editRuta) {
                                        setEditRuta({ ...editRuta, regionId: selectedRegionId });
                                    } else {
                                        setNewRuta({ ...newRuta, regionId: selectedRegionId });
                                    }
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Provincia
                        {errors.provinciaId && <span className="text-red-500 text-sm ml-2">{errors.provinciaId[0]}</span>}
                        </label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                value={selectedProvincia || ''}
                                onChange={(e) => {
                                    const selectedProvinciaId = Number(e.target.value);
                                    setSelectedProvincia(selectedProvinciaId);
                                    setSelectedMunicipio(null);
                                }}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedRegion}
                            >
                                <option value="">Selecciona una provincia</option>
                                {provinciasOptions.map((provincia) => (
                                    <option key={provincia.value} value={provincia.value}>
                                        {provincia.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Municipio
                        {errors.municipioId && <span className="text-red-500 text-sm ml-2">{errors.municipioId[0]}</span>}
                        </label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                value={selectedMunicipio || ''}
                                onChange={(e) => {
                                    const selectedMunicipioId = Number(e.target.value);
                                    setSelectedMunicipio(selectedMunicipioId);
                                }}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedProvincia}
                            >
                                <option value="">Selecciona un municipio</option>
                                {municipiosOptions.map((municipio) => (
                                    <option key={municipio.value} value={municipio.value}>
                                        {municipio.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horario
                        {errors.horariosIds && <span className="text-red-500 text-sm ml-2">{errors.horariosIds[0]}</span>}
                        </label>
                        <div className="relative">
                            <ClockIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <Select
                                isMulti
                                value={horariosOptions.filter(option => (editRuta ? (editRuta.horariosIds || []).includes(option.value) : newRuta.horariosIds.includes(option.value)))}
                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'horarios')}
                                options={horariosOptions}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                        {errors.color && <span className="text-red-500 text-sm ml-2">{errors.color[0]}</span>}
                        </label>
                        <div className="relative">
                            <input
                                type="color"
                                value={editRuta ? editRuta.color : newRuta.color}
                                onChange={(e) =>
                                    editRuta
                                        ? setEditRuta({ ...editRuta, color: e.target.value })
                                        : setNewRuta({ ...newRuta, color: e.target.value })
                                }
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Paradas
                        {errors.paradas && <span className="text-red-500 text-sm ml-2">{errors.paradas[0]}</span>}
                        </label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <Select
                                isMulti
                                value={paradasOptions.filter(option => (editRuta ? (editRuta.paradas || []).includes(option.value ?? -1) : newRuta.paradas.includes(option.value ?? -1)))}
                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'paradas')}
                                options={paradasOptions}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Escuelas
                            {errors.centroEducativoIds && <span className="text-red-500 text-sm ml-2">{errors.centroEducativoIds[0]}</span>}
                        </label>
                        <div className="relative">
                            <AcademicCapIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <Select
                                isMulti
                                value={escuelasOptions.filter(option => (editRuta ? (editRuta.centroEducativoIds || []).includes(option.value) : newRuta.centroEducativoIds.includes(option.value)))}
                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'escuelas')}
                                options={escuelasOptions}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Autobuses
                        {errors.autobusIds && <span className="text-red-500 text-sm ml-2">{errors.autobusIds[0]}</span>}
                        </label>
                        <div className="relative">
                            <TruckIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <Select
                                isMulti
                                value={autobusesOptions.filter(option => (editRuta ? (editRuta.autobusIds || []).includes(option.value) : newRuta.autobusIds.includes(option.value)))}
                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'autobuses')}
                                options={autobusesOptions}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Conductores
                        {errors.personalIds && <span className="text-red-500 text-sm ml-2">{errors.personalIds[0]}</span>}
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <Select
                                isMulti
                                value={conductoresOptions.filter(option => (editRuta ? (editRuta.personalIds || []).includes(option.value) : newRuta.personalIds.includes(option.value)))}
                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'conductores')}
                                options={conductoresOptions}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auxiliares
                        {errors.personalIds && <span className="text-red-500 text-sm ml-2">{errors.personalIds[0]}</span>}
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <Select
                                isMulti
                                value={auxiliaresOptions.filter(option => (editRuta ? (editRuta.personalIds || []).includes(option.value) : newRuta.personalIds.includes(option.value)))}
                                onChange={(selectedOptions) => handleSelectChange(selectedOptions, 'auxiliares')}
                                options={auxiliaresOptions}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="relative z-0 flex justify-end gap-4 mt-6">
                    <button
                        onClick={() => {
                            onClose();
                            setEditRuta(null);
                        }}
                        className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            handleSave();
                            onClose();
                        }}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm"
                    >
                        {editRuta ? 'Guardar Cambios' : 'Crear Ruta'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RutasModal;