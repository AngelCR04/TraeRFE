import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GeoJsonFeature, Ruta, TipoRuta, NewRuta, Parada, Escuela, Horario } from '../../features/dashboard/presentation/types/RutaType';
import RutasMap from './RutasMap';
import RutasList from './RutasList';
import RutasModal from './RutasModal';
import {
    MagnifyingGlassIcon,
    PlusIcon,
} from '@heroicons/react/24/solid';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { Region, Provincia, Municipio } from '../../features/dashboard/presentation/types/LocationType';
import { Autobus } from '../../features/dashboard/presentation/types/AutobusType';
import { Personal } from '../../features/dashboard/presentation/types/PersonalType';

//Tipo especial pa escuelas, el definido en RutaType tiene más campos que no necesito
interface CentroEducativo {
    centroEducativoId: number;
    nombreCentro: string;
    municipioId: number;
}

interface ParadaOption {
    paradaId: number;
    nombreParada: string;
    municipio: string;
}


const RutasForm: React.FC = () => {
    const [rutas, setRutas] = useState<GeoJsonFeature[]>([]);
    const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
    const token = localStorage.getItem('token');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6;
    const [selectedTab, setSelectedTab] = useState<'mapa' | 'lista'>('mapa');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editRuta, setEditRuta] = useState<Ruta | null>(null);
    const [newRuta, setNewRuta] = useState<NewRuta>({
        tipoRutaId: 0,
        nombreRuta: '',
        descripcion: '',
        regionId: 0,
        estado: 0,
        color: '#000000',
        paradas: [],
        centroEducativoIds: [],
        horariosIds: [],
        personalIds: [],
        autobusIds: [],
    });
    const [tiposRuta, setTiposRuta] = useState<TipoRuta[]>([]);
    const [centrosEducativos, setCentrosEducativos] = useState<CentroEducativo[]>([]);
    const [paradas, setParadas] = useState<ParadaOption[]>([]);
    const [regiones, setRegiones] = useState<Region[]>([]);
    const [provincias, setProvincias] = useState<Provincia[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [autobuses, setAutobuses] = useState<Autobus[]>([]);
    const [conductores, setConductores] = useState<Personal[]>([]);
    const [auxiliares, setAuxiliares] = useState<Personal[]>([]);

    const fetchRutas = async () => {
        try {
            const response = await axios.get(
                'https://localhost:7251/api/Ruta/geojson/rutas',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Respuesta completa:', response.data);

            if (response.data && response.data.features) {
                const data = response.data.features.map((feature: GeoJsonFeature) => {
                    console.log('Coordenadas de la ruta:', feature.geometry.coordinates);
                    const coordenadas = feature.geometry.coordinates.map((coord: number[]) => ({
                        lat: Number(coord[1]),
                        lng: Number(coord[0]),
                    }));

                    return {
                        ...feature,
                        properties: {
                            ...feature.properties,
                            coordenadas: coordenadas,
                        },
                    };
                });

                console.log('Rutas procesadas:', data);
                setRutas(data);
            }
        } catch (error) {
            console.error('Error fetching rutas:', error);
        }
    };

    useEffect(() => {
        fetchRutas();
        fetchTiposRuta();
        fetchCentrosEducativos();
        fetchParadas();
        fetchRegiones();
        fetchHorarios();
        fetchAutobuses();
        fetchPersonal();
    }, []);

    const fetchTiposRuta = async () => {
        try {
            const response = await axios.get(
                'https://localhost:7251/api/Ruta/TipoRuta',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setTiposRuta(response.data);
        } catch (error) {
            console.error('Error fetching tipos de ruta:', error);
        }
    };

    const fetchCentrosEducativos = async () => {
        try {
            const [disponiblesResponse, rutaResponse] = await Promise.all([
                axios.get('https://localhost:7251/api/Ruta/CentrosEducativos', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }),
                //para el caso de edicion tengo q cargar tambien las escuelas que pertenecen a la ruta
                editRuta ? axios.get(`https://localhost:7251/api/Ruta/${editRuta.rutaId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }) : Promise.resolve({ data: { escuelas: [] } })
            ]);

            const disponibles = disponiblesResponse.data;
            const rutaEscuelas = rutaResponse.data.escuelas;

            const allEscuelas = [...disponibles, ...rutaEscuelas.filter((re: Escuela) => !disponibles.some((de: Escuela) => de.centroEducativoId === re.centroEducativoId))];
            setCentrosEducativos(allEscuelas);
        } catch (error) {
            console.error('Error fetching centros educativos:', error);
        }
    };

    const fetchParadas = async () => {
        try {
            const [disponiblesResponse, rutaResponse] = await Promise.all([
                axios.get('https://localhost:7251/api/Paradas/disponibles', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }),
                //de nuevo, en caso d edicion debo cargar las paradas que pertenecen a la ruta
                editRuta ? axios.get(`https://localhost:7251/api/Ruta/${editRuta.rutaId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }) : Promise.resolve({ data: { paradas: [] } })
            ]);

            const disponibles = disponiblesResponse.data;
            const rutaParadas = rutaResponse.data.paradas;

            const allParadas = [...disponibles, ...rutaParadas.filter((rp: Parada) => !disponibles.some((dp: Parada) => dp.paradaId === rp.paradaId))];
            setParadas(allParadas);
        } catch (error) {
            console.error('Error fetching paradas:', error);
        }
    };

    const fetchRegiones = async () => {
        try {
            const response = await axios.get(
                'https://localhost:7251/api/Regiones',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setRegiones(response.data);
        } catch (error) {
            console.error('Error fetching regiones:', error);
        }
    };

    const fetchHorarios = async () => {
        try {
            const response = await axios.get(
                'https://localhost:7251/api/Horarios/data',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setHorarios(response.data);
        } catch (error) {
            console.error('Error fetching horarios:', error);
        }
    };

    const fetchAutobuses = async () => {
        try {
            const response = await axios.get(
                'https://localhost:7251/api/Autobus/disponibles?pageNumber=1&pageSize=10',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setAutobuses(response.data.data);
        } catch (error) {
            console.error('Error fetching autobuses:', error);
        }
    };

    const fetchPersonal = async () => {
        try {
            const response = await axios.get(
                'https://localhost:7251/api/Personal/personal-sin-asignar?pageNumber=1&pageSize=10',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const personalData = response.data.data;
            setConductores(personalData.filter((p: Personal) => p.tipoPersonal === 'Conductor'));
            setAuxiliares(personalData.filter((p: Personal) => p.tipoPersonal === 'Auxiliar'));
        } catch (error) {
            console.error('Error fetching personal:', error);
        }
    };

    const fetchProvincias = async (regionId: number) => {
        try {
            const response = await axios.get(
                `https://localhost:7251/api/Provincias/provincias/${regionId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setProvincias(response.data);
        } catch (error) {
            console.error('Error fetching provincias:', error);
        }
    };

    const fetchMunicipios = async (provinciaId: number) => {
        try {
            const response = await axios.get(
                `https://localhost:7251/api/Municipios/municipios/${provinciaId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMunicipios(response.data);
        } catch (error) {
            console.error('Error fetching municipios:', error);
        }
    };

    const handleMarkerClick = (ruta: Ruta) => {
        setSelectedRuta(ruta);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleAddRuta = async () => {
        try {
            const payload = {
                tipoRutaId: newRuta.tipoRutaId,
                nombreRuta: newRuta.nombreRuta,
                descripcion: newRuta.descripcion,
                regionId: newRuta.regionId,
                estado: 1,
                color: newRuta.color,
                paradas: newRuta.paradas,
                centroEducativoIds: newRuta.centroEducativoIds,
                horariosIds: newRuta.horariosIds,
                personalIds: newRuta.personalIds,
                autobusIds: newRuta.autobusIds,
            };

            console.log('Payload:', payload);

            const response = await axios.post('https://localhost:7251/api/Ruta/create', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response:', response);

            if (response.status === 201) {
                console.log('Ruta creada exitosamente:', response.data);
                setIsModalOpen(false);
                setNewRuta({
                    tipoRutaId: 0,
                    nombreRuta: '',
                    descripcion: '',
                    regionId: 0,
                    estado: 1,
                    color: '#000000',
                    paradas: [],
                    centroEducativoIds: [],
                    horariosIds: [],
                    personalIds: [],
                    autobusIds: [],
                });
                fetchRutas();
            } else {
                console.error('Error al crear la ruta:', response.data);
            }
        } catch (error) {
            console.error('Error al crear la ruta:', error);
        }
    };

    const handleSaveEdit = () => {
        //Aqui se va a aplicar la lógica pa el update, still working it out en el BE
        setIsModalOpen(false);
    };

    const handleEditRuta = (ruta: Ruta) => {
        setEditRuta(ruta);
        setIsModalOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 mx-2 sm:mx-6 mt-2">
            <div className="flex-1">
                <div className="flex-1">
                    <div className="max-w-full mx-auto p-3 sm:p-6 space-y-2 sm:space-y-4 bg-white border rounded-md shadow-sm">
                        <div className="p-2 sm:p-6">
                            <div className="sm:flex sm:items-center">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                                    <h1 className="p-1 sm:p-2 font-heading text-2xl sm:text-3xl font-medium">
                                        Registro de Rutas
                                    </h1>
                                    <div className="flex space-x-2 rounded-xl bg-[#004AAB]/20 p-1">
                                        <button
                                            className={`py-1 sm:py-2 px-2 sm:px-4 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${selectedTab === 'mapa' ? 'bg-white shadow-md' : 'text-[#004AAB] hover:bg-blue-50'}`}
                                            onClick={() => setSelectedTab('mapa')}
                                        >
                                            Mapa
                                        </button>
                                        <button
                                            className={`py-1 sm:py-2 px-2 sm:px-4 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${selectedTab === 'lista' ? 'bg-white shadow-md' : 'text-[#004AAB] hover:bg-blue-50'}`}
                                            onClick={() => setSelectedTab('lista')}
                                        >
                                            Lista de Rutas
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {selectedTab === 'mapa' && (
                                <div className="mt-2 sm:mt-4 flex flex-col items-center">
                                    {/* Tengo q ajustar bn un calculo para la responsividad del componente principál */}
                                    <div className="w-full h-[calc(100vh-8rem)]">
                                        <RutasMap rutas={rutas} onMarkerClick={handleMarkerClick} />
                                    </div>
                                </div>
                            )}
                            {selectedTab === 'lista' && (
                                <>
                                    <div className='mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0'>
                                        <div className='relative w-full sm:w-72'>
                                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Buscar rutas..."
                                                value={searchTerm}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue-light px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                                            >
                                                <PlusIcon className="h-5 w-5 mr-1 sm:h-6 sm:w-6 sm:mr-2" />
                                                <span className="whitespace-nowrap">Agregar Ruta</span>
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-700 px-3 sm:px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 w-auto sm:w-[165px] h-[40px]"
                                            >
                                                <FaFilePdf className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                                <span className="whitespace-nowrap">Exportar a PDF</span>
                                            </button>
                                            <button
                                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-700 px-3 sm:px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 w-auto sm:w-[165px] h-[40px]"
                                            >
                                                <FaFileExcel className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                                                <span className="whitespace-nowrap">Exportar a Excel</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:mt-4 flex flex-col">
                                        <RutasList
                                            searchTerm={searchTerm}
                                            currentPage={currentPage}
                                            itemsPerPage={itemsPerPage}
                                            handlePageChange={handlePageChange}
                                            token={token}
                                            handleEditRuta={handleEditRuta}
                                        />
                                    </div>
                                </>
                            )}
                            {selectedRuta && (
                                <div className="mt-4 p-3 sm:p-6 bg-white border rounded-md shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-4">{selectedRuta.nombreRuta}</h2>
                                    <p className="mb-2"><strong>Descripción:</strong> {selectedRuta.descripcion}</p>
                                    <p className="mb-2"><strong>Color:</strong> {selectedRuta.color}</p>
                                    <p className="mb-2"><strong>Paradas:</strong></p>
                                    <ul className="list-disc list-inside mb-4 max-h-[200px]">
                                        {selectedRuta.paradas.map((parada, index) => (
                                            <li key={index}>{parada}</li>
                                        ))}
                                    </ul>
                                    <p className="mb-2"><strong>Escuelas:</strong></p>
                                    <ul className="list-disc list-inside mb-4 max-h-[200px]">
                                        {selectedRuta.centroEducativoIds.map((id, index) => (
                                            <li key={index}>{id}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <RutasModal
                isOpen={isModalOpen}
                editRuta={editRuta}
                newRuta={newRuta}
                tiposRuta={tiposRuta}
                centrosEducativos={centrosEducativos as Escuela[]}
                paradas={paradas as Parada[]}
                regiones={regiones}
                provincias={provincias}
                municipios={municipios}
                horarios={horarios}
                autobuses={autobuses}
                conductores={conductores as Personal[]}
                auxiliares={auxiliares as Personal[]}
                onClose={() => setIsModalOpen(false)}
                handleSaveEdit={handleSaveEdit}
                handleAddRuta={handleAddRuta}
                setEditRuta={setEditRuta}
                setNewRuta={setNewRuta as any}
                fetchProvincias={fetchProvincias}
                fetchMunicipios={fetchMunicipios}
            />
        </div>
    );
}

export default RutasForm;