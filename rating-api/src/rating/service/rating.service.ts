import { Injectable } from '@nestjs/common';
import { Repository, getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating } from '../../database/entities/rating.entity';
import { RatingModule } from '../rating.module';
import { RatingValue } from '../models/ratingValue.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async create(articleId: string, userId: string, rating: number) {
    console.log(articleId);
    if (
      await this.ratingRepository.findOne({
        where: { user: userId, articleId: articleId },
      })
    ) {
      return null;
    }
    const ratingObj = new Rating();
    ratingObj.rating = rating;
    ratingObj.user = userId;
    ratingObj.articleId = articleId;
    console.log(articleId);
    return await this.ratingRepository.save(ratingObj);
  }

  async changeRating(articleId: string, userId: string, rating: number) {
    const ratingObj = await this.ratingRepository.findOne({
      where: { articleId: articleId, user: userId },
    });
    if (!ratingObj) {
      return null;
    }
    ratingObj.rating = rating;
    return await this.ratingRepository.save(ratingObj);
  }

  async getUserRating(articleId: string, userId: string) {
    return await this.ratingRepository.findOne({
      where: { articleId: articleId, user: userId },
    });
  }

  async getRatingCount(articleId: string) {
    return await this.ratingRepository.count({
      where: { articleId: articleId },
    });
  }

  async getRatingValue(articleId: string) {
    const count = await this.ratingRepository.count({
      where: { articleId: articleId },
    });
    const ratings = await this.ratingRepository.find({
      where: { articleId: articleId },
    });
    let sum = 0;
    ratings.forEach((rating) => {
      sum += rating.rating;
    });

    console.log(sum / ratings.length);

    return { ratingCnt: count, ratingAvg: sum / ratings.length } as RatingValue;
  }

  async getRatingOverall(articleId: string) {
    return await getConnection()
      .createQueryBuilder(Rating, 'rating')
      .select('AVG(rating.rating)')
      .where(`rating.articleId = ${articleId}`)
      .execute();
  }
}
