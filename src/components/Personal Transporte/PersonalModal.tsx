import React, { useState } from 'react';
import {
    PencilSquareIcon,
    UserPlusIcon,
    KeyIcon,
    UserIcon,
    DocumentIcon,
    DocumentMagnifyingGlassIcon,
    PhoneIcon,
    MapPinIcon,
    CheckCircleIcon,
    XCircleIcon,
    CalendarIcon,
} from '@heroicons/react/24/solid';
import { Personal, TipoDocumento, TipoPersonal, NewPersonal } from '../../features/dashboard/presentation/types/PersonalType';
import { validatePersonal, validateField } from './PersonalValidation';

interface PersonalModalProps {
    isOpen: boolean;
    editPersonal: Personal | null;
    newPersonal: NewPersonal;
    tiposPersonal: TipoPersonal[];
    tiposDocumento: TipoDocumento[];
    onClose: () => void;
    handleSaveEdit: () => void;
    handleAddPersonal: () => void;
    setEditPersonal: (value: Personal | null) => void;
    setNewPersonal: (value: NewPersonal) => void;
}

const PersonalModal: React.FC<PersonalModalProps> = ({
    isOpen,
    editPersonal,
    newPersonal,
    tiposPersonal,
    tiposDocumento,
    onClose,
    handleSaveEdit,
    handleAddPersonal,
    setEditPersonal,
    setNewPersonal,
}) => {
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleFieldChange = (field: string, value: any) => {
        const newErrors = { ...errors };
        const fieldErrors = validateField(field, value);

        if (Object.keys(fieldErrors).length === 0) {
            delete newErrors[field];
        } else {
            newErrors[field] = fieldErrors[field];
        }

        setErrors(newErrors);
        if (editPersonal) {
            setEditPersonal({ ...editPersonal, [field]: value });
        } else {
            setNewPersonal({ ...newPersonal, [field]: value });
        }
    };

    const handleSubmit = () => {
        const personal = editPersonal || newPersonal;
        const newErrors = validatePersonal(personal);
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            if (editPersonal) {
                handleSaveEdit();
            } else {
                handleAddPersonal();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-filter backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-[1100px] max-w-[95%] h-auto p-8">
                {/* Encabezado del modal */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {editPersonal ? (
                            <PencilSquareIcon className="w-7 h-7 text-gray-600" />
                        ) : (
                            <UserPlusIcon className="w-7 h-7 text-gray-600" />
                        )}
                        <h2 className="text-2xl font-bold text-gray-800">
                            {editPersonal ? 'Editar Personal' : 'Nuevo Personal'}
                        </h2>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            setEditPersonal(null);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                {/* Aqui ta el contenido del modal */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Personal</label>
                        <div className="relative">
                            <KeyIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <select
                                value={editPersonal ? editPersonal.tipoPersonalId : newPersonal.tipoPersonalId}
                                onChange={(e) => handleFieldChange('tipoPersonalId', Number(e.target.value))}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Selecciona un tipo de personal</option>
                                {tiposPersonal.map((tipo) => (
                                    <option key={tipo.tipoPersonalId} value={tipo.tipoPersonalId}>
                                        {tipo.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.tipoPersonalId && <p className="text-red-500 text-xs italic">{errors.tipoPersonalId[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Contratación</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={editPersonal ? editPersonal.fechaContratacion : newPersonal.fechaContratacion}
                                onChange={(e) => handleFieldChange('fechaContratacion', e.target.value)}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={editPersonal ? editPersonal.nombre : newPersonal.nombre}
                                onChange={(e) => handleFieldChange('nombre', e.target.value)}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {errors.nombre && <p className="text-red-500 text-xs italic">{errors.nombre[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={editPersonal ? editPersonal.apellido : newPersonal.apellido}
                                onChange={(e) => handleFieldChange('apellido', e.target.value)}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        {errors.apellido && <p className="text-red-500 text-xs italic">{errors.apellido[0]}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={editPersonal ? editPersonal.fechaNacimiento : newPersonal.fechaNacimiento}
                                onChange={(e) => handleFieldChange('fechaNacimiento', e.target.value)}
                                className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <select
                                        value={editPersonal ? editPersonal.sexo : newPersonal.sexo}
                                        onChange={(e) => handleFieldChange('sexo', e.target.value)}
                                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Seleccione sexo</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>
                                {errors.sexo && <p className="text-red-500 text-xs italic">{errors.sexo[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                                <div className="relative">
                                    <DocumentIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <select
                                        value={editPersonal ? editPersonal.documentoId : newPersonal.documentoId}
                                        onChange={(e) => handleFieldChange('documentoId', Number(e.target.value))}
                                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Selecciona un tipo de documento</option>
                                        {tiposDocumento.map((doc) => (
                                            <option key={doc.documentoId} value={doc.documentoId}>
                                                {doc.documento}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.documentoId && <p className="text-red-500 text-xs italic">{errors.documentoId[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                                <div className="relative">
                                    <DocumentMagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={editPersonal ? editPersonal.numeroDocumento : newPersonal.numeroDocumento}
                                        onChange={(e) => handleFieldChange('numeroDocumento', e.target.value)}
                                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {errors.numeroDocumento && <p className="text-red-500 text-xs italic">{errors.numeroDocumento[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={editPersonal ? editPersonal.telefono : newPersonal.telefono}
                                        onChange={(e) => handleFieldChange('telefono', e.target.value)}
                                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {errors.telefono && <p className="text-red-500 text-xs italic">{errors.telefono[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                                <div className="relative">
                                    <MapPinIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={editPersonal ? editPersonal.direccion : newPersonal.direccion}
                                        onChange={(e) => handleFieldChange('direccion', e.target.value)}
                                        className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                {errors.direccion && <p className="text-red-500 text-xs italic">{errors.direccion[0]}</p>}
                            </div>
                            {/* Aqui pongo el estado q solo va a estar en edición */}
                            {editPersonal && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                    <div className="relative">
                                        {editPersonal.estado === 'Activo' ? (
                                            <CheckCircleIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                        ) : (
                                            <XCircleIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                        )}
                                        <select
                                            value={editPersonal.estado}
                                            onChange={(e) => handleFieldChange('estado', e.target.value)}
                                            className="w-full p-2 pl-10 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                    {errors.estado && <p className="text-red-500 text-xs italic">{errors.estado[0]}</p>}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => {
                                    onClose();
                                    setEditPersonal(null);
                                }}
                                className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 shadow-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm"
                            >
                                {editPersonal ? 'Guardar Cambios' : 'Crear Personal'}
                            </button>
                        </div>
                    </div>
                </div>
            );
        };
        
        export default PersonalModal;