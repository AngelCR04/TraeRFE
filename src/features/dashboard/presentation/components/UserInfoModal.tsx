import { useState } from "react";
import { Dialog, Tab } from "@headlessui/react";
import { useChangePassword } from "../hooks/useChangePassword";
import { CircularProgress } from "@mui/material";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon, UserCircleIcon, AtSymbolIcon, PhoneIcon, CalendarIcon, LockClosedIcon, KeyIcon, EyeIcon, EyeSlashIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface UserInfo {
  nombreCompleto: string;
  email: string;
  rol: string;
  estado: string;
  telefono?: string;
  fechaCreacion?: string;
}

interface UserInfoModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  userInfo: UserInfo;
}

type FormDataKeys = 'currentPassword' | 'newPassword' | 'confirmPassword';

export default function UserInfoModal({ isOpen, onRequestClose, userInfo }: UserInfoModalProps) {
  const { formData, error, success, isLoading, handleSubmit, handleChange } = useChangePassword();

  const [showPassword, setShowPassword] = useState<Record<FormDataKeys, boolean>>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const handleClickShowPassword = (field: FormDataKeys) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(" ");
    const initials = names.length > 1 ? `${names[0][0]}${names[1][0]}` : names[0][0];
    return initials.toUpperCase();
  };
  const renderEstadoIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "activo":
        return <CheckCircleIcon className="w-6 h-6 text-[#004AAB]" />;
      case "inactivo":
        return <XCircleIcon className="w-6 h-6 text-red-600" />;
      default:
        return <XCircleIcon className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <Dialog as="div" open={isOpen} onClose={onRequestClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 flex items-center justify-center p-6">
        <Dialog.Panel className="w-full max-w-lg bg-white shadow-lg p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              {/* avatar con iniciales del user */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#004AAB] to-teal-400 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
                {getInitials(userInfo.nombreCompleto)}
              </div>
              <div>
                <Dialog.Title className="text-2xl font-semibold text-gray-900">Perfil de Usuario</Dialog.Title>
                <p className="text-sm text-gray-600">{userInfo.rol}</p>
              </div>
            </div>
            <button onClick={onRequestClose} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <Tab.Group>
            <Tab.List className="flex space-x-2 rounded-xl bg-[#004AAB]/20 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full py-3 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${selected ? "bg-white shadow-md" : "text-[#004AAB] hover:bg-blue-50"}`
                }
              >
                Información
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full py-3 text-sm font-medium text-[#004AAB] rounded-lg focus:outline-none ${selected ? "bg-white shadow-md" : "text-[#004AAB] hover:bg-blue-50"}`
                }
              >
                Cambiar Contraseña
              </Tab>
            </Tab.List>

            <Tab.Panels className="mt-6">
              <Tab.Panel className="space-y-6">
                {/* info del usuario */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserCircleIcon className="w-6 h-6 text-[#004AAB]" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">Nombre Completo</span>
                      <p className="text-gray-900 font-semibold">{userInfo.nombreCompleto}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4" />

                  <div className="flex items-center space-x-3">
                    <AtSymbolIcon className="w-6 h-6 text-[#004AAB]" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">Email</span>
                      <p className="text-gray-900 font-semibold">{userInfo.email}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4" />

                  <div className="flex items-center space-x-3">
                    <KeyIcon className="w-6 h-6 text-[#004AAB]" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">Rol</span>
                      <p className="text-gray-900 font-semibold">{userInfo.rol}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4" />

                  <div className="flex items-center space-x-3">
                    <LockClosedIcon className="w-6 h-6 text-[#004AAB]" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">Estado</span>
                      <div className="flex items-center space-x-2">
                        {renderEstadoIcon(userInfo.estado)}
                        <p className="text-gray-900 font-semibold">{userInfo.estado}</p>
                      </div>
                    </div>
                  </div>
                  {userInfo.telefono && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="w-6 h-6 text-[#004AAB]" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Teléfono</span>
                          <p className="text-gray-900 font-semibold">{userInfo.telefono}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {userInfo.fechaCreacion && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="w-6 h-6 text-[#004AAB]" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Fecha de Creación</span>
                          <p className="text-gray-900 font-semibold">{userInfo.fechaCreacion}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Tab.Panel>

              <Tab.Panel>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {[ 
                    { name: "currentPassword", label: "Contraseña Actual" },
                    { name: "newPassword", label: "Nueva Contraseña" },
                    { name: "confirmPassword", label: "Confirmar Nueva Contraseña" }
                    ].map(({ name, label }) => (
                    <div key={name} className="flex flex-col shadow-sm relative">
                        <input
                        type={showPassword[name as FormDataKeys] ? "text" : "password"}
                        name={name}
                        id={name}
                        placeholder={label}
                        value={formData[name as FormDataKeys]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-b border-gray-300 focus:border-custom-blue focus:outline-none transition-all duration-300 hover:shadow-md"
                        required
                        />
                        <button
                        type="button"
                        onClick={() => handleClickShowPassword(name as FormDataKeys)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                        >
                        {showPassword[name as FormDataKeys] ? (
                            <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                            <EyeIcon className="w-5 h-5" />
                        )}
                        </button>
                    </div>
                    ))}
                    
                    <div className="flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onRequestClose}
                        className="w-full py-3 border border-gray-300 text-gray-800 font-semibold rounded-md bg-transparent hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#004AAB] text-white font-semibold rounded-md border border-transparent hover:bg-[#003D8F] focus:outline-none flex items-center justify-center gap-3"
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Cambiar Contraseña"}
                    </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 text-red-600 flex items-center">
                    <ExclamationCircleIcon className="w-6 h-6 mr-2" />
                    {error}
                    </div>
                )}
                {success && (
                    <div className="mt-4 text-green-600 flex items-center">
                    <CheckCircleIcon className="w-6 h-6 mr-2" />
                    {success}
                    </div>
                )}
                </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

