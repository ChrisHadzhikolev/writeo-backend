import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Exception filter for Http errors
 *
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private logger: Logger = new Logger(HttpExceptionFilter.name);

    /**
     * Catch the Http Exception
     *
     * Logs the error for analysis and return a formatted error response
     *
     * @param {HttpException} exception the thrown exception
     * @param {ArgumentsHost} host host
     * @memberof HttpExceptionFilter
     */
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const date: string = new Date().toISOString();
        let errorMessage: string = null;
        if (typeof exception.getResponse() === 'object') {
            errorMessage = exception.getResponse().toString();
        }

        this.logger.error(
            `${request.method} - ${request.url} - ${status} - ${date} - ${errorMessage}`,
        );

        response.status(status).send({
            statusCode: status,
            timestamp: date,
            path: request.url,
            message: errorMessage,
        });
    }
}
