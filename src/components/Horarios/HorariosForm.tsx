import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Horario {
    horarioId: number;
    horaInicio: string;
    horaFin: string;
    tipoHorario: string;
}

//eta mielda ta ma pendiente q la 3era guerra mundial
//Idea: Representar rutas por horario en un calendario, adicionalmente poder agregar horarios temporales que puedan ser considerados "especiales"
const token = localStorage.getItem('token');
const HorariosForm: React.FC = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        fetchHorarios();
    }, []);

    const fetchHorarios = async () => {
        try {
            const response = await fetch('https://localhost:7251/api/Horarios/data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar horarios');
            const data: Horario[] = await response.json();
            setHorarios(data);
        } catch (error) {
            console.error('Error al cargar horarios:', error);
        }
    };

    const events = horarios.map((horario) => ({
        title: horario.tipoHorario,
        start: `2023-01-01T${horario.horaInicio}`,
        end: `2023-01-01T${horario.horaFin}`,
        description: horario.tipoHorario,
    }));

    const handlePrev = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.prev();
    };

    const handleNext = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.next();
    };

    const handleToday = () => {
        const calendarApi = calendarRef.current?.getApi();
        calendarApi?.today();
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="p-2 font-heading text-3xl font-medium">Horarios</h1>
            </div>
            <div className="max-w-4xl mx-auto">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    headerToolbar={{
                        left: '',
                        center: 'title',
                        right: ''
                    }}
                    buttonText={{
                        today: 'Hoy',
                        month: 'Mes',
                        week: 'Semana',
                        day: 'Día',
                        list: 'Lista'
                    }}
                    eventContent={(eventInfo: any) => (
                        <div>
                            <b>{eventInfo.timeText}</b>
                            <i>{eventInfo.event.title}</i>
                        </div>
                    )}
                    height="auto"
                    contentHeight="auto"
                    aspectRatio={1.5}
                />
            </div>
            <div className="flex flex-col items-center space-y-4 mt-4">
                <div className="flex space-x-4">
                    <button
                        onClick={handlePrev}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Mes anterior
                    </button>
                    <button
                        onClick={handleToday}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Hoy
                    </button>
                    <button
                        onClick={handleNext}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-custom-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Mes siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HorariosForm;