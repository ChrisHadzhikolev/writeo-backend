import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from '../../database/entities/article.entity';
import { ClientProxy } from '@nestjs/microservices';
import { take } from 'rxjs';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @Inject('RATING_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(article: Article) {
    return await this.articleRepository.save(article);
  }

  async getArticleValue(articleId) {
    return new Promise((resolve) => {
      this.client
        .send('ratingValue', articleId)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res.statusCode == 200) {
            resolve(res.data);
          } else {
            throw new InternalServerErrorException();
          }
        });
    });
  }

  async getUserRating(params) {
    return new Promise((resolve) => {
      this.client
        .send('getUserRating', params)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res.data) {
            resolve(res.data);
          } else {
            return null;
          }
        });
    });
  }

  // TODO check if article exists
  async createArticleRating(params) {
    return new Promise((resolve) => {
      this.client
        .send('createRating', params)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res.data) {
            resolve(res.data);
          } else {
            throw new NotFoundException();
          }
        });
    });
  }

  //TODO check if article exists
  async changeRating(params) {
    return new Promise((resolve) => {
      this.client
        .send('changeRating', params)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res.data) {
            resolve(res.data);
          } else {
            throw new NotFoundException();
          }
        });
    });
  }

  async getArticleById(id: string) {
    return await this.articleRepository.findOne(id);
  }

  async getAllPublic() {
    return await this.articleRepository.find({ where: { isPrivate: false } });
  }

  async getAll(id: string) {
    return await this.articleRepository.find({ where: { authorId: id } });
  }

  async updateArticle(id: string, article: Article) {
    return await this.articleRepository.update(id, article);
  }

  async setArticlePrivacy(id: string) {
    const articleObj = await this.articleRepository.findOne(id);
    articleObj.isPrivate = !articleObj.isPrivate;
    return await this.articleRepository.save(articleObj);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async deleteArticleById(id: string): Promise<boolean> {
    await this.articleRepository
      .delete(id)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}
