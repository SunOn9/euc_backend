import { HttpException, HttpStatus } from '@nestjs/common';

class CustomException extends HttpException {
  constructor(
    errorCode: string,
    errorMessage: string,
    httpStatus = HttpStatus.OK,
  ) {
    super(
      {
        statusCode: httpStatus,
        errorCode,
        message: errorMessage,
      },
      httpStatus,
    );
  }
}

export default CustomException;
