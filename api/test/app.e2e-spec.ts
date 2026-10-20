import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/app.setup';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../src/prisma/prisma.service';
import bcrypt from 'bcryptjs';



describe('AppController (e2e)', () => {
  const stamp = Date.now();
  const exercisesName = `Squat-${stamp}`
  let app: INestApplication<App>;
  let tokenA: string, tokenB: string;
  let exerciseId: string, workoutId: string;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app)
    await app.init();

    prisma = app.get(PrismaService);
    const hash = await bcrypt.hash('Passw0rd!', 10);
    await prisma.user.create({ data: { email: `a-${stamp}@test.com`, passwordHash: hash } });
    await prisma.user.create({ data: { email: `b-${stamp}@test.com`, passwordHash: hash } });
    tokenA = (await request(app.getHttpServer()).post('/auth/login')
      .send({ email: `a-${stamp}@test.com`, password: 'Passw0rd!' })).body.accessToken;
    tokenB = (await request(app.getHttpServer()).post('/auth/login')
      .send({ email: `b-${stamp}@test.com`, password: 'Passw0rd!' })).body.accessToken;
    const ex = await request(app.getHttpServer()).post('/exercises')
      .auth(tokenA, { type: 'bearer' })
      .send({ name: exercisesName, muscleGroup: 'LEGS' }).expect(201);
    exerciseId = ex.body.id;

    const w = await request(app.getHttpServer()).post('/workouts')
      .auth(tokenA, { type: 'bearer' })
      .send({ title: 'T', sets: [{ exerciseId, setNo: 1, weightKg: 60, reps: 10 }] })
      .expect(201);
    workoutId = w.body.id;
  });



  it('/health (GET)', () => {
    const req = request(app.getHttpServer())
      .get('/health')
    return req.expect(200)
  });

  it('/auth/login (POST) Success', () => {
    const payload = {
      "email": "seed@email.com",
      "password": "seed_password"
    }
    const req = request(app.getHttpServer())
      .post('/auth/login')
      .send(payload)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken')
        expect(res.body).toHaveProperty('expiresIn')
      })

    return req
  })

  it('/auth/login (POST) Failed', () => {
    const payload = {
      "email": "wrong@email.com",
      "password": "wrong_password"
    }
    const req = request(app.getHttpServer())
      .post('/auth/login')
      .send(payload)
      .expect(401)
      .expect((res) => {
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toEqual('Unauthorized')
      })
    return req
  });


  it('/exercises (POST) Duplicate Name Exercises 409', () => {
    const payload = {
      "name": exercisesName,
      "muscleGroup": "LEGS"
    }
    const req = request(app.getHttpServer())
      .post('/exercises')
      .send(payload)
      .auth(tokenA, { type: "bearer" })
      .expect(409)
      .expect((res) => {
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toEqual(`Conflict`)
      })
    return req
  });

  it('/workouts (POST) Create workouts Success', async () => {
    const payload = {
      "title": "Test Day", // ไม่บังคับ
      // "performedAt": "2026-10-09T10:30:00+07:00", // ISO 8601 ไม่ส่ง = เวลาปัจจุบัน
      // "durationMinutes": 1, // ไม่บังคับ
      // "note": "", // ไม่บังคับ
      "sets": [
        {
          "exerciseId": exerciseId,
          "setNo": 1,
          "weightKg": 5.0,
          "reps": 14
        },
      ]
    }
    const req = request(app.getHttpServer())
      .post('/workouts')
      .send(payload)
      .auth(tokenA, { type: "bearer" })
      .expect(201)
    return req
  })


  it('/workouts (POST)  workouts valid 400', () => {
    const payload = {
      "title": "Test Day", // ไม่บังคับ
      // "performedAt": "2026-10-09T10:30:00+07:00", // ISO 8601 ไม่ส่ง = เวลาปัจจุบัน
      // "durationMinutes": 1, // ไม่บังคับ
      // "note": "", // ไม่บังคับ
      "sets": [
        {
          "exerciseId": "05d6e23a-6b86-4144-8627-ba9e97abba45",
          "setNo": 1,
          "weightKg": 5.0,
          "reps": 14
        },

      ]
    }
    const req = request(app.getHttpServer())
      .post('/workouts')
      .send(payload)
      .auth(tokenA, { type: "bearer" })
      .expect(400)
    return req
  })

  it('/workouts/:id (GET) get workouts Success', () => {
    const req = request(app.getHttpServer())
      .get(`/workouts/${workoutId}`)
      .auth(tokenA, { type: "bearer" })
      .expect(200)
    return req
  })

  it('/workouts/:id (GET) get workouts failed 404', () => {
    const req = request(app.getHttpServer())
      .get(`/workouts/${workoutId}`)
      .auth(tokenB, { type: "bearer" })
      .expect(404)
    return req
  })



  afterAll(async () => {
    await prisma.workout.deleteMany({ where: { user: { email: { endsWith: `-${stamp}@test.com` } } } });
    await prisma.exercise.deleteMany({ where: { user: { email: { endsWith: `-${stamp}@test.com` } } } });
    await prisma.user.deleteMany({ where: { email: { endsWith: `-${stamp}@test.com` } } });
    await app.close();
  });

})
