import { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    UserPlusIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { Tab } from '@headlessui/react';
import PersonalModal from './PersonalModal';
import { Personal, TipoDocumento, TipoPersonal, NewPersonal } from '../../features/dashboard/presentation/types/PersonalType';
import PersonalTable from './PersonalTable';

export default function PersonalTransporte() {
    const [, setLoading] = useState<boolean>(true);
    const [, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editPersonal, setEditPersonal] = useState<Personal | null>(null);
    const [tiposDocumento, setTiposDocumento] = useState<TipoDocumento[]>([]);
    const [tiposPersonal, setTiposPersonal] = useState<TipoPersonal[]>([]);
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    const [newPersonal, setNewPersonal] = useState<NewPersonal>({
        tipoPersonalId: 1,
        tipoPersonal: '',
        nombre: '',
        apellido: '',
        fechaNacimiento: new Date().toISOString(),
        sexo: '',
        documentoId: 1,
        documento: '',
        numeroDocumento: '',
        telefono: '',
        direccion: '',
        estado: 1,
        fechaContratacion: new Date().toISOString(),
        rutaId: null,
    });

    const itemsPerPage = 8;
    const [totalPages, setTotalPages] = useState(1);
    const [personal, setPersonal] = useState<Personal[]>([]);

    useEffect(() => {
        fetchPersonal(isAdmin ? 'admins' : 'aux-chof', currentPage, searchTerm);
        fetchTiposDocumento();
        fetchTiposPersonal();
    }, [isAdmin, currentPage, searchTerm]);

    const fetchPersonal = async (tipo: string, page: number, searchTerm: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`https://localhost:7251/api/Personal/${tipo}/paginated-list`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    pageNumber: page,
                    pageSize: itemsPerPage,
                    searchTerm: searchTerm
                }
            });

            const data = response.data;
            const personalData = Array.isArray(data.data) ? data.data : [];

            const formattedPersonalData = personalData.map((persona: any) => {
                const [nombre, ...apellidoArray] = persona.nombreCompleto.split(' ');
                const apellido = apellidoArray.join(' ');
                return {
                    personalId: persona.personalId,
                    tipoPersonalId: persona.tipoPersonalId,
                    tipoPersonal: persona.tipoPersonal,
                    nombre,
                    apellido,
                    nombreCompleto: persona.nombreCompleto,
                    fechaNacimiento: persona.fechaNacimiento,
                    fechaContratacion: persona.fechaContratacion,
                    sexo: persona.sexo,
                    documentoId: persona.documentoId,
                    documento: persona.documento,
                    numeroDocumento: persona.numeroDocumento,
                    telefono: persona.telefono,
                    direccion: persona.direccion,
                    estado: persona.estado,
                    rutaId: persona.rutaId
                };
            });

            console.log('Personal filtrado:', formattedPersonalData);
            setPersonal(formattedPersonalData);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(`Error al cargar personal de tipo ${tipo}:`, err);
            setError(err instanceof Error ? err.message : `Error al cargar personal de tipo ${tipo}`);
            setPersonal([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTiposDocumento = async () => {
        try {
            const response = await fetch('https://localhost:7251/api/Personal/TipoDocumento', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar tipos de documento');
    
            const data = await response.json();
            const tiposDocumentoData = data.$values ? data.$values : data;
            setTiposDocumento(tiposDocumentoData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar tipos de documento');
        }
    };

    const fetchTiposPersonal = async () => {
        try {
            const response = await fetch('https://localhost:7251/api/Personal/TipoPersonal', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar tipos de personal');
    
            const data = await response.json();
            setTiposPersonal(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar tipos de personal');
        }
    };

    const handleAddPersonal = async () => {
        try {
  
            const formatDate = (date : any) => {
                if (!date) return ""; // En caso de valores nulos
                const d = new Date(date);
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, "0"); // Mes en 2 dígitos
                const day = String(d.getDate()).padStart(2, "0"); // Día en 2 dígitos
                return `${year}-${month}-${day}`;
            };
            
            const payload = {
                tipoPersonalId: newPersonal.tipoPersonalId,
                nombre: newPersonal.nombre,
                apellido: newPersonal.apellido,
                fechaNacimiento: formatDate(newPersonal.fechaNacimiento),
                sexo: newPersonal.sexo,
                documentoId: newPersonal.documentoId,
                numeroDocumento: newPersonal.numeroDocumento,
                telefono: newPersonal.telefono,
                direccion: newPersonal.direccion,
                fechaContratacion: formatDate(newPersonal.fechaContratacion),
                estado: newPersonal.estado === 1,
                rutaId: newPersonal.rutaId || 0,
            };
            
            console.log('Payload de creación:', payload);
    
            const response = await fetch('https://localhost:7251/api/Personal/create', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json' 
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al agregar personal');
            }
    
            fetchPersonal(isAdmin ? 'admins' : 'aux-chof', 1, searchTerm);
            setIsModalOpen(false);
            resetNewPersonal();
        } catch (err) {
            console.error('Error al crear:', err);
            setError(err instanceof Error ? err.message : 'Error al agregar personal');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEdit = (personalId: number) => {
        const personalToEdit = personal.find((p) => p.personalId === personalId);
        if (personalToEdit) {
            console.log('Personal a editar:', personalToEdit);
    
            // Asegurarse de que tipoPersonalId y documentoId están definidos
            const tipoPersonal = tiposPersonal.find(tipo => tipo.descripcion === personalToEdit.tipoPersonal);
            const documento = tiposDocumento.find(doc => doc.documento === personalToEdit.documento);
    
            const updatedPersonalToEdit = {
                ...personalToEdit,
                tipoPersonalId: tipoPersonal ? tipoPersonal.tipoPersonalId : 0, 
                documentoId: documento ? documento.documentoId : 0 
            };
    
            console.log('Personal a editar actualizado:', updatedPersonalToEdit); 
            setEditPersonal(updatedPersonalToEdit);
            setIsModalOpen(true);
        }
    };

    const handleSaveEdit = async () => {
        if (!editPersonal || !editPersonal.personalId) {
            console.error('No hay ID de personal para editar:', editPersonal);
            return;
        }
    
        try {
            // Validar campos requeridos
            if (!editPersonal.tipoPersonalId || !editPersonal.nombre || !editPersonal.apellido) {
                throw new Error('Faltan campos requeridos');
            }
    
            const payload = [
                { op: "replace", path: "/tipoPersonalId", value: editPersonal.tipoPersonalId },
                { op: "replace", path: "/nombre", value: editPersonal.nombre },
                { op: "replace", path: "/apellido", value: editPersonal.apellido },
                { op: "replace", path: "/fechaNacimiento", value: editPersonal.fechaNacimiento },
                { op: "replace", path: "/fechaContratacion", value: editPersonal.fechaContratacion },
                { op: "replace", path: "/sexo", value: editPersonal.sexo },
                { op: "replace", path: "/documentoId", value: editPersonal.documentoId },
                { op: "replace", path: "/numeroDocumento", value: editPersonal.numeroDocumento },
                { op: "replace", path: "/telefono", value: editPersonal.telefono },
                { op: "replace", path: "/direccion", value: editPersonal.direccion },
                { op: "replace", path: "/estado", value: editPersonal.estado === "Activo" ? 1 : 0 },
                { op: "replace", path: "/rutaId", value: editPersonal.rutaId || null }
            ];
    
            console.log('ID del personal a editar:', editPersonal.personalId);
            console.log('Payload de edición:', payload);
    
            const response = await fetch(`https://localhost:7251/api/Personal/update/${editPersonal.personalId}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(JSON.stringify(errorData));
            }
    
            await fetchPersonal(isAdmin ? 'admins' : 'aux-chof', 1, searchTerm);
            setIsModalOpen(false);
            setEditPersonal(null);
        } catch (err) {
            console.error('Error completo al editar:', err);
            setError(err instanceof Error ? err.message : 'Error al editar personal');
        }
    };

    const resetNewPersonal = () => {
        setNewPersonal({
            tipoPersonalId: 1,
            tipoPersonal: '',
            nombre: '',
            apellido: '',
            fechaNacimiento: new Date().toISOString(),
            sexo: '',
            documentoId: 1,
            documento: '',
            numeroDocumento: '',
            telefono: '',
            direccion: '',
            estado: 1,
            fechaContratacion: new Date().toISOString(),
            rutaId: null
        });
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
                                        Registro de Personal
                                    </h1>
                                    <Tab.Group>
                                        <Tab.List className="flex space-x-2 rounded-xl bg-[#004AAB]/20 p-1">
                                            <Tab
                                                className={({ selected }) =>
                                                    `py-2 px-4 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${
                                                        selected
                                                            ? "bg-white shadow-md"
                                                            : "text-[#004AAB] hover:bg-blue-50"
                                                    }`
                                                }
                                                onClick={() => setIsAdmin(false)}
                                            >
                                                Auxiliares / Conductores
                                            </Tab>
                                            <Tab
                                                className={({ selected }) =>
                                                    `py-2 px-4 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${
                                                        selected
                                                            ? "bg-white shadow-md"
                                                            : "text-[#004AAB] hover:bg-blue-50"
                                                    }`
                                                }
                                                onClick={() => setIsAdmin(true)}
                                            >
                                                Administrativos
                                            </Tab>
                                        </Tab.List>
                                    </Tab.Group>
                                </div>
                            </div>
                            {/* Barra de búsqueda y botones */}
                            <div className='mb-6 flex justify-between items-center'>
                                <div className='relative w-72'>
                                    <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar personal..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setCurrentPage(1); // Reset page to 1 on search
                                        }}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div className="flex space-x-2 ">
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue-light px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                                    >
                                        <UserPlusIcon className="h-6 w-6 mr-2" />
                                        Agregar Personal
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
                                <PersonalTable personal={personal} handleEdit={handleEdit} />
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
                                                {Math.min((currentPage - 1) * itemsPerPage + 1, personal.length)}
                                            </span>{' '}
                                            a{' '}
                                            <span className="font-medium">
                                                {Math.min(currentPage * itemsPerPage, personal.length)}
                                            </span>{' '}
                                            de <span className="font-medium">{personal.length}</span>{' '}
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
            <PersonalModal
                isOpen={isModalOpen}
                editPersonal={editPersonal}
                newPersonal={newPersonal}
                onClose={() => setIsModalOpen(false)}
                handleSaveEdit={handleSaveEdit}
                handleAddPersonal={handleAddPersonal}
                setEditPersonal={setEditPersonal}
                setNewPersonal={setNewPersonal}
                tiposDocumento={tiposDocumento}
                tiposPersonal={tiposPersonal}
            />
        </div>
    );
}