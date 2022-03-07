import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export default prisma;

const cwd = join(__dirname, '..', '..');

export const startPrismaTest = async () => {
  const uuid = uuidv4();
  await prisma.$disconnect();

  process.env.DATABASE_URL = process.env.DATABASE_URL + `-test-${uuid}`;

  const cwd = join(__dirname, '..', '..');
  execSync('npx prisma db push --force-reset', {
    cwd,
    env: process.env,
  });

  await prisma.$connect();
};

export const destroyPrismaTest = async () => {
  prisma.$disconnect();
};
