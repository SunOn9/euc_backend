import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'

//catch all exception  HTTP
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const status = exception.getStatus()

    if (exception.name === 'CustomException') {
      response.status(status).json({
        statusCode: status,
        errorCode: exception.getResponse()['errorCode'].toString(),
        message: exception.getResponse()['message'].toString(),
      })
    } else {
      response.status(status).json({
        statusCode: status,
        errorCode: exception.name,
        message: exception.getResponse()['message'].toString(),
      })
    }
  }
}
