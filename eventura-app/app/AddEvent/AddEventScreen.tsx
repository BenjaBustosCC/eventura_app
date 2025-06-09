import React, { useState, useEffect } from "react";
import { Alert} from "react-native";
import { fetchTiposEvento, createEvento } from "../../services/eventService";
import { authService } from "../../services/authService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddEventForm from './AddEventForm';

export default function AddEventScreen({ onSuccess }: { onSuccess?: () => void }) {
  const insets = useSafeAreaInsets();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaTermino, setHoraTermino] = useState(new Date());
  const [tipoEventoId, setTipoEventoId] = useState("");
  const [tiposEvento, setTiposEvento] = useState<{ id: number | string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicio, setShowHoraInicio] = useState(false);
  const [showHoraTermino, setShowHoraTermino] = useState(false);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);
  const [imagen, setImagen] = useState<string>("");

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user && user.id) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    fetchTiposEvento()
      .then((data) => {
        setTiposEvento(data);
        setTipoEventoId(String(data[0]?.id || ""));
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "No se pudieron cargar los tipos de evento");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "No se encontró el usuario autenticado");
      return;
    }
    try {
      if (!lugar || latitud === null || longitud === null) {
        Alert.alert("Error", "Debes seleccionar un lugar válido");
        return;
      }

      const evento = {
        nombre_evento: nombre,
        descripcion_evento: descripcion,
        fecha_evento: fecha.toISOString().split("T")[0],
        hora_inicio_evento: horaInicio.toTimeString().slice(0, 5),
        hora_termino_evento: horaTermino.toTimeString().slice(0, 5),
        lugar_evento: lugar,
        id_usuario: userId,
        id_tipo_evento: tipoEventoId,
        latitud: latitud!,
        longitud: longitud!,
        imagen, // base64
      };
      await createEvento(evento);
      Alert.alert("Éxito", "Evento creado correctamente");
      setNombre("");
      setDescripcion("");
      setLugar("");
      setFecha(new Date());
      setHoraInicio(new Date());
      setHoraTermino(new Date());
      setTipoEventoId(tiposEvento[0]?.id?.toString() || "");
      setImagen("");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error al crear evento:", error);
      Alert.alert("Error", `No se pudo crear el evento: ${error?.message || error}`);
    }
  };

  // Puedes seguir usando AddEventForm si lo tienes implementado correctamente,
  // o dejar el formulario inline como lo tienes arriba.
  // Aquí te muestro cómo usar AddEventForm correctamente:

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
      sugerencias={sugerencias}
      setSugerencias={setSugerencias}
      buscarLugares={async (input: string) => {
        if (!input) return [];
        const apiKey = "AIzaSyD6w_NILALZTacu5qTPC2n0qUmI4isCUog";
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            input
          )}&key=${apiKey}&language=es`
        );
        const json = await response.json();
        return json.predictions || [];
      }}
      obtenerCoordenadas={async (placeId: string) => {
        const apiKey = "AIzaSyD6w_NILALZTacu5qTPC2n0qUmI4isCUog";
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
        );
        const json = await response.json();
        const location = json.result?.geometry?.location;
        if (location) {
          setLatitud(location.lat);
          setLongitud(location.lng);
        } else {
          Alert.alert("Error", "No se pudieron obtener las coordenadas del lugar");
        }
      }}
    />
  );
}