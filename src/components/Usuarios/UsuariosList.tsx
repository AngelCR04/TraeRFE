import React, { useState, useEffect } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircleIcon, 
    UserCircleIcon, 
    AtSymbolIcon, 
    KeyIcon, 
    UserPlusIcon,
    PencilSquareIcon,
    PlusIcon,
} from '@heroicons/react/24/solid';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

//Optimizar código, separar modal y table en otro componente
interface Usuario {
    usuarioId: number;
    rol: string;
    rolId: number;
    correo: string;
    estado: string;
    personalId: number;
    nombreCompleto: string;
    fechaCreacion: string;
}

interface Personal {
    personalId: number;
    nombreCompleto: string;
}

interface Rol {
    rolId: number;
    rol: string;
}

type SortConfig = {
    key: keyof Usuario;
    direction: 'asc' | 'desc';
};

export default function UsuariosTable() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const[totalUsuarios,setTotalUsuarios] = useState<number>(0);
    const [personal, setPersonal] = useState<Personal[]>([]);
    const [personalLibre, setPersonalLibre] = useState<Personal[]>([]);
    const [roles, setRoles] = useState<Rol[]>([]);
    const [, setLoading] = useState<boolean>(true);
    const [, setError] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'usuarioId', direction: 'asc' });
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [editUsuario, setEditUsuario] = useState<Usuario | null>(null);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const [newUsuario, setNewUsuario] = useState({
        rolId: 0,
        correo: '',
        estado: 'Activo',
        personalId: 0,
    });

    const itemsPerPage = 8;
    const [totalPages, setTotalPages] = useState<number>(1);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsuarios();
        fetchPersonal();
        fetchRoles();
        fetchPersonalLibre();
    }, [currentPage]);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `https://localhost:7251/api/Usuarios/paginated-list?pageNumber=${currentPage}&pageSize=${itemsPerPage}&searchTerm=${searchTerm}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            const data = await response.json();
            setUsuarios(data.data);
            setTotalPages(data.totalPages);
            setTotalUsuarios(data.totalData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    const fetchPersonal = async () => {
        try {
            const response = await fetch('https://localhost:7251/api/Personal/admins/paginated-list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar personal');
    
            const data = await response.json();
            console.log('Datos del API Personal:', data);
    
            const formattedPersonal = data.data ? data.data.map((person: any) => ({
                personalId: person.personalId,
                nombreCompleto: person.nombreCompleto
            })) : [];
    
            setPersonal(formattedPersonal);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar personal');
        }
    };

    const fetchPersonalLibre = async () => {
        try {
            const response = await fetch('https://localhost:7251/api/Personal/admins-sin-user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar personal');
    
            const data = await response.json();
            console.log('Datos del API Personal:', data);
    
            const formattedPersonalLibre = data.data ? data.data.map((person: any) => ({
                personalId: person.personalId,
                nombreCompleto: person.nombreCompleto
            })) : [];
    
            setPersonalLibre(formattedPersonalLibre);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar personal');
        }
    };
    
    // Verificar datos cargados
    console.log(personalLibre);
    
    const fetchRoles = async () => {
        try {
            const response = await fetch('https://localhost:7251/api/Roles', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar roles');

            const data = await response.json();
            console.log('Datos del API de Roles:', data);

            const formattedRoles = data.map((role: any) => ({
                rolId: role.rolId,
                rol: role.rol,
            }));
            setRoles(formattedRoles);
        } catch (err) {
            console.error('Error al cargar roles:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar roles');
        }
    };
    const handleAddUsuario = async () => {
        try {
            const payload = {
                rolId: newUsuario.rolId,
                correo: newUsuario.correo,
                estado: newUsuario.estado === 'Activo',
                personalId: newUsuario.personalId,
            };
    
            console.log('Payload enviado:', JSON.stringify(payload));
    
            const response = await fetch('https://localhost:7251/api/Usuarios', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const data = await response.json();
                setErrors(data.errors || {});
                throw new Error('Error al agregar usuario');
            }
    
            setErrors({});
            await fetchUsuarios();
            setIsAddModalOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al agregar usuario');
        }
    };
    
    const handleEdit = async (usuarioId: number) => {
        try {
            const response = await fetch(`https://localhost:7251/api/Usuarios/${usuarioId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Error al cargar usuario');
    
            const usuarioData = await response.json();
            console.log('Raw API Response:', usuarioData);
    
            // Find rolId based on rol name
            const foundRole = roles.find(r => r.rol === usuarioData.rol);
            // Find personalId based on nombreCompleto
            const foundPersonal = personal.find(p => p.nombreCompleto === usuarioData.nombreCompleto);
    
            if (!foundRole || !foundPersonal) {
                throw new Error('No se encontró el rol o personal correspondiente');
            }
    
            const usuarioToEdit = {
                usuarioId: usuarioData.usuarioId,
                rolId: foundRole.rolId,
                rol: usuarioData.rol,
                correo: usuarioData.correo,
                estado: 'Activo',
                personalId: foundPersonal.personalId,
                nombreCompleto: usuarioData.nombreCompleto,
                fechaCreacion: usuarioData.fechaCreacion
            };
    
            console.log('Usuario a editar:', usuarioToEdit);
            setEditUsuario(usuarioToEdit);
            setIsEditModalOpen(true);
    
        } catch (err) {
            console.error('Error al cargar usuario:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar usuario');
        }
    };
    
    const handleSaveEdit = async () => {
        if (!editUsuario) return;
    
        try {
            const patchDoc = [
                {
                    "op": "replace",
                    "path": "/rolId",
                    "value": editUsuario.rolId
                },
                {
                    "op": "replace",
                    "path": "/correo",
                    "value": editUsuario.correo
                },
                {
                    "op": "replace",
                    "path": "/estado",
                    "value": editUsuario.estado === 'Activo'
                },
                {
                    "op": "replace",
                    "path": "/personalId",
                    "value": editUsuario.personalId
                }
            ];
    
            console.log('Enviando PATCH:', JSON.stringify(patchDoc));
    
            const response = await fetch(`https://localhost:7251/api/Usuarios/${editUsuario.usuarioId}`, {
                method: 'PATCH',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json-patch+json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(patchDoc)
            });
    
            if (!response.ok) {
                throw new Error('Error al editar usuario');
            }
    
            await fetchUsuarios();
            setIsEditModalOpen(false);
            setEditUsuario(null);
        } catch (err) {
            console.error('Error completo:', err);
            setError(err instanceof Error ? err.message : 'Error al editar usuario');
        }
    };

    const filteredUsuarios = usuarios.filter((usuario) =>
        Object.values(usuario).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return String(a[sortConfig.key]) > String(b[sortConfig.key]) ? 1 : -1;
        }
        return String(a[sortConfig.key]) < String(b[sortConfig.key]) ? 1 : -1;
    });
    const startIndex = (currentPage - 1) * itemsPerPage;
    //problema paginacion
    const paginatedUsuarios = sortedUsuarios.slice(startIndex, startIndex + itemsPerPage);

    // Función para generar correo con iniciales en mayúscula
    const generateEmail = (nombreCompleto: string) => {
        const [nombre, apellido] = nombreCompleto.toLowerCase().split(' ');
        const nombreCapitalizado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
        const inicialApellido = apellido.charAt(0).toUpperCase();
        return `${nombreCapitalizado}${inicialApellido}@trae.rd`;
    };


    const handlePersonalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const personalId = parseInt(e.target.value);
        const selectedPerson = personal.find((p: Personal) => p.personalId === personalId);
        
        if (selectedPerson) {
            const generatedEmail = generateEmail(selectedPerson.nombreCompleto);
            
            if (editUsuario) {
                setEditUsuario(prev => prev && {
                    ...prev,
                    personalId: selectedPerson.personalId,
                    correo: generatedEmail,
                    nombreCompleto: selectedPerson.nombreCompleto
                });
            } else {
                setNewUsuario(prev => ({
                    ...prev,
                    personalId: selectedPerson.personalId,
                    correo: generatedEmail,
                    nombreCompleto: selectedPerson.nombreCompleto
                }));
            }
        }
    };
    

    const AddUserModal = () => (
        <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-start justify-center mt-10 z-50">  
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-[800px] max-w-full">
                <div className="flex items-center gap-2">
                    <UserPlusIcon className="w-7 h-7 text-gray-600" />
                    <h2 className="text-2xl font-bold">Agregar Usuario</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center border p-2 rounded-md w-full">
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        <select
                            value={newUsuario.personalId || ''}
                            onChange={(e) => {
                                const personalId = parseInt(e.target.value);
                                const selectedPerson = personalLibre.find(p => p.personalId === personalId);
                                if (selectedPerson) {
                                    const email = generateEmail(selectedPerson.nombreCompleto);
                                    setNewUsuario(prev => ({
                                        ...prev,
                                        personalId: selectedPerson.personalId,
                                        nombreCompleto: selectedPerson.nombreCompleto,
                                        correo: email
                                    }));
                                }
                            }}
                            className="w-full"
                        >
                            <option value="">Seleccione un nombre</option>
                            {personalLibre.map((person) => (
                                <option key={person.personalId} value={person.personalId}>
                                    {person.nombreCompleto}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.personalId && <p className="text-red-500 text-xs italic">{errors.personalId[0]}</p>}
    
                    <div className="flex items-center border p-2 rounded-md w-full">
                        <KeyIcon className="h-5 w-5 mr-2" />
                        <select
                            value={newUsuario.rolId || ''}
                            onChange={(e) => setNewUsuario(prev => ({ ...prev, rolId: parseInt(e.target.value) }))}
                            className="w-full"
                        >
                            <option value="" disabled>Selecciona un rol</option>
                            {roles.map((rol) => (
                                <option key={rol.rolId} value={rol.rolId}>
                                    {rol.rol}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.rolId && <p className="text-red-500 text-xs italic">{errors.rolId[0]}</p>}
    
                    <div className="flex items-center border p-2 rounded-md w-full bg-gray-100">
                        <AtSymbolIcon className="h-5 w-5 mr-2" />
                        <input
                            type="text"
                            placeholder="Correo"
                            value={newUsuario.personalId ? newUsuario.correo : ''}
                            readOnly
                            className="w-full"
                        />
                    </div>
                    {errors.correo && <p className="text-red-500 text-xs italic">{errors.correo[0]}</p>}
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => {
                            setIsAddModalOpen(false);
                            setNewUsuario({
                                rolId: 0,
                                correo: '',
                                estado: 'Activo',
                                personalId: 0,
                            });
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleAddUsuario}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
    
    const EditUserModal = () => (
        <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-start justify-center mt-10 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-[800px] max-w-full">
                <div className="flex items-center gap-2">
                    <PencilSquareIcon className="w-7 h-7 text-gray-600" />
                    <h2 className="text-2xl font-bold">Modificar Usuario</h2>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center border p-2 rounded-md w-full">
                        <UserCircleIcon className="h-5 w-5 mr-2" />
                        <select
                        value={editUsuario?.personalId}
                        onChange={(e) => {
                            const personalId = parseInt(e.target.value);
                            const selectedPerson = personal.find(p => p.personalId === personalId);
                            if (selectedPerson) {
                                const email = generateEmail(selectedPerson.nombreCompleto);
                                setEditUsuario(prev => prev && ({
                                    ...prev,
                                    personalId: selectedPerson.personalId,
                                    nombreCompleto: selectedPerson.nombreCompleto,
                                    correo: email
                                }));
                            }
                        }}
                        className="w-full"
                    >
                        <option value="">Seleccione un nombre</option>
                        {personal.map((person) => (
                            <option key={person.personalId} value={person.personalId}>
                                {person.nombreCompleto}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div className="flex items-center border p-2 rounded-md w-full">
                        <KeyIcon className="h-5 w-5 mr-2" />
                        <select
                        value={editUsuario?.rolId}
                        onChange={(e) => {
                            setEditUsuario(prev => prev && ({
                                ...prev,
                                rolId: parseInt(e.target.value)
                            }));
                        }}
                        className="w-full"
                    >
                        <option value="">Seleccione un rol</option>
                        {roles.map((rol) => (
                            <option key={rol.rolId} value={rol.rolId}>
                                {rol.rol}
                            </option>
                        ))}
                    </select>
                    </div>
    
                    <div className="flex items-center border p-2 rounded-md w-full bg-gray-50">
                        <AtSymbolIcon className="h-5 w-5 mr-2" />
                        <input
                            type="email"
                            value={editUsuario?.correo || ''}
                            readOnly
                            className="w-full"
                        />
                    </div>
    
                    <div className="flex items-center border p-2 rounded-md w-full">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        <select
                        value={editUsuario?.estado || 'Activo'}
                        onChange={(e) => setEditUsuario(prev => prev && ({
                            ...prev,
                            estado: e.target.value
                        }))}
                        className="w-full"
                    >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                    </select>
                    </div>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => {
                            setIsEditModalOpen(false);
                            setEditUsuario(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveEdit}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
    

return (
    <div className="flex h-screen bg-gray-50 mx-6 mt-2">
        {/* Main Content */}
        <div className="flex-1">
            {/* Main Content Area */}
            <div className="flex-1 overflow-auto">
                <div className=" max-w-full mx-auto p-6 space-y-4 bg-white border rounded-md shadow-sm h-[835px]">
                    <div className="p-6">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="p-2 font-heading text-3xl font-medium mb-2">Registro de Usuarios</h1>
                                {/* Barra de búsqueda */}
                                <div className='mb-6 flex justify-between items-center'>
                                <div className='relative w-72'>
                                <MagnifyingGlassIcon className='w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                                <input
                                    type="text"
                                    placeholder='Buscar usuario...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-2'
                                />
                                </div>
                                <div className='relative w-72'>
                                    
                                    {/* AQUI AGREGAR FILTROS -- PENDIENTE */}
                                    {/* <span className=' font-semibold'>Filtrar por:</span>
                                     */}
                                </div>
                            </div>
                            {/* <p className="mt-2 text-sm text-gray-700">
                                Lista de usuarios registrados en el sistema
                            </p> */}
                        </div>

                                    <div className="mt-12 sm:ml-16 sm:flex sm:justify-end">
                                        <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue-light px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-[165px] h-[40px]"
                                        >
                                        <UserPlusIcon className="w-5 h-5 mr-2" />
                                        Nuevo usuario
                                        </button>
                                    </div>

                                    <div className="mt-12 sm:ml-2 sm:flex sm:justify-end">
                                        <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-[165px] h-[40px]"
                                        >
                                        <FaFilePdf className="w-5 h-5 mr-2" />
                                        Exportar a PDF
                                        </button>
                                    </div>

                                    <div className="mt-12 sm:ml-2 sm:flex sm:justify-end">
                                        <button
                                        onClick={() => setIsAddModalOpen(true)}
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
                                        <table className="min-w-full divide-y divide-gray-300 ">
                                            <thead className="bg-gray-200">
                                                <tr>
                                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-justify text-sm font-bold text-gray-900 sm:pl-6">
                                                        Nombre Completo
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900">
                                                        Correo
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900">
                                                        Rol
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900 ">
                                                        Estado
                                                    </th>
                                                    <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900">
                                                        Fecha de Creación
                                                    </th>
                                                   
                                                    <th scope="col" className="px-3 py-3.5 text-justify text-sm font-bold text-gray-900">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {sortedUsuarios.map((usuario) => (
                                                    <tr key={usuario.usuarioId}>
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                                            {usuario.nombreCompleto}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-justify">
                                                            {usuario.correo}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-justify">
                                                            {usuario.rol}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm flex items-center">
                                                            {/* <span
                                                            className={`inline-block w-3 h-3 rounded-full mr-2 ${
                                                                usuario.estado === 'Activo' ? 'bg-green-600' : 'bg-red-600'
                                                            }`}
                                                            ></span> */}
                                                            <span
                                                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-center ${
                                                                usuario.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}
                                                            >
                                                            {usuario.estado}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-justify">
                                                            {usuario.fechaCreacion}
                                                        </td>
                                                            
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-justify pl-8">
                                                            <button
                                                                onClick={() => handleEdit(usuario.usuarioId)}
                                                                className="text-custom-blue hover:text-blue-900 font-medium "
                                                            >
                                                                <PencilSquareIcon className="w-5 h-5" />
                                                                
                                                            </button>
                                                            
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                                            <div className="flex flex-1 justify-between sm:hidden">
                                                <button
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Anterior
                                                </button>
                                                <button
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                >
                                                    Siguiente
                                                </button>
                                            </div>
                                            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"> 
                                            <p className="text-sm text-gray-700">
                                                        Mostrando <span className="font-medium">{Math.min(startIndex + 1, totalUsuarios)}</span> a{' '}
                                                        <span className="font-medium">
                                                            {Math.min(startIndex + itemsPerPage, totalUsuarios)}
                                                        </span>{' '}
                                                        de <span className="font-medium">{totalUsuarios}</span> resultados
                                                    </p>
                                                </div>
                                            <div>
                                                <div>
                                                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                        <button
                                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                            disabled={currentPage === 1}
                                                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                        >
                                                            <span className="sr-only">Anterior</span>
                                                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                                        </button>
                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                            <button
                                                                key={page}
                                                                onClick={() => setCurrentPage(page)}
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
                                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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
                </div>
            </div>
        </div>

        {/* Renderizar los modales */}
        {isAddModalOpen && <AddUserModal />}
        {isEditModalOpen && <EditUserModal />}
    </div>
);
}
