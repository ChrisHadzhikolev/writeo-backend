import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArticleService } from '../service/article.service';
import { Article } from '../../database/entities/article.entity';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { HttpResponseInterceptor } from '../../interceptors/http-response.interceptor';
import { ArticleExceptionInterceptor } from '../../interceptors/article-exception.interceptor';
import { Role } from '../../auth/enumerator/roles.enum';
import { hasRole } from '../../auth/decorators/role.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('article')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(HttpResponseInterceptor)
@UseInterceptors(ArticleExceptionInterceptor)
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @hasRole(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() article: Article): Promise<Article> {
    try {
      return await this.articleService.create(article);
    } catch (e) {
      throw new InternalServerErrorException('');
    }
  }

  @hasRole(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/author/:aid')
  async getArticleById(@Param() id): Promise<Article> {
    try {
      const articleObj = await this.articleService.getArticleById(id.id);
      console.log(articleObj);
      if (articleObj.isPrivate) {
        if (articleObj.authorId == id.aid) {
          return articleObj;
        } else {
          throw new ForbiddenException();
        }
      } else {
        return articleObj;
      }
    } catch (e) {
      throw new InternalServerErrorException('');
    }
  }

  @hasRole(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id/user/all')
  async getAllUserArticles(@Param() id: string): Promise<Article[]> {
    try {
      return await this.articleService.getAll(id);
    } catch (e) {
      throw new InternalServerErrorException('');
    }
  }

  @hasRole(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/public/articles')
  async getAllPublicArticles(): Promise<Article[]> {
    try {
      return await this.articleService.getAllPublic();
    } catch (e) {
      throw new InternalServerErrorException('');
    }
  }

  @hasRole(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/update')
  async updateArticle(@Param() id: string, @Body() article): Promise<Article> {
    try {
      await this.articleService.updateArticle(id, article);
      return this.articleService.getArticleById(id);
    } catch (e) {
      throw new InternalServerErrorException('');
    }
  }

  @hasRole(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/privacy')
  async changePrivacy(@Param() id: string): Promise<Article> {
    try {
      return await this.articleService.setArticlePrivacy(id);
    } catch (e) {
      throw new InternalServerErrorException('');
    }
  }

  @hasRole(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteArticleById(@Param() id: string): Promise<boolean> {
    try {
      return await this.articleService.deleteArticleById(id);
    } catch (e) {
      throw new InternalServerErrorException('');
    }
  }
}
