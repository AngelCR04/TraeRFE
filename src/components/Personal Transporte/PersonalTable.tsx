import React from 'react';
import { Personal } from '../../features/dashboard/presentation/types/PersonalType';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
interface PersonalTableProps {
    personal: Personal[];
    handleEdit: (id: number) => void;
}

const PersonalTable: React.FC<PersonalTableProps> = ({ personal, handleEdit }) => {
    return (
        <div className="mt-2 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 sm:pl-6">
                                        Tipo de Personal
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                                        Nombre Completo
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                                        Fecha de Nacimiento
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                                        Sexo
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                                        Tipo de Documento
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                                        Número de Documento
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                                        Teléfono
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                                        Dirección
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900">
                                        Fecha de Contratación
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {personal.map((persona) => (
                                    <tr key={persona.personalId}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                                            {persona.tipoPersonal}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.nombreCompleto}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.fechaNacimiento}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.sexo}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.documento}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.numeroDocumento}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.telefono}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.direccion}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {persona.fechaContratacion}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                            <button
                                                onClick={() => handleEdit(persona.personalId)}
                                                className="text-custom-blue hover:text-blue-900 font-medium"
                                            >
                                                <PencilSquareIcon className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalTable;