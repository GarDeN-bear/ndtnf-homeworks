import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message =
      (typeof exception.getResponse() === 'string'
        ? exception.getResponse()
        : exception.getResponse()?.message) ?? 'Internal server error';
    response.status(status || 500).json({
      timestamp: new Date().toISOString(),
      status: 'fail',
      data: message,
      code: status || 500,
    });
  }
}
