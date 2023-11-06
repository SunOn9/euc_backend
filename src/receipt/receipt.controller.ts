import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ReceiptService } from './receipt.service'
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
  ReceiptListReply,
  ReceiptReply,
} from '/generated/receipt/receipt.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateReceiptRequestDto } from './dto/create-receipt.dto'
import * as CONST from '../prelude/constant'
import { GetReceiptConditionRequestDto } from './dto/get-receipt-condition-request.dto'
import { UpdateReceiptRequestDto } from './dto/update-receipt.dto'
import { SimpleReply } from '/generated/common'
import { RemoveReceiptRequestDto } from './dto/remove-receipt.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { ReceiptEntity } from './entities/receipt.entity'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('receipt')
export class ReceiptController {
  constructor(private readonly service: ReceiptService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [ReceiptEntity],
    fields: [],
  })
  async createReceipt(
    @Req() req: Request,
    @Body() bodyData: CreateReceiptRequestDto,
  ): Promise<ReceiptReply> {
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
    const response = {} as ReceiptReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [ReceiptEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateReceipt(
    @Req() req: Request,
    @Body() bodyData: UpdateReceiptRequestDto,
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
    subject: [ReceiptEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetReceiptConditionRequestDto,
  ): Promise<ReceiptReply> {
    const response = {} as ReceiptReply
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
    subject: [ReceiptEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetReceiptConditionRequestDto,
  ): Promise<ReceiptListReply> {
    const response = {} as ReceiptListReply
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
  async removeReceipt(
    @Req() req: Request,
    @Param() request: RemoveReceiptRequestDto,
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
