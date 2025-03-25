import React, { useEffect, useState } from 'react';
import {
    PlusIcon,
    XMarkIcon,
    Bars3Icon,
    MapPinIcon,
    PencilSquareIcon
} from '@heroicons/react/24/solid';
import { Municipio, Provincia, Region } from '../../features/dashboard/presentation/types/LocationType';
import { Parada } from '../../features/dashboard/presentation/types/Parada';
import { validateParada } from './ParadasValidations';

interface ParadasModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    parada: Parada;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    regiones: Region[];
    provincias: Provincia[];
    municipios: Municipio[];
    fetchProvincias: (regionId: number) => void;
    fetchMunicipios: (provinciaId: number) => void;
    isEditMode: boolean;
}

const ParadasModal: React.FC<ParadasModalProps> = ({
    show,
    onClose,
    onSubmit,
    parada,
    handleFormChange,
    regiones,
    provincias,
    municipios,
    fetchProvincias,
    fetchMunicipios,
    isEditMode,
}) => {
    const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
    const [selectedProvincia, setSelectedProvincia] = useState<number | null>(null);
    const [selectedMunicipio, setSelectedMunicipio] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    useEffect(() => {
        if (isEditMode && parada.regionId) {
            setSelectedRegion(parada.regionId);
            fetchProvincias(parada.regionId);
        }
    }, [isEditMode, parada.regionId, fetchProvincias]);

    useEffect(() => {
        if (isEditMode && parada.provinciaId) {
            setSelectedProvincia(parada.provinciaId);
            fetchMunicipios(parada.provinciaId);
        }
    }, [isEditMode, parada.provinciaId, fetchMunicipios]);

    useEffect(() => {
        if (isEditMode && parada.municipioId) {
            setSelectedMunicipio(parada.municipioId);
        }
    }, [isEditMode, parada.municipioId]);

    useEffect(() => {
        if (selectedRegion) {
            fetchProvincias(selectedRegion);
        }
    }, [selectedRegion, fetchProvincias]);

    useEffect(() => {
        if (selectedProvincia) {
            fetchMunicipios(selectedProvincia);
        }
    }, [selectedProvincia, fetchMunicipios]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateParada(parada);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            onSubmit(e);
        }
    };

    if (!show) return null;

    return (
        <div className="z-1000 fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-lg w-[1100px] max-w-[95%] h-auto p-8">
                {/* Encabezado del modal */}
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {isEditMode ? (
                            <PencilSquareIcon className="w-7 h-7 text-gray-600" />
                        ) : (
                            <PlusIcon className="w-7 h-7 text-gray-600" />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">
                            {isEditMode ? 'Editar Parada' : 'Nueva Parada'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                {/* Contenido del modal */}
                <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Parada</label>
                        <div className="relative">
                            <PlusIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="nombreParada"
                                value={parada.nombreParada}
                                onChange={handleFormChange}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.nombreParada && <span className="text-red-500 text-sm">{errors.nombreParada[0]}</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <div className="relative">
                            <Bars3Icon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                name="descripcion"
                                value={parada.descripcion}
                                onChange={handleFormChange}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.descripcion && <span className="text-red-500 text-sm">{errors.descripcion[0]}</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitud</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="latitud"
                                value={String(parada.latitud)}
                                onChange={handleFormChange}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.latitud && <span className="text-red-500 text-sm">{errors.latitud[0]}</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitud</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                name="longitud"
                                value={String(parada.longitud)}
                                onChange={handleFormChange}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.longitud && <span className="text-red-500 text-sm">{errors.longitud[0]}</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                name="regionId"
                                value={selectedRegion?.toString() || parada.regionId?.toString() || ''}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    handleFormChange(e);
                                    setSelectedRegion(value);
                                    setSelectedProvincia(null);
                                    setSelectedMunicipio(null);
                                }}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Seleccione una región</option>
                                {regiones.map((region) => (
                                    <option key={region.regionId} value={region.regionId}>
                                        {region.nombreRegion}
                                    </option>
                                ))}
                            </select>
                            {errors.regionId && <span className="text-red-500 text-sm">{errors.regionId[0]}</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                name="provinciaId"
                                value={selectedProvincia?.toString() || parada.provinciaId?.toString() || ''}
                                onChange={(e) => {
                                    handleFormChange(e);
                                    setSelectedProvincia(Number(e.target.value));
                                    setSelectedMunicipio(null);
                                }}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedRegion}
                            >
                                <option value="">Seleccione una provincia</option>
                                {provincias.map((provincia) => (
                                    <option key={provincia.provinciaId} value={provincia.provinciaId.toString()}>
                                        {provincia.provincia}
                                    </option>
                                ))}
                            </select>
                            {errors.provinciaId && <span className="text-red-500 text-sm">{errors.provinciaId[0]}</span>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
                        <div className="relative">
                            <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                name="municipioId"
                                value={selectedMunicipio?.toString() || parada.municipioId?.toString() || ''}
                                onChange={handleFormChange}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                disabled={!selectedProvincia}
                            >
                                <option value="">Seleccione un municipio</option>
                                {municipios.map((municipio) => (
                                    <option key={municipio.municipioId} value={municipio.municipioId.toString()}>
                                        {municipio.municipio}
                                    </option>
                                ))}
                            </select>
                            {errors.municipioId && <span className="text-red-500 text-sm">{errors.municipioId[0]}</span>}
                        </div>
                    </div>
                    {isEditMode && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                            <div className="relative">
                                <select
                                    name="estado"
                                    value={parada.estado}
                                    onChange={handleFormChange}
                                    className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                                <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>
                    )}
                    <div className="relative z-0 flex justify-end gap-4 mt-6 col-span-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 shadow-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm"
                        >
                            {isEditMode ? 'Guardar Cambios' : 'Registrar Parada'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ParadasModal;