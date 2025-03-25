import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { Autobus } from '../../features/dashboard/presentation/types/AutobusType';

interface RegistroTableProps {
    autobuses: Autobus[];
    handleEdit: (autobus: Autobus) => void;
}

const RegistroTable: React.FC<RegistroTableProps> = ({ autobuses, handleEdit }) => {
    return (
        <div className="mt-2 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold text-gray-900 sm:pl-6 ">
                                        Código
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Placa
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Agencia
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Garantía
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Marca
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Chasis
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Modelo
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Movilidad
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Capacidad
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Estado
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Provincia
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold text-gray-900 text-center">
                                        Ruta
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-bold text-gray-900 text-center">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {autobuses.map((autobus) => (
                                    <tr key={autobus.autobusId}>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                            {autobus.codigoAutobus}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 text-center">
                                            {autobus.placa}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900  text-center">
                                            {autobus.agencia}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900  text-center">
                                            {autobus.diasRestantesGarantia}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.marca}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.chasis}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.modelo}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.movilidad}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.capacidad}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.estado}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.provincia}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 text-center">
                                            {autobus.ruta}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                            <button
                                                onClick={() => handleEdit(autobus)}
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

export default RegistroTable;
