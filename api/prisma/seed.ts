import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '../generated/client';

type Group = 'CHEST' | 'BACK' | 'SHOULDERS' | 'ARMS' | 'LEGS' | 'CORE' | 'FULL_BODY';

const EXERCISES: Array<[string, Group]> = [
  ['Bench Press', 'CHEST'],
  ['Incline Dumbbell Press', 'CHEST'],
  ['Cable Fly', 'CHEST'],
  ['Overhead Press', 'SHOULDERS'],
  ['Lateral Raise', 'SHOULDERS'],
  ['Barbell Row', 'BACK'],
  ['Lat Pulldown', 'BACK'],
  ['Pull-up', 'BACK'],
  ['Deadlift', 'BACK'],
  ['Squat', 'LEGS'],
  ['Romanian Deadlift', 'LEGS'],
  ['Leg Press', 'LEGS'],
  ['Barbell Curl', 'ARMS'],
  ['Triceps Pushdown', 'ARMS'],
  ['Cable Crunch', 'CORE'],
];

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const email = process.env.SEED_EMAIL;
  const password = process.env.SEED_PASSWORD;
  if (!email || !password) throw new Error('SEED_EMAIL / SEED_PASSWORD not set');

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`user: ${user.email}`);

  for (const [name, muscleGroup] of EXERCISES) {
    await prisma.exercise.upsert({
      where: { userId_name: { userId: user.id, name } },
      update: {},
      create: { userId: user.id, name, muscleGroup },
    });
  }
  console.log(`exercises: ${EXERCISES.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());