import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateAuthRequestDto } from './dto/create-auth.dto';
import { AuthListReply, AuthReply } from 'src/generated/auth/auth.reply';
import { GetAuthConditionRequestDto } from './dto/get-condition-auth.dto';
import CustomException from 'lib/utils/custom.exception';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly service: AuthService) {}

  // @GrpcMethod('AuthService', 'CreateAuth')
  // async createAuth(request: CreateAuthRequestDto): Promise<AuthReply> {
  //   const response = {} as AuthReply;
  //   const data = await this.service.create(request);
  //   if (data.isErr()) {
  //     throw new CustomException(
  //       'ERROR',
  //       data.error.message,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   response.statusCode = 200;
  //   response.message = 'success';
  //   response.payload = data.value;
  //   return response;
  // }

  @GrpcMethod('AuthService', 'GetAuth')
  async getAuth(request: GetAuthConditionRequestDto): Promise<AuthReply> {
    const response = {} as AuthReply;
    const data = await this.service.getDetail(request);
    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
    response.statusCode = 200;
    response.message = 'success';
    response.payload = data.value;
    return response;
  }

  // @Get('list')
  // async getListAuth(request: GetAuthConditionRequestDto): Promise<AuthListReply> {
  //   const response = {} as AuthReply;
  //   const data = await this.service.(request);
  //   if (data.isErr()) {
  //     throw new CustomException(
  //       'ERROR',
  //       data.error.message,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   response.statusCode = 200;
  //   response.message = 'success';
  //   response.payload = data.value;
  //   return response;
  // }
}
