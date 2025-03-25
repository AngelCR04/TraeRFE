import React from "react";
import { Dialog } from "@headlessui/react";
import { useChangePassword } from "../hooks/useChangePassword";
import { CircularProgress } from "@mui/material";
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onRequestClose }) => {
  const { formData, error, success, isLoading, handleSubmit, handleChange } = useChangePassword();

  type FormDataKeys = 'currentPassword' | 'newPassword' | 'confirmPassword';

  return (
    <Dialog as="div" open={isOpen} onClose={onRequestClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-6">
        <Dialog.Panel className="w-full max-w-md bg-white shadow-lg p-8 border border-gray-300 rounded-md">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">Cambiar Contraseña</Dialog.Title>
            <button onClick={onRequestClose} className="text-gray-600 hover:text-gray-900 focus:outline-none">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
            {[{ name: "currentPassword", label: "Contraseña Actual" }, { name: "newPassword", label: "Nueva Contraseña" }, { name: "confirmPassword", label: "Confirmar Nueva Contraseña" }].map(({ name, label }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type="password"
                  name={name}
                  id={name}
                  placeholder={label}
                  value={formData[name as FormDataKeys]}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition duration-300 rounded-sm"
                  required
                />
              </div>
            ))}
          <form onSubmit={handleSubmit} className="space-y-6">
            {[{ name: "currentPassword", label: "Contraseña Actual" }, { name: "newPassword", label: "Nueva Contraseña" }, { name: "confirmPassword", label: "Confirmar Nueva Contraseña" }].map(({ name, label }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                <input
                  type="password"
                  name={name}
                  id={name}
                  placeholder={label}
                  value={formData[name as FormDataKeys]}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none transition duration-300 rounded-sm"
                  required
                />
              </div>
            ))}

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onRequestClose}
                className="w-full py-3 border border-gray-300 text-gray-800 font-semibold rounded-sm bg-transparent hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-sm border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center gap-3"
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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ChangePasswordModal;
