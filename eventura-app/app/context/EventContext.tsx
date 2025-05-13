// context/EventContext.tsx

import React, { createContext, useContext, useState } from 'react';

export interface Evento {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  imagen: string | null;
}

interface EventContextProps {
  eventos: Evento[];
  agregarEvento: (evento: Evento) => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

// ✅ EXPORTACIÓN NOMBRADA
export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext debe usarse dentro de un EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [eventos, setEventos] = useState<Evento[]>([]);

  const agregarEvento = (evento: Evento) => {
    setEventos(prev => [...prev, { ...evento, id: prev.length + 1 }]);
  };

  return (
    <EventContext.Provider value={{ eventos, agregarEvento }}>
      {children}
    </EventContext.Provider>
  );
};

export default EventProvider;