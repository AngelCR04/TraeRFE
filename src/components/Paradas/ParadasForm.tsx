import React, { useEffect, useState } from "react";
import axios from "axios";
import { FeatureCollection, Geometry } from "geojson";
import { Parada, ParadaFeature, ParadaProperties } from '../../features/dashboard/presentation/types/Parada';
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import ParadasModal from './ParadasModal';
import ParadasList from './ParadasList';
import ParadasMap from './ParadasMap';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import {
    MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import {Provincia, Region} from '../../features/dashboard/presentation/types/LocationType';

interface ParadasFormProps {
    apiKey?: string;
}

const token = localStorage.getItem('token');

const ParadasForm: React.FC<ParadasFormProps> = () => {
    const apiKey = "AIzaSyCP27C35blbfm1I7J4jjEcoSb8rHf0JOY8";
    const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<Geometry, ParadaProperties>>({
        type: "FeatureCollection",
        features: [],
    });
    const [selectedParada, setSelectedParada] = useState<Parada | null>(null);
    const [showNewParadaForm, setShowNewParadaForm] = useState(false);
    const [newParada, setNewParada] = useState<Parada>({
        nombreParada: "",
        descripcion: "",
        latitud: 0,
        longitud: 0,
        estado: "Activo",
        regionId: 0,
        provinciaId: 0,
        provincia: "",
        municipioId: 0,
        municipioNombre: "",
        rutaId: 0,
    });
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [municipios, setMunicipios] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState<ParadaFeature | null>(null);
    const [regiones, setRegiones] = useState<Region[]>([]);
    const [regionId] = useState(0);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'mapa' | 'lista'>('mapa');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchRegiones = async () => {
            try {
                const response = await axios.get<Region[]>("https://localhost:7251/api/Regiones");
                setRegiones(response.data);
            } catch (error) {
                console.error("Error al obtener las regiones:", error);
            }
        };

        fetchRegiones();
    }, []);
    useEffect(() => {
        const fetchParadas = async () => {
            try {
                const response = await axios.get("https://localhost:7251/api/Paradas/geojson/paradas", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = response.data as any;

                const features = data.features?.$values || data.features;

                if (features && Array.isArray(features)) {
                    const paradaFeatures = features.map((feature: any) => ({
                        type: "Feature" as const,
                        properties: {
                            nombreParada: feature.properties?.nombreParada || "",
                            descripcion: feature.properties?.descripcion || "",
                            estado: feature.properties?.estado || "",
                            provinciaId: feature.properties?.provinciaId || 0,
                            provincia: feature.properties?.provincia || "",
                            municipioId: feature.properties?.municipioId || 0,
                            municipioNombre: feature.properties?.municipioNombre || "",
                            rutaId: feature.properties?.rutaId || 0,
                        },
                        geometry: {
                            type: "Point" as const,
                            coordinates: [
                                parseFloat(feature.geometry?.coordinates[0]),
                                parseFloat(feature.geometry?.coordinates[1])
                            ] as [number, number],
                        },
                    }));

                    const geoJson: FeatureCollection<Geometry, ParadaProperties> = {
                        type: "FeatureCollection",
                        features: paradaFeatures,
                    };

                    setGeoJsonData(geoJson);
                }
            } catch (error) {
                console.error("Error al obtener las paradas:", error);
            }
        };

        fetchParadas();
        if (regionId) {
            fetchProvincias(regionId);
        }
    }, [regionId]);

    const handleSelectParada = async (paradaFeature: ParadaFeature) => {
        const parada: Parada = {
            nombreParada: paradaFeature.properties.nombreParada,
            descripcion: paradaFeature.properties.descripcion,
            latitud: paradaFeature.geometry.type === 'Point' ? paradaFeature.geometry.coordinates[1] : 0,
            longitud: paradaFeature.geometry.type === 'Point' ? paradaFeature.geometry.coordinates[0] : 0,
            estado: paradaFeature.properties.estado,
            regionId: paradaFeature.properties.regionId,
            provinciaId: paradaFeature.properties.provinciaId,
            provincia: paradaFeature.properties.provincia,
            municipioId: paradaFeature.properties.municipioId,
            municipioNombre: paradaFeature.properties.municipioNombre,
            rutaId: paradaFeature.properties?.rutaId,
        };

        setSelectedParada(parada);
        setNewParada(parada);
        setIsEditMode(true);
        setShowNewParadaForm(true);

        if (parada.regionId) {
            await fetchProvincias(parada.regionId);
        }
        if (parada.provinciaId) {
            await fetchMunicipios(parada.provinciaId);
        }
    };

    const handleAddParada = () => {
        setNewParada({
            nombreParada: "",
            descripcion: "",
            latitud: 0,
            longitud: 0,
            estado: "Activo",
            regionId: 0,
            provinciaId: 0,
            provincia: "",
            municipioId: 0,
            municipioNombre: "",
            rutaId: 0,
        });
        setIsEditMode(false);
        setShowNewParadaForm(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setNewParada(prevState => ({
            ...prevState,
            [name]: name === 'estado'
                ? value === 'Activo'
                : name === 'provinciaId' || name === 'municipioId' || name === 'latitud' || name === 'longitud'
                ? Number(value)
                : value
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // objeto para ajustar ciertos datos, en el futuro se quitará pq se ajustará en el BE
        const { provincia, ...paradaData } = { 
            ...newParada, 
            estado: true, 
            rutaId: newParada.rutaId === undefined || newParada.rutaId === 0 ? null : newParada.rutaId 
        };
        delete paradaData.municipioNombre;

        const payload = [
            { op: "replace", path: "/nombreParada", value: paradaData.nombreParada },
            { op: "replace", path: "/descripcion", value: paradaData.descripcion },
            { op: "replace", path: "/latitud", value: paradaData.latitud },
            { op: "replace", path: "/longitud", value: paradaData.longitud },
            { op: "replace", path: "/estado", value: paradaData.estado },
            { op: "replace", path: "/municipioId", value: paradaData.municipioId },
            { op: "replace", path: "/rutaId", value: paradaData.rutaId }
        ];
    
        try {
            if (isEditMode && selectedParada) {
                await axios.patch(`https://localhost:7251/api/Paradas/update/${selectedParada.paradaId}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json-patch+json'
                    }
                });
                console.log("Parada actualizada:", paradaData);
            } else {
                const response = await axios.post("https://localhost:7251/api/Paradas", paradaData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Nueva parada registrada:", response.data);
            }
    
            setShowNewParadaForm(false);
        } catch (error) {
            console.error("Error registrando la nueva parada:", error);
        }
    };

    const fetchProvincias = async (regionId: number) => {
        try {
            const response = await axios.get<any>(`https://localhost:7251/api/Provincias/provincias/${regionId}`);
            setProvincias(response.data);
        } catch (error) {
            console.error("Error al obtener las provincias:", error);
        }
    };

    const fetchMunicipios = async (provinciaId: number) => {
        try {
            const response = await axios.get<any>(`https://localhost:7251/api/Municipios/municipios/${provinciaId}`);
            setMunicipios(response.data);
        } catch (error) {
            console.error("Error al obtener municipios:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 mx-6 mt-2">
            <div className="flex-1">
                <div className="flex-1 no-scrollbar">
                    <div className="max-w-full mx-auto p-6 space-y-4 bg-white border rounded-md shadow-sm h-[835px]">
                        <div className="p-6">
                            <div className="sm:flex sm:items-center">
                                <div className="flex items-center space-x-4 mb-4">
                                    <h1 className="text-3xl font-medium">
                                        Registro de Paradas
                                    </h1>
                                    <div className="flex space-x-2 rounded-xl bg-[#004AAB]/20 p-1">
                                        <button
                                            className={`py-2 px-4 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${selectedTab === 'mapa' ? 'bg-white shadow-md' : 'text-[#004AAB] hover:bg-blue-50'}`}
                                            onClick={() => setSelectedTab('mapa')}
                                        >
                                            Mapa
                                        </button>
                                        <button
                                            className={`py-2 px-4 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${selectedTab === 'lista' ? 'bg-white shadow-md' : 'text-[#004AAB] hover:bg-blue-50'}`}
                                            onClick={() => setSelectedTab('lista')}
                                        >
                                            Lista de Paradas
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {selectedTab === 'mapa' && (
                                <div className="mt-4 flex flex-col items-center">
                                    <ParadasMap
                                        apiKey={apiKey}
                                        geoJsonData={geoJsonData}
                                        selectedMarker={selectedMarker}
                                        setSelectedMarker={setSelectedMarker}
                                        handleSelectParada={handleSelectParada}
                                    />
                                </div>
                            )}
                            {selectedTab === 'lista' && (
                                <>
                                    <div className="mb-6 flex justify-between items-center">
                                        <div className="relative w-72">
                                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar paradas..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1); // Reset page to 1 on search
                                                }}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleAddParada}
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue-light px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                                            >
                                                <PlusIcon className="h-6 w-6 mr-2" />
                                                Agregar Parada
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
                                    <div className="mt-4 flex flex-col">
                                        <ParadasList
                                            searchTerm={searchTerm}
                                            currentPage={currentPage}
                                            itemsPerPage={itemsPerPage}
                                            handlePageChange={setCurrentPage}
                                            token={token}
                                            handleEditParada={handleSelectParada}
                                        />
                                    </div>
                                </>
                            )}
                            {selectedParada && (
                                <div className="mt-4 p-6 bg-white border rounded-md shadow-sm">
                                    <h2 className="text-2xl font-medium mb-4">{selectedParada.nombreParada}</h2>
                                    <p className="mb-2"><strong>Descripción:</strong> {selectedParada.descripcion}</p>
                                    <p className="mb-2"><strong>Latitud:</strong> {selectedParada.latitud}</p>
                                    <p className="mb-2"><strong>Longitud:</strong> {selectedParada.longitud}</p>
                                    <p className="mb-2"><strong>Estado:</strong> {selectedParada.estado ? 'Activo' : 'Inactivo'}</p>
                                    <p className="mb-2"><strong>Provincia:</strong> {selectedParada.provincia}</p>
                                    <p className="mb-2"><strong>Municipio:</strong> {selectedParada.municipioNombre}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ParadasModal
                show={showNewParadaForm}
                onClose={() => setShowNewParadaForm(false)}
                onSubmit={handleFormSubmit}
                parada={newParada}
                handleFormChange={handleFormChange}
                regiones={regiones}
                provincias={provincias}
                municipios={municipios}
                fetchProvincias={fetchProvincias}
                fetchMunicipios={fetchMunicipios}
                isEditMode={isEditMode}
            />
        </div>
    );
};

export default ParadasForm;