import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchTiposEvento, createEvento } from '../../services/eventService';
import { authService } from '../../services/authService';
import AddEventForm from './AddEventForm';

export default function AddEventScreen({ onSuccess }: { onSuccess?: () => void }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [lugar, setLugar] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaTermino, setHoraTermino] = useState(new Date());
  const [tipoEventoId, setTipoEventoId] = useState('');
  const [tiposEvento, setTiposEvento] = useState<{ id: number | string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicio, setShowHoraInicio] = useState(false);
  const [showHoraTermino, setShowHoraTermino] = useState(false);

  // Estado para la imagen
  const [imagen, setImagen] = useState<string>('');

  useEffect(() => {
    authService.getCurrentUser().then(user => {
      if (user && user.id) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    fetchTiposEvento()
      .then(data => {
        setTiposEvento(data);
        setTipoEventoId(data[0]?.id || '');
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', 'No se pudieron cargar los tipos de evento');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert('Error', 'No se encontró el usuario autenticado');
      return;
    }
    try {
      const evento = {
        nombre_evento: nombre,
        descripcion_evento: descripcion,
        fecha_evento: fecha.toISOString().split('T')[0],
        hora_inicio_evento: horaInicio.toTimeString().slice(0, 5),
        hora_termino_evento: horaTermino.toTimeString().slice(0, 5),
        lugar_evento: lugar,
        id_usuario: userId,
        id_tipo_evento: tipoEventoId,
        imagen, // <-- agrega la imagen base64 aquí
      };
      await createEvento(evento);
      Alert.alert('Éxito', 'Evento creado correctamente');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      Alert.alert('Error', `No se pudo crear el evento: ${error?.message || error}`);
    }
  };

  return (
    <AddEventForm
      nombre={nombre}
      setNombre={setNombre}
      descripcion={descripcion}
      setDescripcion={setDescripcion}
      lugar={lugar}
      setLugar={setLugar}
      fecha={fecha}
      setFecha={setFecha}
      horaInicio={horaInicio}
      setHoraInicio={setHoraInicio}
      horaTermino={horaTermino}
      setHoraTermino={setHoraTermino}
      tipoEventoId={tipoEventoId}
      setTipoEventoId={setTipoEventoId}
      tiposEvento={tiposEvento}
      showDatePicker={showDatePicker}
      setShowDatePicker={setShowDatePicker}
      showHoraInicio={showHoraInicio}
      setShowHoraInicio={setShowHoraInicio}
      showHoraTermino={showHoraTermino}
      setShowHoraTermino={setShowHoraTermino}
      handleSubmit={handleSubmit}
      loading={loading || !userId}
      imagen={imagen}
      setImagen={setImagen}
    />
  );
}