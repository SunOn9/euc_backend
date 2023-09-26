import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import CustomException from 'lib/utils/custom.exception'
import { LoginGuard } from './guard/local-auth.guard'
import * as CONST from '../prelude/constant'
import { AuthReply } from '/generated/auth/auth.reply'
import { LoginRequestDto } from './dto/login.dto'
import { SessionService } from '/session/session.service'

const AllowUnauthorizedRequest = () =>
  SetMetadata('allowUnauthorizedRequest', true)

@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  @UseGuards(LoginGuard)
  @Post('/login')
  @AllowUnauthorizedRequest()
  async login(
    @Request() req: any,
    @Body() bodyData: LoginRequestDto,
  ): Promise<AuthReply> {
    const response = {} as AuthReply

    const data = await this.service.create(bodyData.data, req.user.id)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.sessionService.set(req.sessionId, req.session)

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }
}
