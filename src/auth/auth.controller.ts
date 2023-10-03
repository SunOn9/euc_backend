import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpStatus,
  SetMetadata,
  Get,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import CustomException from 'lib/utils/custom.exception'
import { LoginGuard } from './guard/local-auth.guard'
import * as CONST from '../prelude/constant'
import { LoginRequestDto } from './dto/login.dto'
import { SessionService } from '/session/session.service'
import { SimpleReply } from '/generated/common'
import { UserReply } from '/generated/user/user.reply'

// eslint-disable-next-line @typescript-eslint/naming-convention
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
  ): Promise<UserReply> {
    const response = {} as UserReply

    bodyData.data.sessionId = req.sessionID

    const data = await this.service.create(bodyData.data, req.user.id)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.sessionService.set(
      req.sessionID,
      req.session.cookie._expires,
      req.session.passport.user,
    )

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = req.user
    return response
  }

  @Get('/logout')
  async logout(@Request() req: any): Promise<SimpleReply> {
    const response = {} as SimpleReply

    await this.sessionService.del(req.sessionID)

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = 'success'
    return response
  }

  @Get('check')
  async check(): Promise<boolean> {
    return true
  }
}
