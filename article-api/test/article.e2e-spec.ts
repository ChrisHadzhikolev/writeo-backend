import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/guards/jwt.guard';
import { RolesGuard } from '../src/auth/guards/roles.guard';

describe('ArticleController E2E Tests', () => {
  let app: INestApplication;
  const jwtAuthGuard = {
    logIn: () => ['auuth'],
    handleRequest: () => ['auuth'],
    getAuthenticateOptions: () => ['auuth'],
  };
  const rolesGuard = { canActivate: () => ['user'] };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  let data;
  it(`should create article`, () => {
    return request(app.getHttpServer())
      .post('/article/')
      .send({
        authorId: 'd907eb05-f321-4c80-b878-b141557bab1b',
        title: 'e2e',
        description: 'Testing Article Api',
        content: 'Testing with jest',
        category: 'documentary',
        isPrivate: false,
      })
      .expect(201)
      .then((res) => {
        data = res.body.data;
      });
  });

  it(`should get the article created by previous test`, () => {
    return request(app.getHttpServer())
      .get(`article/${data.id}/author/${data.authorId}`)
      .expect(200)
      .then((res) => {
        console.log('r', res.body);
      })
      .catch((err) => {
        console.log('e', err);
      });
  });

  // it(`should not get nonexistant id`, () => {
  //   return request(app.getHttpServer())
  //       .get(`article/${data.id}/author/${data.authorId}`)
  //       .expect(200)
  // .then((res) => {
  //     console.log('r', res.body);
  //   })
  //       .catch((err) => {
  //         console.log('e', err);
  //       });
  // });

  it(`should edit the test article`, () => {
    data.content = 'Testing with jest updated';
    return request(app.getHttpServer())
      .put(`/article/${data.id}/update`)
      .send({
        content: 'Testing with jest updated',
      })
      .expect(200)
      .expect({ statusCode: 200, data });
  });

  it(`should change article privacy`, () => {
    return request(app.getHttpServer())
      .put(`/article/${data.id}/privacy`)
      .expect(200);
  });

  it(`should delete the test article`, () => {
    return request(app.getHttpServer())
      .delete(`/article/${data.id}`)
      .expect(200);
  });

  it(`should get all user articles`, () => {
    return request(app.getHttpServer())
      .get(`/article/${data.authorId}/user/all`)
      .expect(200);
  });

  it(`should get public articles`, () => {
    return request(app.getHttpServer())
      .get('/article/public/articles')
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

describe('ArticleController E2E Tests without mocked guards', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it(`should create article`, () => {
    return request(app.getHttpServer())
      .post('/article/')
      .send({
        authorId: 'd907eb05-f321-4c80-b878-b141557bab1b',
        title: 'e2e',
        description: 'Testing Article Api',
        content: 'Testing with jest',
        category: 'documentary',
        isPrivate: false,
      })
      .expect(401);
  });

  it(`should edit the test article`, () => {
    return request(app.getHttpServer())
      .put(`/article/id/update`)
      .send({
        content: 'Testing with jest updated',
      })
      .expect(401);
  });

  it(`should change article privacy`, () => {
    return request(app.getHttpServer()).put(`/article/id/privacy`).expect(401);
  });

  it(`should delete the test article`, () => {
    return request(app.getHttpServer()).delete(`/article/id`).expect(401);
  });

  it(`should get all user articles`, () => {
    return request(app.getHttpServer()).get(`/article/id/user/all`).expect(401);
  });

  it(`should get public articles`, () => {
    return request(app.getHttpServer())
      .get('/article/public/articles')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
