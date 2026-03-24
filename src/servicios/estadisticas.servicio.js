import { reparacionesFake } from "../datos/reparaciones.fake.js";

export function obtenerEstadisticas({ marca, modelo, reparacion }) {
  // 1. Seguridad básica: Si falta marca o reparación, no buscamos
  if (!marca || !reparacion) {
    return null;
  }

  const m = marca.toLowerCase().trim();
  const mod = modelo ? modelo.toLowerCase().trim() : "";
  const r = reparacion.toLowerCase().trim();

  // 2. Buscamos en el array de datos fake
  // Filtramos por marca y que la reparación contenga la palabra clave (ej: "aceite")
  const coincidencias = reparacionesFake.filter(item => {
    const coincideMarca = item.marca.toLowerCase() === m;
    const coincideReparacion = item.reparacion.toLowerCase().includes(r);
    
    // Si el usuario puso modelo, también filtramos por él
    if (mod) {
      return coincideMarca && coincideReparacion && item.modelo.toLowerCase() === mod;
    }
    return coincideMarca && coincideReparacion;
  });

  // 3. Si encontramos datos, calculamos las estadísticas reales
  if (coincidencias.length > 0) {
    const duraciones = coincidencias.map(c => c.duracionMin);
    const suma = duraciones.reduce((a, b) => a + b, 0);
    
    return {
      muestras: coincidencias.length,
      media: Math.round(suma / duraciones.length),
      minimo: Math.min(...duraciones),
      maximo: Math.max(...duraciones)
    };
  }

  // 4. Si no hay registros previos para ese coche/avería
  return null;
}