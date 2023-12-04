import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { PaymentSessionService } from './paymentSession.service'
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
  PaymentSessionListReply,
  PaymentSessionReply,
} from '/generated/paymentSession/paymentSession.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreatePaymentSessionRequestDto } from './dto/create-paymentSession.dto'
import * as CONST from '../prelude/constant'
import { GetPaymentSessionConditionRequestDto } from './dto/get-paymentSession-condition-request.dto'
import { UpdatePaymentSessionRequestDto } from './dto/update-paymentSession.dto'
import { SimpleReply } from '/generated/common'
import { RemovePaymentSessionRequestDto } from './dto/remove-paymentSession.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { PaymentSessionEntity } from './entities/paymentSession.entity'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('paymentSession')
export class PaymentSessionController {
  constructor(private readonly service: PaymentSessionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [PaymentSessionEntity],
    fields: [],
  })
  async createPaymentSession(
    @Req() req: Request,
    @Body() bodyData: CreatePaymentSessionRequestDto,
  ): Promise<PaymentSessionReply> {
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
    const response = {} as PaymentSessionReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [PaymentSessionEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updatePaymentSession(
    @Req() req: Request,
    @Body() bodyData: UpdatePaymentSessionRequestDto,
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
    subject: [PaymentSessionEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetPaymentSessionConditionRequestDto,
  ): Promise<PaymentSessionReply> {
    const response = {} as PaymentSessionReply
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
    subject: [PaymentSessionEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetPaymentSessionConditionRequestDto,
  ): Promise<PaymentSessionListReply> {
    const response = {} as PaymentSessionListReply
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
  async removePaymentSession(
    @Req() req: Request,
    @Param() request: RemovePaymentSessionRequestDto,
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

  @Get('confirm/:id')
  async confirmPaymentSession(
    @Req() req: Request,
    @Param() request: RemovePaymentSessionRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.confirm(
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
    response.payload = CONST.DEFAULT_UPDATE_SUCCESS_MESSAGE
    return response
  }

  @Get('done/:id')
  async donePaymentSession(
    @Req() req: Request,
    @Param() request: RemovePaymentSessionRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.done(
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
    response.payload = CONST.DEFAULT_UPDATE_SUCCESS_MESSAGE
    return response
  }
}
