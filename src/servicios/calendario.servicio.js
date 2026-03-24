import { prisma } from "../config/db.js";

/**
 * Esta función es como un "escáner" de la agenda.
 * Mira en MySQL y nos devuelve solo lo que necesitamos saber para no chocar citas.
 */
export async function obtenerHuecosOcupados() {
  try {
    // 1. Le pedimos a Prisma que busque en la tabla 'Cita'
    const citas = await prisma.cita.findMany({
      where: {
        // Solo nos interesan las citas de hoy en adelante (gte = "mayor o igual que")
        fecha: { gte: new Date() } 
      },
      select: {
        // Solo pedimos la fecha y cuánto dura, no necesitamos el nombre del cliente ahora
        fecha: true,
        duracionEstimada: true
      }
    });

    // 2. Limpiamos los datos para que la IA los entienda mejor
    // Convertimos cada cita en un formato simple: { inicio: '...', duracion: '...' }
    return citas.map(c => ({
      inicio: c.fecha.toLocaleString('es-ES'), // Lo ponemos en formato fecha española
      duracion: c.duracionEstimada + " minutos"
    }));

  } catch (error) {
    console.error("❌ Error al leer la agenda de MySQL:", error.message);
    return []; // Si falla, devolvemos una lista vacía para que el programa siga
  }
}