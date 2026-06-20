import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import agenteIARuta from "./src/rutas/agenteIA.ruta.js";
import citaRutas from "./src/rutas/cita.ruta.js"; 

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(cors()); 
app.use(express.json()); 

// RUTAS
app.use("/api", agenteIARuta); 
app.use("/api/citas", citaRutas); 

const PORT = process.env.PORT || 3000;

// INICIO DEL SERVIDOR
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo correctamente en el puerto: ${PORT}`);
  console.log(`📅 Rutas de citas listas para usar.`);
});