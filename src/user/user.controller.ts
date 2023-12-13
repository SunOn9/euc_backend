import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { UserService } from './user.service'
import { HttpCode } from '@nestjs/common/decorators/http/http-code.decorator'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator'
import {
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator'
import { UserListReply, UserReply } from '/generated/user/user.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateUserRequestDto } from './dto/create-user.dto'
import * as CONST from '../prelude/constant'
import { GetUserConditionRequestDto } from './dto/get-user-condition-request.dto'
import { UpdateUserRequestDto } from './dto/update-user.dto'
import { SimpleReply } from '/generated/common'
import { RemoveUserRequestDto } from './dto/remove-user.dto'
import { SetMetadata, UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'
import { ResetPasswordRequestDto } from './dto/reset-password.dto'
import { UpdatePasswordRequestDto } from './dto/update-password.dto'
import { UpdateUserPermissionRequestDto } from './dto/update-user-permission.dto'

// eslint-disable-next-line @typescript-eslint/naming-convention
// const AllowUnauthorizedRequest = () =>
//   SetMetadata('allowUnauthorizedRequest', true)

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: ['user'],
    fields: [],
  })
  async createUser(
    @Req() req: Request,
    @Body() bodyData: CreateUserRequestDto,
  ): Promise<UserReply> {
    const data = await this.service.create(
      bodyData,
      req['sessionId'],
      req['userInfo'],
    )

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    const response = {} as UserReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: ['user'],
    fields: [],
    conditions: {},
  })
  @HttpCode(HttpStatus.CREATED)
  async updateUser(
    @Req() req: Request,
    @Body() bodyData: UpdateUserRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.update(
      bodyData,
      req['sessionId'],
      req['userInfo'],
    )

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = CONST.DEFAULT_UPDATE_SUCCESS_MESSAGE
    return response
  }

  @Post('updateUserPassword')
  @HttpCode(HttpStatus.CREATED)
  async updateUserPassword(
    @Req() req: Request,
    @Body() bodyData: UpdatePasswordRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.updatePassword(
      req['sessionId'],
      req['userInfo']['id'],
      bodyData,
    )

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = CONST.DEFAULT_UPDATE_SUCCESS_MESSAGE
    return response
  }

  @Post('resetPassword')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: ['user'],
    fields: [],
    conditions: {},
  })
  @HttpCode(HttpStatus.CREATED)
  async resrtUserPassword(
    @Req() req: Request,
    @Body() bodyData: ResetPasswordRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.resetPassword(bodyData.id)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = CONST.DEFAULT_UPDATE_SUCCESS_MESSAGE
    return response
  }

  @Get('detail')
  @CheckPermissions({
    action: [Action.READ],
    subject: ['user'],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetUserConditionRequestDto,
  ): Promise<UserReply> {
    const response = {} as UserReply
    const data = await this.service.getDetail(request)

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

  @Get('list')
  @CheckPermissions({
    action: [Action.READ],
    subject: ['user'],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetUserConditionRequestDto,
  ): Promise<UserListReply> {
    const response = {} as UserListReply
    const listData = await this.service.getList(request)

    if (listData.isErr()) {
      throw new CustomException(
        'ERROR',
        listData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = listData.value
    return response
  }

  @Get('remove/:id')
  async removeUser(
    @Req() req: Request,
    @Param() request: RemoveUserRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.remove(
      request,
      req['sessionId'],
      req['userInfo'],
    )

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = CONST.DEFAULT_REMOVE_SUCCESS_MESSAGE
    return response
  }

  @Post('update-permission')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: ['user'],
    fields: [],
    conditions: {
      club: 'user.club',
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async updateUserPermission(
    @Req() req: Request,
    @Body() bodyData: UpdateUserPermissionRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.updateUserPermission(
      bodyData,
      req['sessionId'],
      req['userInfo'],
    )

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = CONST.DEFAULT_UPDATE_SUCCESS_MESSAGE
    return response
  }
}
