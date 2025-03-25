import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, PencilSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import RoleModal from './RoleModal';

export default function RolesModule() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});
  const [activo, setActivo] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  const [roles, setRoles] = useState<Rol[]>([]);
  const [totalRoles, setTotalRoles] = useState<number>(0);
  const [allPermissions, setAllPermissions] = useState<Permiso[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;

  interface Rol {
    estado: string;
    rolId: number;
    rol: string;
    permisos: Permiso[];
    activo: boolean;
  }

  interface Permiso {
    permisoId: number;
    nombrePermiso: string;
  }

  useEffect(() => {
    fetchRoles();
    fetchAllPermissions();
  }, [currentPage, searchTerm]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`https://localhost:7251/api/Rol/paginated-list`, {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          searchTerm: searchTerm.trim(),
        },
      });
      setRoles(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalRoles(response.data.totalData);
      setActivo(response.data.data.estado === 'Activo');
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchAllPermissions = async () => {
    try {
      const response = await axios.get('https://localhost:7251/api/Permisos');
      setAllPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const togglePermission = (permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setRoleName('');
    setPermissions({});
    //setActivo(true);
    setSelectedRoleId(null);
  };

  const handleSaveRole = async () => {
    const selectedPermissionIds = Object.keys(permissions)
      .filter(key => permissions[key])
      .map(key => {
        const permiso = allPermissions.find(perm => perm.nombrePermiso === key);
        return permiso ? permiso.permisoId : undefined;
      })
      .filter(id => id !== undefined) as number[];
  

      //esta validacion hay q ponerla bajo el input -- estetica :)
    if (!roleName.trim()) {
      alert('El nombre del rol no puede estar vacío');
      return;
    }
  
    const newRole = {
      nombreRol: roleName,
      permisoIds: selectedPermissionIds,
      //estado: activo
    };
  
    try {
      console.log('Enviando datos para crear rol:', newRole);
      
      const response = await axios.post('https://localhost:7251/api/Rol/create', newRole);
      
      console.log('Rol creado correctamente:', response.data);
      fetchRoles();
      closeModal();
    } catch (error) {
      console.error('Error al crear el rol:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        console.error('Detalles del error:', error.response.data);
        alert(`Error al crear el rol: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Ocurrió un error al crear el rol');
      }
    }
  };
  
  const handleSaveEditedRole = async () => {
    if (!selectedRoleId) return;
    
    // Obtener los IDs de permisos seleccionados
    const selectedPermissionIds = Object.keys(permissions)
      .filter(key => permissions[key])
      .map(key => {
        const permiso = allPermissions.find(perm => perm.nombrePermiso === key);
        return permiso ? permiso.permisoId : undefined;
      })
      .filter(id => id !== undefined) as number[];
    
    // Crear documento de parche con solo las operaciones necesarias
    const patchDoc = [
      { op: 'replace', path: '/nombreRol', value: roleName },
      { op: 'replace', path: '/estado', value: activo ? true:false },
      { op: 'replace', path: '/permisoIds', value: selectedPermissionIds }
    ];
    
    try {
      const response = await axios.patch(
        `https://localhost:7251/api/Rol/${selectedRoleId}`,
        patchDoc,
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
        }
      );
      
      console.log('Rol actualizado correctamente:', response.data);
      fetchRoles();
      closeModal();
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Ocurrió un error al actualizar el rol');
      }
    }
  };
  
  const handleEditRole = (role: Rol) => {
    if (!role) return;
  
    setIsEditMode(true);
    setRoleName(role.rol);
    const newPermissions: { [key: string]: boolean } = {};
    role.permisos.forEach((perm) => {
      newPermissions[perm.nombrePermiso] = true;
    });
    setPermissions(newPermissions);
    setActivo(role.estado === 'Activo');
    setSelectedRoleId(role.rolId);
    openModal();
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRoles);

  return (
    <div className="flex h-screen bg-gray-50 mx-6 mt-2">
      <div className="flex-1">
        <div className="flex-1 overflow-auto">
          <div className="max-w-full mx-auto p-6 space-y-4 bg-white border rounded-md shadow-sm h-[835px]">
            <div className="p-6">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="p-2 font-heading text-3xl font-medium mb-2">Roles y permisos</h1>
                  <div className='mb-6 flex justify-between items-center'>
                    <div className='relative w-72'>
                      <input
                        type="text"
                        placeholder='Buscar rol...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-2'
                      />
                    </div>
                    <button
                      onClick={openModal}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue-light px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-[150px] h-[40px]"
                    >
                      <PlusIcon className="h-6 w-6 mr-2" />
                      Agregar rol
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex flex-col ">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-200">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 sm:pl-6">
                              Nombre del Rol
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                              Permisos
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                              Estado
                            </th>
                            <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {roles.map((role) => (
                            <tr key={role.rolId}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                {role.rol}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                {role.permisos.map((perm) => (
                                  <span key={perm.permisoId} className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold mr-2">
                                    {perm.nombrePermiso ? perm.nombrePermiso.charAt(0).toUpperCase() + perm.nombrePermiso.slice(1) : ''}
                                  </span>
                                ))}
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm flex items-center">
                                <span
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-center ${
                                    role.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {role.estado}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                <button
                                  onClick={() => handleEditRole(role)}
                                  className='text-custom-blue hover:text-blue-900 font-medium'
                                >
                                  <PencilSquareIcon className='w-5 h-5'/>
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
                          Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                          <span className="font-medium">{endIndex}</span> de <span className="font-medium">{totalRoles}</span> resultados
                        </p>
                      </div>
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
            {isOpen && (
              <RoleModal
                isOpen={isOpen}
                closeModal={closeModal}
                roleName={roleName}
                setRoleName={setRoleName}
                permissions={permissions}
                setPermissions={setPermissions}
                togglePermission={togglePermission}
                handleSaveRole={handleSaveRole}
                handleSaveEditedRole={handleSaveEditedRole}
                isEditMode={isEditMode}
                activo={activo}
                setActivo={setActivo}
                rolPermisos={roles.find(role => role.rolId === selectedRoleId)?.permisos.map(perm => perm.permisoId) || []}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
