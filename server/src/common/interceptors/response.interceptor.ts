import {
  CallHandler,
  ExecutionContext,
  Injectable,
  // Logger,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  error: boolean;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  // constructor(private readonly logger: Logger) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((resData): Response<T> => {
        return {
          data: resData,
          message: resData?.message || 'success',
          error: false,
          statusCode: context.switchToHttp().getResponse().statusCode,
        };
      }),
    );
  }
}
