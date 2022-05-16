import { Module } from '@nestjs/common';
import { RatingController } from './controller/rating.controller';
import { Rating } from '../database/entities/rating.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {RatingService} from "./service/rating.service";

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  providers: [RatingService],
  controllers: [RatingController],
  exports: [],
})
export class RatingModule {}
