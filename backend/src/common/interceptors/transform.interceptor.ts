import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  meta?: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // If the controller already returned data and meta, pass it through.
        // Otherwise, wrap the result in `data` and set basic pagination meta if missing.
        if (data && data.hasOwnProperty('data')) {
          return {
            data: data.data,
            meta: data.meta || { page: 1, pageSize: 20, total: Array.isArray(data.data) ? data.data.length : 1 },
          };
        }
        return {
          data,
          meta: { page: 1, pageSize: 20, total: Array.isArray(data) ? data.length : 1 },
        };
      }),
    );
  }
}
