import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Post,
    Put,
    UseFilters,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { SoundtrackService } from '../service/soundtrack.service';
import { Soundtrack } from '../../database/entities/soundtrack.entity';
import { HttpExceptionFilter } from '../../filters/http-exception.filter';
import { HttpResponseInterceptor } from '../../interceptors/http-response.interceptor';
import { ArticleExceptionInterceptor } from '../../interceptors/article-exception.interceptor';

@Controller('soundtrack')
@UseFilters(new HttpExceptionFilter())
@UseInterceptors(HttpResponseInterceptor)
@UseInterceptors(ArticleExceptionInterceptor)
export class SoundtrackController {
    constructor(private soundtrackService: SoundtrackService) {
    }

}
