import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '../database/entities/article.entity';
import { ArticleService } from './service/article.service';
import { ArticleController } from './controller/article.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    ClientsModule.register([
      {
        name: 'RATING_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_CONNECTION,
          ],
          queue: 'rating_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
