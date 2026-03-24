import express from "express";
import { consultarAgenteIA } from "../controladores/agenteIA.controlador.js";

const router = express.Router();

router.post("/agente-ia", consultarAgenteIA);

export default router;
