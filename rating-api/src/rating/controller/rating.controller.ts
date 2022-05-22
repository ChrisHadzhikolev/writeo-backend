import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { HttpResponseInterceptor } from '../../interceptors/http-response.interceptor';
import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { RatingExceptionInterceptor } from '../../interceptors/rating-exception.interceptor';
import { Rating } from '../../database/entities/rating.entity';
import { RatingService } from '../service/rating.service';
import { RatingValue } from '../models/ratingValue.dto';

@Controller('rating')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(HttpResponseInterceptor)
@UseInterceptors(RatingExceptionInterceptor)
export class RatingController {
  constructor(private ratingService: RatingService) {}

  // @hasRole(Role.User)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Get()
  @EventPattern('createRating')
  async createRating(data) {
    return await this.ratingService.create(
      data.id,
      data.userId,
      data.rating,
    );
  }

  @EventPattern('changeRating')
  async changeRating(data) {
    console.log('data', data);
    return await this.ratingService.changeRating(
      data.id,
      data.userId,
      data.rating,
    );
  }

  @EventPattern('getUserRating')
  async getUserRating(data) {
    return await this.ratingService.getUserRating(data.id, data.userId);
  }

  @MessagePattern('ratingValue')
  async getRatingCount(@Payload() data): Promise<RatingValue> {
    return await this.ratingService.getRatingValue(data.id);
  }

  // @MessagePattern('ratingCount')
  // async getRatingValue(
  //   @Payload() data: string,
  // ): Promise<number> {
  //   // console.log(this.ratingService.getRatingCount(data));
  //   return this.ratingService.getRatingCount(data);
  // }

  // @EventPattern('ratingAverage')
  // async getRatingAverage(data: string) {
  //   return await this.ratingService.getRatingOverall(data);
  // }
}
