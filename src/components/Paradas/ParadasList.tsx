import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/solid';
import ParadasModal from './ParadasModal';

interface ParadasListProps {
    searchTerm: string;
    currentPage: number;
    itemsPerPage: number;
    handlePageChange: (page: number) => void;
    token: string | null;
    handleEditParada: (parada: any) => void;
}

const ParadasList: React.FC<ParadasListProps> = ({ searchTerm, currentPage, itemsPerPage, handlePageChange, token }) => {
    const [paradas, setParadas] = useState<any[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [selectedParada, setSelectedParada] = useState<any | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        const fetchParadas = async () => {
            try {
                const response = await axios.get(
                    'https://localhost:7251/api/Paradas/lista',
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
                    setParadas(response.data.data);
                    setTotalPages(response.data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching paradas:', error);
            }
        };

        fetchParadas();
    }, [token, currentPage, itemsPerPage, searchTerm]);

    const handleParadaClick = (parada: any) => {
        setSelectedParada(parada);
    };

    const closeModal = () => {
        setShowEditModal(false);
    };

    const handleEditClick = (parada: any) => {
        setSelectedParada(parada);
        setShowEditModal(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSelectedParada((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí puedes agregar la lógica para enviar los datos actualizados al servidor
        console.log('Parada actualizada:', selectedParada);
        closeModal();
    };

    return (
        <div className="relative z-0">
            {selectedParada && (
                <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-white bg-opacity-30">
                    <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg overflow-hidden">
                        {/* Fondo con imagen sutil */}
                        <div className="absolute inset-0">
                            <img src="/traerd2.png" className="h-full w-full object-cover opacity-10" alt="Background" />
                        </div>

                        {/* Contenido */}
                        <div className="relative z-10 text-gray-900">
                            <h2 className="text-3xl font-semibold tracking-wide text-gray-800 mb-4">
                                {selectedParada.nombreParada}
                            </h2>
                            
                            <p className="text-lg mb-2">
                                <span className="font-semibold text-gray-700">Descripción:</span> {selectedParada.descripcion}
                            </p>
                            <p className="text-lg mb-2">
                                <span className="font-semibold text-gray-700">Latitud:</span> {selectedParada.latitud}
                            </p>
                            <p className="text-lg mb-2">
                                <span className="font-semibold text-gray-700">Longitud:</span> {selectedParada.longitud}
                            </p>
                            <p className="text-lg mb-2">
                                <span className="font-semibold text-gray-700">Estado:</span> {selectedParada.estado ? 'Activo' : 'Inactivo'}
                            </p>
                            <p className="text-lg mb-2">
                                <span className="font-semibold text-gray-700">Provincia:</span> {selectedParada.provincia}
                            </p>
                            <p className="text-lg mb-2">
                                <span className="font-semibold text-gray-700">Municipio:</span> {selectedParada.municipio}
                            </p>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => handleEditClick(selectedParada)}
                                    className="bg-yellow-500 text-white text-lg font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300"
                                >
                                    Editar Parada
                                </button>
                                <button
                                    onClick={() => setSelectedParada(null)}
                                    className="bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && selectedParada && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white bg-opacity-30">
                    <ParadasModal
                        show={showEditModal}
                        onClose={closeModal}
                        onSubmit={handleFormSubmit}
                        parada={selectedParada}
                        handleFormChange={handleFormChange}
                        regiones={[]}
                        provincias={[]}
                        municipios={[]}
                        fetchProvincias={() => {}}
                        fetchMunicipios={() => {}}
                        isEditMode={true}
                    />
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 z-10">
                {paradas.map((parada, index) => (
                    <div
                        key={index}
                        className="group relative m-0 flex h-72 w-96 rounded-xl shadow-xl ring-gray-900/5 sm:mx-auto sm:max-w-lg cursor-pointer"
                        onClick={() => handleParadaClick(parada)}
                    >
                        <div className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
                            <img src="/traerd1.jpg" className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110" alt="" />
                        </div>
                        <div className="absolute bottom-0 z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                            <h1 className="font-serif text-2xl font-bold text-white shadow-xl">{parada.nombreParada}</h1>
                            <h1 className="text-sm font-light text-gray-200 shadow-xl">{parada.descripcion}</h1>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 z-10">
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
                                {Math.min((currentPage - 1) * itemsPerPage + 1, paradas.length)}
                            </span>{' '}
                            a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, paradas.length)}
                            </span>{' '}
                            de <span className="font-medium">{paradas.length}</span>{' '}
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
    );
};

export default ParadasList;