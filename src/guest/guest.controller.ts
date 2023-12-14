import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { GuestService } from './guest.service'
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
import { GuestListReply, GuestReply } from '/generated/guest/guest.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateGuestRequestDto } from './dto/create-guest.dto'
import * as CONST from '../prelude/constant'
import { GetGuestConditionRequestDto } from './dto/get-guest-condition-request.dto'
import { UpdateGuestRequestDto } from './dto/update-guest.dto'
import { SimpleReply } from '/generated/common'
import { RemoveGuestRequestDto } from './dto/remove-guest.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('guest')
export class GuestController {
  constructor(private readonly service: GuestService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: ['guest'],
    fields: [],
  })
  async createGuest(
    @Req() req: Request,
    @Body() bodyData: CreateGuestRequestDto,
  ): Promise<GuestReply> {
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
    const response = {} as GuestReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: ['guest'],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateGuest(
    @Req() req: Request,
    @Body() bodyData: UpdateGuestRequestDto,
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

  @Get('detail')
  @CheckPermissions({
    action: [Action.READ],
    subject: ['guest'],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetGuestConditionRequestDto,
  ): Promise<GuestReply> {
    const response = {} as GuestReply
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
    subject: ['guest'],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetGuestConditionRequestDto,
  ): Promise<GuestListReply> {
    const response = {} as GuestListReply
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
  @CheckPermissions({
    action: [Action.DELETE],
    subject: ['guest'],
    fields: [],
  })
  async removeGuest(
    @Req() req: Request,
    @Param() request: RemoveGuestRequestDto,
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
}
