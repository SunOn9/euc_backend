import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { PaymentService } from './payment.service'
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
import { PaymentListReply, PaymentReply } from '/generated/payment/payment.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreatePaymentRequestDto } from './dto/create-payment.dto'
import * as CONST from '../prelude/constant'
import { GetPaymentConditionRequestDto } from './dto/get-payment-condition-request.dto'
import { UpdatePaymentRequestDto } from './dto/update-payment.dto'
import { SimpleReply } from '/generated/common'
import { RemovePaymentRequestDto } from './dto/remove-payment.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { PaymentEntity } from './entities/payment.entity'

@UseGuards(PermissionsGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly service: PaymentService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [PaymentEntity],
    fields: [],
  })
  async createPayment(
    @Req() req: Request,
    @Body() bodyData: CreatePaymentRequestDto,
  ): Promise<PaymentReply> {
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
    const response = {} as PaymentReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [PaymentEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updatePayment(
    @Req() req: Request,
    @Body() bodyData: UpdatePaymentRequestDto,
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
    subject: [PaymentEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetPaymentConditionRequestDto,
  ): Promise<PaymentReply> {
    const response = {} as PaymentReply
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
    subject: [PaymentEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetPaymentConditionRequestDto,
  ): Promise<PaymentListReply> {
    const response = {} as PaymentListReply
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
  async removePayment(
    @Req() req: Request,
    @Param() request: RemovePaymentRequestDto,
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
