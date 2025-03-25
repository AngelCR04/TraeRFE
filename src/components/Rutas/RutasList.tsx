import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/solid';

interface RutasListProps {
    searchTerm: string;
    currentPage: number;
    itemsPerPage: number;
    handlePageChange: (page: number) => void;
    token: string | null;
    handleEditRuta: (ruta: any) => void;
}

const RutasList: React.FC<RutasListProps> = ({ searchTerm, currentPage, itemsPerPage, handlePageChange, token, handleEditRuta }) => {
    const [rutas, setRutas] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedRuta, setSelectedRuta] = useState<any | null>(null);

    useEffect(() => {
        const fetchRutas = async () => {
            try {
                const response = await axios.get(
                    'https://localhost:7251/api/Ruta/lista/rutas',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                        params: {
                            pageNumber: currentPage,
                            pageSize: itemsPerPage,
                            searchTerm: searchTerm,
                        },
                    }
                );
                console.log('Respuesta completa:', response.data);

                if (response.data && response.data.data) {
                    setRutas(response.data.data);
                    setTotalPages(response.data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching rutas:', error);
            }
        };

        fetchRutas();
    }, [token, currentPage, itemsPerPage, searchTerm]);

    const handleRutaClick = (ruta: any) => {
        setSelectedRuta(ruta);
    };

    const closeModal = () => {
        setSelectedRuta(null);
    };

    return (
        <div className="z-0">
            {selectedRuta && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-white bg-opacity-30">
                    <div className="relative bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-[90%] sm:max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="absolute inset-0">
                            <img src="/traerd2.png" className="h-full w-full object-cover opacity-10" alt="Background" />
                        </div>
    
                        <div className="relative z-10 text-gray-900">
                            <h2 className="text-xl sm:text-3xl font-semibold tracking-wide text-gray-800 mb-2 sm:mb-4">
                                {selectedRuta.nombreRuta}
                            </h2>
                            
                            <p className="text-base sm:text-lg mb-2">
                                <span className="font-semibold text-gray-700">Descripción:</span> {selectedRuta.descripcion}
                            </p>
                            <p className="text-base sm:text-lg mb-2">
                                <span className="font-semibold text-gray-700">Color:</span> 
                                <span className="inline-block ml-2 w-4 h-4 rounded-full" style={{ backgroundColor: selectedRuta.color }}></span>
                            </p>
    
                            <div className="mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Paradas:</h3>
                                <ul className="space-y-1 pl-3 sm:pl-5 border-l-4 border-blue-500 max-h-[20vh] sm:max-h-[25vh] overflow-y-auto">
                                    {selectedRuta.paradas.map((parada: any, index: number) => (
                                        <li key={index} className="text-sm sm:text-base text-gray-700">• {parada.nombreParada}</li>
                                    ))}
                                </ul>
                            </div>
    
                            <div className="mb-3 sm:mb-4">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Escuelas:</h3>
                                <ul className="space-y-1 pl-3 sm:pl-5 border-l-4 border-green-500 max-h-[20vh] sm:max-h-[25vh] overflow-y-auto">
                                    {selectedRuta.escuelas.map((escuela: any, index: number) => (
                                        <li key={index} className="text-sm sm:text-base text-gray-700">• {escuela.nombreCentro}</li>
                                    ))}
                                </ul>
                            </div>
    
                            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4">
                                <button
                                    onClick={() => handleEditRuta(selectedRuta)}
                                    className="w-full sm:w-auto bg-yellow-500 text-white text-base sm:text-lg font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                                >
                                    Editar Ruta
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="w-full sm:w-auto bg-blue-600 text-white text-base sm:text-lg font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-4 sm: p-0 mx-auto max-w-7xl">
                {rutas.map((ruta, index) => (
                    <div
                        key={index}
                        className="group relative flex h-48 sm:h-72 w-full rounded-xl shadow-xl ring-gray-900/5 cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                        onClick={() => handleRutaClick(ruta)}
                    >
                        <div className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
                            <img src="/traerd1.jpg" className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110" alt="" />
                        </div>
                        <div className="absolute bottom-0 z-20 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white shadow-xl">{ruta.nombreRuta}</h1>
                            <h1 className="text-sm font-light text-gray-200 shadow-xl line-clamp-2">{ruta.descripcion}</h1>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-white px-4 py-3 gap-4">
                <div className="w-full sm:w-auto flex justify-between sm:hidden">
                    <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Siguiente
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, rutas.length)}</span>{' '}
                            a <span className="font-medium">{Math.min(currentPage * itemsPerPage, rutas.length)}</span>{' '}
                            de <span className="font-medium">{rutas.length}</span> resultados
                        </p>
                    </div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Anterior</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <div className="hidden sm:flex">
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
                        </div>
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                        >
                            <span className="sr-only">Siguiente</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default RutasList;