import express from "express";
import { crearCita, obtenerCitas } from "../controladores/cita.controlador.js";

const router = express.Router();

/**
 * RUTA: POST /api/citas
 * DESCRIPCIÓN: Se usa para guardar una nueva cita en la base de datos.
 */
router.post("/", crearCita);

/**
 * RUTA: GET /api/citas
 * DESCRIPCIÓN: Se usa para obtener el listado de todas las citas (para el calendario).
 */
router.get("/", obtenerCitas);

export default router;