import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface TransportStatisticsProps {
  stats: {
    conductoresDisponibles: number;
    conductoresNoDisponibles: number;
  };
}

const TransportStatistics: React.FC<TransportStatisticsProps> = ({ stats }) => {
  const [data, setData] = useState([
    {
      name: 'Personal',
      Disponible: stats.conductoresDisponibles,
      'No Disponible': stats.conductoresNoDisponibles,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        };
        const response = await axios.get('https://localhost:7251/api/Personal/aux-chof/paginated-list?page=1&pageSize=100', { headers });

        const conductoresDisponibles = response.data.data.filter((personal: any) => (personal.tipoPersonal === 'Conductor' || personal.tipoPersonal == 'Auxiliar') && personal.ruta === 'Sin asignar').length;
        const conductoresNoDisponibles = response.data.data.filter((personal: any) =>(personal.tipoPersonal === 'Conductor' || personal.tipoPersonal == 'Auxiliar') && personal.ruta !== 'Sin asignar').length;
        setData([
          {
            name: 'Personal',
            Disponible: conductoresDisponibles,
            'No Disponible': conductoresNoDisponibles,
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Estadísticas de Personal</h3>

      {/* grafico -- personal Disponibles vs No Disponibles */}
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Disponible" fill="#3C97DA" />
            <Bar dataKey="No Disponible" fill="#FE9D52" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransportStatistics;
