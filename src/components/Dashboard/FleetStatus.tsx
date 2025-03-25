import React from 'react';

interface FleetStatusProps {
  stats: {
    autobuses: number;
    autobusesOperacion: number;
    autobusesMantenimiento: number;
  };
}

const FleetStatus: React.FC<FleetStatusProps> = ({ stats }) => {
  const capacidadMaxima = 2800;
  const porcentajeOperacion = stats.autobuses ? Math.round((stats.autobusesOperacion / stats.autobuses) * 100) : 0;
  const porcentajeMantenimiento = stats.autobuses ? Math.round((stats.autobusesMantenimiento / stats.autobuses) * 100) : 0;
  const porcentajeCapacidad = stats.autobuses ? Math.round((stats.autobuses / capacidadMaxima) * 100) : 0;

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Estado de la Flota</h3>
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Autobuses Activos</p>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{stats.autobuses}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">En Operación</p>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{stats.autobusesOperacion}</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500">En Mantenimiento</p>
            <h3 className="text-xl md:text-2xl font-semibold text-gray-800">{stats.autobusesMantenimiento}</h3>
          </div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Capacidad Utilizada</span>
            <span className="text-blue-600">{stats.autobuses} de {capacidadMaxima}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${porcentajeCapacidad}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500">Capacidad: {porcentajeCapacidad}%</div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Autobuses en Operación</span>
            <span className="text-green-600">{stats.autobusesOperacion} de {stats.autobuses}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${porcentajeOperacion}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500">Activos: {porcentajeOperacion}%</div>
        </div>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Autobuses en Mantenimiento</span>
            <span className="text-yellow-600">{stats.autobusesMantenimiento} de {stats.autobuses}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${porcentajeMantenimiento}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500">En mantenimiento: {porcentajeMantenimiento}%</div>
        </div>
      </div>
    </div>
  );
};

export default FleetStatus;