import { procesarAgenteIA } from "../servicios/agenteIA.servicio.js";

export async function consultarAgenteIA(req, res) {
  try {
    const respuesta = await procesarAgenteIA(req.body);
    res.json({ respuesta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el agente IA" });
  }
}
