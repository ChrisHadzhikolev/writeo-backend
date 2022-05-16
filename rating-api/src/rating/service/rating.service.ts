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

  async create(rating: Rating) {
    if (await this.ratingRepository.findOne({ where: { user: rating.user } })) {
      return null;
    }
    return await this.ratingRepository.save(rating);
  }

  async changeRating(rating: Rating) {
    const ratingObj = await this.ratingRepository.findOne({
      where: { articleId: rating.articleId, user: rating.user },
    });
    if (!ratingObj) {
      return null;
    }
    ratingObj.rating = rating.rating;
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
