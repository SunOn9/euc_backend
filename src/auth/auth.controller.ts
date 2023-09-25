import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import CustomException from 'lib/utils/custom.exception'
import { SimpleReply } from '/generated/common'
import { LoginGuard } from './guard/local-auth.guard'
import * as CONST from '../prelude/constant'
import { CreateAuthRequestDto } from './dto/create-auth.dto'
import { AuthReply } from '/generated/auth/auth.reply'
import { LoginRequestDto } from './dto/login.dto'

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(LoginGuard)
  @Post('/login')
  async login(
    @Request() req,
    @Body() bodyData: LoginRequestDto,
  ): Promise<AuthReply> {
    const response = {} as AuthReply

    console.log(req.sessionID)
    console.log(req.session)

    const data = await this.service.create(bodyData.data, req.user.id)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }
}
