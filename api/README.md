# Workout Progress Tracker — API

REST API สำหรับบันทึกการเล่นเวทและติดตามความก้าวหน้า สร้างด้วย NestJS 11, Prisma 7 และ PostgreSQL

## Tech stack

- NestJS 11 (Express)
- Prisma 7 + `@prisma/adapter-pg` (client ถูก generate ไว้ที่ `generated/`)
- PostgreSQL
- JWT authentication (`@nestjs/jwt`) + bcryptjs
- Validation ด้วย `class-validator` / `class-transformer`
- Jest + Supertest สำหรับเทส

## Requirements

- Node.js 24.x (production บน Render ใช้ 24.12.0)
- PostgreSQL

## Getting started

```bash
cd api
npm install
cp .env.example .env     # แล้วแก้ค่าให้ครบ
npx prisma generate
npx prisma migrate deploy
npx prisma db seed       # ไม่บังคับ: สร้าง user และ exercise เริ่มต้น
npm run start:dev        # http://localhost:3000
```

## Environment variables

แอปตรวจค่าเหล่านี้ตอนเริ่มต้น ([src/config/environments.ts](src/config/environments.ts)) ถ้าขาดตัวใดตัวหนึ่งจะ start ไม่ได้

| ตัวแปร | ใช้ทำอะไร |
| --- | --- |
| `DATABASE_URL` | connection string ที่แอปและ seed ใช้ query |
| `DIRECT_URL` | connection string ที่ Prisma CLI ใช้ (เช่น `migrate`) อ่านจาก [prisma.config.ts](prisma.config.ts) |
| `JWT_SECRET` | secret สำหรับเซ็น JWT |
| `JWT_EXPIRES_IN` | อายุ token เช่น `30d` |
| `CORS_ORIGIN` | origin ของ frontend ที่อนุญาต (`http://localhost:5173` อนุญาตไว้เสมอ) |
| `SEED_EMAIL` | อีเมลของ user ที่ seed |
| `SEED_PASSWORD` | รหัสผ่านของ user ที่ seed |
| `PORT` | ไม่บังคับ ค่าเริ่มต้น `3000` |

แอปอ่านไฟล์ `.env.${NODE_ENV}` ก่อน แล้วค่อย `.env` (ไม่ได้ตั้ง `NODE_ENV` จะใช้ `.env.development`)

## Scripts

| คำสั่ง | ทำอะไร |
| --- | --- |
| `npm run start:dev` | รันแบบ watch |
| `npm run build` | `prisma generate` แล้ว build |
| `npm run start:prod` | รันจาก `dist/` |
| `npm run lint` | ESLint (พร้อม `--fix`) |
| `npm run format` | Prettier |
| `npm test` | unit test |
| `npm run test:e2e` | e2e test (ใช้ `.env.test`) |

## API endpoints

ทุก endpoint ต้องแนบ `Authorization: Bearer <token>` ยกเว้นที่ระบุว่า public

| Method | Path | หมายเหตุ |
| --- | --- | --- |
| GET | `/health` | public, เช็กการเชื่อมต่อ DB (ตอบ 503 ถ้าต่อไม่ได้) |
| POST | `/auth/register` | public |
| POST | `/auth/login` | public |
| GET | `/exercises` | รายการท่า |
| POST | `/exercises` | สร้างท่า |
| PATCH | `/exercises/:id` | แก้ไขท่า |
| GET | `/exercises/:id/last` | ข้อมูลการเล่นล่าสุดของท่านั้น |
| POST | `/workouts` | บันทึก workout |
| GET | `/workouts` | รายการ workout |
| GET | `/workouts/:id` | รายละเอียด workout |
| DELETE | `/workouts/:id` | ลบ workout |

Schema ของข้อมูลดูได้ที่ [prisma/schema.prisma](prisma/schema.prisma) (`User`, `Exercise`, `Workout`, `WorkoutSet`, enum `MuscleGroup`)

## Testing

e2e test ต่อ database จริง จึงควรใช้ database แยกสำหรับเทส

1. สร้าง database เปล่า (เช่น `wpt_test`) และตั้ง `DATABASE_URL` / `DIRECT_URL` ใน `.env.test` ให้ชี้ไปที่นั่น
2. migrate และ seed ลง database เทส โดยตั้ง env ให้ชี้ไป DB เทสก่อน เช่น ใน PowerShell:
   ```powershell
   $env:DATABASE_URL="postgresql://<user>:<password>@localhost:<port>/wpt_test"
   $env:DIRECT_URL=$env:DATABASE_URL
   npx prisma migrate deploy
   npx prisma db seed
   Remove-Item Env:DATABASE_URL, Env:DIRECT_URL
   ```
   (`seed.ts` โหลดแค่ `.env` ถ้าไม่ตั้ง env เอง ข้อมูลจะไปลง DB dev)
3. รัน `npm run test:e2e`

`test:e2e` รัน Jest ด้วย `--experimental-vm-modules` เพราะ Prisma client โหลด query compiler ด้วย dynamic `import()` ถ้ารันเทสผ่านปุ่มของ IDE โดยไม่ผ่าน npm script จะเจอ error `A dynamic import callback was invoked without --experimental-vm-modules`

## Deployment

Deploy บน Render ตาม [render.yaml](../render.yaml) ที่ root ของ repo: build ด้วย `npm ci && npm run build && npx prisma migrate deploy`, start ด้วย `npm run start:prod` และใช้ `/health` เป็น health check ค่า env ที่เป็นความลับ (`sync: false`) ต้องตั้งใน dashboard ของ Render เอง
