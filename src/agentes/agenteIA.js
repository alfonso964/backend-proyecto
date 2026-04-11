import { modeloIA } from "../config/gemini.js";
import { obtenerEstadisticas } from "../servicios/estadisticas.servicio.js";
import { obtenerHuecosOcupados } from "../servicios/calendario.servicio.js";

export async function agenteIA(datos) {
  const estadisticas = await obtenerEstadisticas({
    marca: datos.vehiculo, 
    modelo: datos.modelo,
    reparacion: datos.reparacion
  });

  const citasOcupadas = await obtenerHuecosOcupados();

  // --- CAMBIO LÓGICO: Agenda con capacidad múltiple ---
  const textoAgenda = citasOcupadas.length > 0 
    ? `Citas actuales:\n${citasOcupadas.map(c => `- ${c.inicio}`).join('\n')}\n*Nota: El taller tiene 3 elevadores paralelos. Si un hueco tiene menos de 3 coches, está DISPONIBLE.*`
    : "- Todo el calendario está libre actualmente.";

  const textoEstadisticas = estadisticas
    ? `- Basado en ${estadisticas.muestras} reparaciones previas del taller
- Tiempo medio histórico: ${estadisticas.media} minutos
- Rango habitual: ${estadisticas.minimo}–${estadisticas.maximo} minutos`
    : `- Sin registros previos en este taller
- Estimación basada en estándares generales del sector`;

  const fechaActual = new Date().toLocaleString('es-ES', { 
    timeZone: 'Europe/Madrid',
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const prompt = `
Eres un asistente profesional para un taller mecánico que cuenta con **3 elevadores de trabajo simultáneos**.

FECHA Y HORA ACTUAL (Referencia real):
${fechaActual}

DATOS DEL VEHÍCULO:
- Marca: ${datos.vehiculo}
- Modelo: ${datos.modelo}
- Reparación solicitada: ${datos.reparacion}

ESTADO ACTUAL DE LA AGENDA:
${textoAgenda}

DATOS HISTÓRICOS DEL TALLER:
${textoEstadisticas}

INSTRUCCIONES CRÍTICAS DE HORARIO:
- **CAPACIDAD**: Puedes sugerir una hora aunque ya haya coches, siempre que no haya más de 3 reparaciones a la vez.
- **DÍAS LABORALES**: Solo puedes recomendar citas de LUNES A VIERNES.
- **FINES DE SEMANA**: PROHIBIDO sugerir sábados o domingos.
- **HORARIO DISPONIBLE**: De 08:00 a 14:00 y de 16:00 a 19:30.
- **PROHIBIDO** sugerir una fecha o hora que ya haya pasado.
- Si sugieres una cita para hoy, debe ser al menos 2 horas después de la hora actual.
- Responde en español, formato Markdown, breve y directo.

DEVUELVE:
## 🕒 Tiempo estimado (diagnóstico + reparación)
## 🛠 Tipo de reparación
## 📝 Qué se va a hacer
## 📅 Recomendación de fecha
## Precio aproximado de la reparación
`;

  const resultado = await modeloIA.generateContent(prompt);
  return resultado.response.text();
}