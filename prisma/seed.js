import { PrismaClient } from '@prisma/client';

/**
 * 1. IMPORTACIÓN DE DATOS
 * Usamos 'with { type: "json" }' para decirle a Node: 
 * "Oye, esto no es código JS, es un archivo de datos JSON, trátalo como un objeto".
 */
import usuarios from './data/usuarios.json' with { type: 'json' };
import historico from './data/historico.json' with { type: 'json' };
import piezas from './data/piezas.json' with { type: 'json' };

// Instanciamos el cliente de Prisma para poder hablar con la base de datos
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando proceso de carga de datos...');

  /**
   * 2. BLOQUE TRY/CATCH (Seguridad)
   * Intentamos (try) ejecutar todo. Si algo falla (ej. MySQL está apagado), 
   * saltamos directamente al bloque 'catch' para que el programa no se cuelgue.
   */
  try {
    
    // --- CARGAR USUARIOS ---
    console.log('👤 Cargando usuarios...');
    for (const u of usuarios) {
      /**
       * UPSERT: Es una mezcla de Update e Insert.
       * - Busca si ya existe un usuario con ese email (where).
       * - Si existe, no hace nada (update: {}).
       * - Si NO existe, lo crea (create: u). 
       * Esto evita que el seed falle si lo ejecutas dos veces.
       */
      await prisma.usuario.upsert({
        where: { email: u.email },
        update: {}, 
        create: u,
      });
    }

    // --- CARGAR HISTÓRICO ---
    console.log('📜 Actualizando historial...');
    /**
     * deleteMany(): Borra TODO el contenido de la tabla antes de empezar.
     * createMany(): Inserta toda la lista del JSON de un solo golpe. 
     * Es mucho más rápido que ir uno por uno.
     */
    await prisma.registroHistorico.deleteMany(); 
    await prisma.registroHistorico.createMany({
      data: historico,
    });

    // --- CARGAR PIEZAS ---
    console.log('🔧 Actualizando inventario...');
    // Repetimos la lógica: limpiar tabla y rellenar con los datos frescos del JSON
    await prisma.pieza.deleteMany();
    await prisma.pieza.createMany({
      data: piezas,
    });

    console.log('✅ ¡Base de datos MySQL poblada con éxito!');

  } catch (error) {
    // Si hay un error de conexión o un fallo en el formato del JSON, lo vemos aquí
    console.error('❌ Error durante el SEED:', error.message);
  }
}

/**
 * 3. EJECUCIÓN DEL SCRIPT
 * Llamamos a la función main().
 */
main()
  .catch((e) => {
    // Si ocurre un error fuera del try/catch (algo muy grave)
    console.error('❌ Error crítico inesperado:', e);
    process.exit(1); // Cerramos el programa con código de error
  })
  .finally(async () => {
    /**
     * IMPORTANTE: Pase lo que pase (éxito o error), 
     * le decimos a Prisma que cierre la conexión con MySQL.
     * Es como colgar el teléfono después de hablar.
     */
    await prisma.$disconnect();
  });