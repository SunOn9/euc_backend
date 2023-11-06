import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ReceiptSessionService } from './receipt-session.service'
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
import {
  ReceiptSessionListReply,
  ReceiptSessionReply,
} from '/generated/receipt-session/receipt-session.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateReceiptSessionRequestDto } from './dto/create-receipt-session.dto'
import * as CONST from '../prelude/constant'
import { GetReceiptSessionConditionRequestDto } from './dto/get-receipt-session-condition-request.dto'
import { UpdateReceiptSessionRequestDto } from './dto/update-receipt-session.dto'
import { SimpleReply } from '/generated/common'
import { RemoveReceiptSessionRequestDto } from './dto/remove-receipt-session.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { ReceiptSessionEntity } from './entities/receipt-session.entity'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('receipt-session')
export class ReceiptSessionController {
  constructor(private readonly service: ReceiptSessionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [ReceiptSessionEntity],
    fields: [],
  })
  async createReceiptSession(
    @Req() req: Request,
    @Body() bodyData: CreateReceiptSessionRequestDto,
  ): Promise<ReceiptSessionReply> {
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
    const response = {} as ReceiptSessionReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [ReceiptSessionEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateReceiptSession(
    @Req() req: Request,
    @Body() bodyData: UpdateReceiptSessionRequestDto,
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
    subject: [ReceiptSessionEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetReceiptSessionConditionRequestDto,
  ): Promise<ReceiptSessionReply> {
    const response = {} as ReceiptSessionReply
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
    subject: [ReceiptSessionEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetReceiptSessionConditionRequestDto,
  ): Promise<ReceiptSessionListReply> {
    const response = {} as ReceiptSessionListReply
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
  async removeReceiptSession(
    @Req() req: Request,
    @Param() request: RemoveReceiptSessionRequestDto,
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
