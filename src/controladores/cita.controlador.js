import { prisma } from "../config/db.js";

export const crearCita = async (req, res) => {
  try {
    const { fecha, marca, modelo, reparacion, duracionEstimada, usuarioId } = req.body;

    // 1. Validamos la fecha para que PostgreSQL no de error de formato
    const fechaConvertida = new Date(fecha);
    if (isNaN(fechaConvertida.getTime())) {
      return res.status(400).json({ error: "La fecha proporcionada no es válida" });
    }

    // 2. IMPORTANTE: Forzamos que el ID sea un número entero
    const idFinalUsuario = parseInt(usuarioId) || 1;

    const nuevaCita = await prisma.cita.create({
      data: {
        fecha: fechaConvertida,
        marca: marca || "No especificada",
        modelo: modelo || "No especificado",
        reparacion: reparacion || "Revisión general",
        duracionEstimada: parseInt(duracionEstimada) || 60,
        estado: "PENDIENTE",
        usuarioId: idFinalUsuario 
      }
    });

    res.status(201).json({ 
      mensaje: "Cita reservada con éxito", 
      cita: nuevaCita 
    });

  } catch (error) {
    console.error("❌ Error detallado en crearCita:", error);

    // Error P2003: Violación de clave foránea (el usuarioId no existe en la DB)
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: "No se pudo crear la cita porque el usuario asignado no existe en la base de datos." 
      });
    }
    
    res.status(500).json({ 
      error: "Error al crear la cita: " + error.message 
    });
  }
};

export const obtenerCitas = async (req, res) => {
  try {
    const citas = await prisma.cita.findMany({
      orderBy: { 
        fecha: 'asc' 
      }
    });

    res.json(citas);

  } catch (error) {
    console.error("❌ Error en obtenerCitas:", error);
    res.status(500).json({ 
      error: "Error al obtener las citas de la base de datos" 
    });
  }
};