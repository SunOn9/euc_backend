import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

//catch all exception  HTTP
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      errorCode: '',
      message: exception.getResponse()['message'].toString(),
    });
  }
}

// catch all exception HTTP transfer to GRPC
@Catch()
export class CustomRpcExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException): Observable<any> {
    let errorCode: string;
    if (exception instanceof HttpException) {
      errorCode = JSON.stringify(exception.getResponse());
    }
    const response = JSON.parse(errorCode);
    return of(response);
  }
}
