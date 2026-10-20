import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/app.setup';
import { JwtService } from '@nestjs/jwt';



describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let validToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    configureApp(app)
    await app.init();

    const jwtService = moduleFixture.get<JwtService>(JwtService)
    validToken = jwtService.sign(
      { sub: '13e60d36-0b5f-4a23-b3b6-58d31806d260', username: 'admin' },
      { expiresIn: '1m' }
    )
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
      "name": "Squat",
      "muscleGroup": "LEGS"
    }
    const req = request(app.getHttpServer())
      .post('/exercises')
      .send(payload)
      .auth(validToken, { type: "bearer" })
      .expect(409)
      .expect((res) => {
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toEqual(`Conflict`)
      })
    return req
  });

  it('/workouts (POST) Create workouts Success', () => {
    const payload = {
      "title": "Test Day", // ไม่บังคับ
      // "performedAt": "2026-10-09T10:30:00+07:00", // ISO 8601 ไม่ส่ง = เวลาปัจจุบัน
      // "durationMinutes": 1, // ไม่บังคับ
      // "note": "", // ไม่บังคับ
      "sets": [
        {
          "exerciseId": "05d6e23a-6b86-4144-8627-ba9e97abba39",
          "setNo": 1,
          "weightKg": 5.0,
          "reps": 14
        },
        {
          "exerciseId": "05d6e23a-6b86-4144-8627-ba9e97abba39",
          "setNo": 2,
          "weightKg": 5.0,
          "reps": 14
        }
      ]
    }
    const req = request(app.getHttpServer())
      .post('/workouts')
      .send(payload)
      .auth(validToken, { type: "bearer" })
      .expect(201)
    return req
  })


  it('/workouts (POST)  workouts valid 400', () => {
    const payload = {
      "title": "Test Day 05d6e23a-6b86-4144-8627-ba9e97abba45 05d6e23a-6b86-4144-8627-ba9e97abba45", // ไม่บังคับ
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
        {
          "exerciseId": "05d6e23a-6b86-4144-8627-ba9e97abba45",
          "setNo": 2,
          "weightKg": 5.0,
          "reps": 14
        }
      ]
    }
    const req = request(app.getHttpServer())
      .post('/workouts')
      .send(payload)
      .auth(validToken, { type: "bearer" })
      .expect(400)
    return req
  })

  it('/workouts/:id (GET) get workouts Success', () => {
    const req = request(app.getHttpServer())
      .get('/workouts/72dd56ed-21b1-43c1-a094-8a139d164a1f')
      .auth(validToken, { type: "bearer" })
      .expect(200)
    return req
  })

  it('/workouts/:id (GET) get workouts failed 404', () => {
    const req = request(app.getHttpServer())
      .get('/workouts/42dd56ed-21b1-43c1-a094-8a139d164a12')
      .auth(validToken, { type: "bearer" })
      .expect(404)
    return req
  })


  afterAll(async () => {
    await app.close()
  })

})
