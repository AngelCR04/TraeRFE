// RoleModal Component
import { Switch } from '@headlessui/react';
import { KeyIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Permissions = { [key: string]: boolean };
interface RoleModalProps {
  isOpen: boolean;
  closeModal: () => void;
  roleName: string;
  setRoleName: (name: string) => void;
  permissions: Permissions;
  setPermissions: (permissions: Permissions) => void;
  togglePermission: (permission: string) => void;
  handleSaveRole: () => void;
  handleSaveEditedRole: () => void;
  isEditMode: boolean;
  activo: boolean;
  setActivo: (activo: boolean) => void;
  rolPermisos?: number[]; 
}

const RoleModal: React.FC<RoleModalProps> = ({
  //isOpen,
  closeModal,
  roleName,
  setRoleName,
  permissions,
  //setPermissions,
  togglePermission,
  handleSaveRole,
  handleSaveEditedRole,
  isEditMode,
  activo,
  setActivo,
 // rolPermisos = [],
}) => {
  const [permissionsList, setPermissionsList] = useState<{ permisoId: number; nombrePermiso: string }[]>([]);

  // Cargar permisos desde la API
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await axios.get('https://localhost:7251/api/Permisos');
        setPermissionsList(response.data);
      } catch (error) {
        console.error('Error al obtener los permisos:', error);
      }
    };

    fetchPermissions();
  }, []);

  const handleSaveRoleWithPermissions = () => {
    if (isEditMode) {
      handleSaveEditedRole();
    } else {
      handleSaveRole();
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-start justify-center mt-12 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6 w-full max-w-3xl">
        <div className="flex items-center gap-2">
          <KeyIcon className="w-7 h-7 text-gray-600" />
          <h2 className="text-2xl font-bold">{isEditMode ? 'Editar Rol' : 'Agregar Rol'}</h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col py-2 rounded-md w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Permisos</label>
            <div className="mt-2 space-y-2">
              {permissionsList.map((perm) => (
                <div key={perm.permisoId} className="flex items-center">
                  <Switch
                    checked={permissions[perm.nombrePermiso] || false}
                    onChange={() => togglePermission(perm.nombrePermiso)}
                    className={`${permissions[perm.nombrePermiso] ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11`}
                  >
                    <span className="sr-only">{perm.nombrePermiso}</span>
                    <span
                      className={`${permissions[perm.nombrePermiso] ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full`}
                    />
                  </Switch>
                  <span className="ml-3 text-sm text-gray-700">{perm.nombrePermiso.charAt(0).toUpperCase() + perm.nombrePermiso.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
          {isEditMode && (
            <div className="mt-4 py-2">
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <select
                value={activo ? 'activo' : 'inactivo'}
                onChange={(e) => setActivo(e.target.value === 'activo')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveRoleWithPermissions}
            className="px-4 py-2 text-sm font-medium text-white bg-custom-blue-light rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;