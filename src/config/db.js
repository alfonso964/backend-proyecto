import { PrismaClient } from '@prisma/client';

// Creamos una única instancia de Prisma para toda la app
export const prisma = new PrismaClient();