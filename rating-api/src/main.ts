import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_CONNECTION],
      queue: 'rating_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.listen().then(() => {
    console.log('listening');
  });
}
bootstrap();
