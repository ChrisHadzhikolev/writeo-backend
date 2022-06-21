import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/authentication/guards/jwt.guard';
import { RolesGuard } from '../src/authentication/guards/roles.guard';
import { Column } from 'typeorm';

describe('UsersController E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let data;
  let jwt;
  it(`register`, () => {
    return request(app.getHttpServer())
      .post('/user/')
      .send({
        firstName: 'Test4',
        lastName: 'Test4',
        username: 'test4',
        email: 'test4@test.test',
        password: 'testpass',
      })
      .expect(201)
      .then((res) => {
        data = res.body.data;
        console.log(res.body.data);
      });
  });

  it(`login`, () => {
    jest.setTimeout(1000000);
    return request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: 'test4@test.test',
        password: 'testpass',
      })
      .expect(200)
      .then((res) => {
        jwt = res.body.data;
      });
  });

  it(`should delete user`, () => {
      console.log(data.id, jwt.token)
    return request(app.getHttpServer())
      .delete(`/user/${data.id}`)
      .set({ Authorization: `Bearer ${jwt.token}` })
      .expect(404);
  });

  //   it(`should change article privacy`, () => {
  //     return request(app.getHttpServer())
  //       .put(`/article/${data.id}/privacy`)
  //       .expect(200);
  //   });
  //
  //   it(`should delete the test article`, () => {
  //     return request(app.getHttpServer())
  //       .delete(`/article/${data.id}`)
  //       .expect(200);
  //   });
  //
  //   it(`should get all user articles`, () => {
  //     return request(app.getHttpServer())
  //       .get(`/article/${data.authorId}/user/all`)
  //       .expect(200);
  //   });
  //
  //   it(`should get public articles`, () => {
  //     return request(app.getHttpServer())
  //       .get('/article/public/articles')
  //       .expect(200);
  //   });
  //
  //   afterAll(async () => {
  //     await app.close();
  //   });
  // });
  //
  // describe('ArticleController E2E Tests without mocked guards', () => {
  //   let app: INestApplication;
  //
  //   beforeAll(async () => {
  //     const moduleFixture: TestingModule = await Test.createTestingModule({
  //       imports: [AppModule],
  //     }).compile();
  //
  //     app = moduleFixture.createNestApplication();
  //     await app.init();
  //   });
  //
  //   it(`should create article`, () => {
  //     return request(app.getHttpServer())
  //       .post('/article/')
  //       .send({
  //         authorId: 'd907eb05-f321-4c80-b878-b141557bab1b',
  //         title: 'e2e',
  //         description: 'Testing Article Api',
  //         content: 'Testing with jest',
  //         category: 'documentary',
  //         isPrivate: false,
  //       })
  //       .expect(401);
  //   });
  //
  //   it(`should edit the test article`, () => {
  //     return request(app.getHttpServer())
  //       .put(`/article/id/update`)
  //       .send({
  //         content: 'Testing with jest updated',
  //       })
  //       .expect(401);
  //   });
  //
  //   it(`should change article privacy`, () => {
  //     return request(app.getHttpServer()).put(`/article/id/privacy`).expect(401);
  //   });
  //
  //   it(`should delete the test article`, () => {
  //     return request(app.getHttpServer()).delete(`/article/id`).expect(401);
  //   });
  //
  //   it(`should get all user articles`, () => {
  //     return request(app.getHttpServer()).get(`/article/id/user/all`).expect(401);
  //   });
  //
  //   it(`should get public articles`, () => {
  //     return request(app.getHttpServer())
  //       .get('/article/public/articles')
  //       .expect(401);
  //   });

  afterAll(async () => {
    await app.close();
  });
});
