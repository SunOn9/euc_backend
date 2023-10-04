import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ClubFeeService } from './club-fee.service'
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
  ClubFeeListReply,
  ClubFeeReply,
} from '/generated/club-fee/club-fee.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateClubFeeRequestDto } from './dto/create-club-fee.dto'
import * as CONST from '../prelude/constant'
import { GetClubFeeConditionRequestDto } from './dto/get-club-fee-condition-request.dto'
import { SimpleReply } from '/generated/common'
import { RemoveClubFeeRequestDto } from './dto/remove-club-fee.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { ClubFeeEntity } from './entities/club-fee.entity'

@UseGuards(PermissionsGuard)
@Controller('clubFee')
export class ClubFeeController {
  constructor(private readonly service: ClubFeeService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [ClubFeeEntity],
    fields: [],
  })
  async createClubFee(
    @Req() req: Request,
    @Body() bodyData: CreateClubFeeRequestDto,
  ): Promise<ClubFeeReply> {
    const data = await this.service.create(req['userInfo'].id, bodyData)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    const response = {} as ClubFeeReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Get('detail')
  @CheckPermissions({
    action: [Action.READ],
    subject: [ClubFeeEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetClubFeeConditionRequestDto,
  ): Promise<ClubFeeReply> {
    const response = {} as ClubFeeReply
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
    subject: [ClubFeeEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetClubFeeConditionRequestDto,
  ): Promise<ClubFeeListReply> {
    const response = {} as ClubFeeListReply
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
  async removeClubFee(
    // @Req() req: Request,
    @Param() request: RemoveClubFeeRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.remove(request)

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
