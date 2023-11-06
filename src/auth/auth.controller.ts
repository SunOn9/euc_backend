import {
  Controller,
  Request,
  Post,
  Body,
  HttpStatus,
  SetMetadata,
  Get,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import CustomException from 'lib/utils/custom.exception'
import * as CONST from '../prelude/constant'
import { LoginRequestDto } from './dto/login.dto'
import { SessionService } from '/session/session.service'
import { SimpleReply } from '/generated/common'
import { UserReply } from '/generated/user/user.reply'
import { UtilsService } from 'lib/utils'
import { User } from '/generated/user/user'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

// eslint-disable-next-line @typescript-eslint/naming-convention
const AllowUnauthorizedRequest = () =>
  SetMetadata('allowUnauthorizedRequest', true)

@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly sessionService: SessionService,
    private readonly ultilService: UtilsService,
  ) {}

  @Post('/login')
  @AllowUnauthorizedRequest()
  async login(
    @Request() req: any,
    @Body() bodyData: LoginRequestDto,
  ): Promise<UserReply> {
    const response = {} as UserReply

    const valiedateReply = await this.service.validateUser(
      bodyData.username,
      bodyData.password,
    )

    if (valiedateReply === null) {
      throw new UnauthorizedException()
    }

    bodyData.data.sessionId = req.sessionID

    const data = await this.service.create(bodyData.data, valiedateReply.id)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    const expire = this.ultilService.addDays(new Date(), 30)

    await this.sessionService.set(req.sessionID, expire, valiedateReply)

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = valiedateReply as User
    response.extraData = { sessionId: req.sessionID }
    return response
  }

  @ApiHeader({
    name: 'sessionId',
    description: 'Session',
    required: true,
  })
  @Get('/logout')
  async logout(@Request() req: any): Promise<SimpleReply> {
    const response = {} as SimpleReply

    await this.sessionService.del(req.sessionID)

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = 'success'
    return response
  }

  @ApiHeader({
    name: 'sessionId',
    description: 'Session',
    required: true,
  })
  @Get('check')
  async check(): Promise<SimpleReply> {
    const response = {} as SimpleReply
    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = 'success'
    return response
  }
}
