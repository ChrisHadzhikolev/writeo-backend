import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logging interceptor
 *
 * @class ArticleExceptionInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class ArticleExceptionInterceptor implements NestInterceptor {
  private logger: Logger = new Logger(ArticleExceptionInterceptor.name);

  /**
   * Intercepts Http requests
   *
   * @param {ExecutionContext} context context
   * @param {CallHandler} next call handler
   * @returns {Observable<any>}
   * @memberof <api_name>LoggingInterceptor
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { url, method } = context.switchToHttp().getRequest();

    const now = Date.now();
    const startTime = new Date().toISOString();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${method} - ${url} - ${Date.now() - now}ms - ${startTime}`,
          ),
        ),
      );
  }
}
