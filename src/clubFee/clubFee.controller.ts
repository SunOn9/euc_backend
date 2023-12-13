import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ClubFeeService } from './clubFee.service'
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
} from '/generated/clubFee/clubFee.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateClubFeeRequestDto } from './dto/create-clubFee.dto'
import * as CONST from '../prelude/constant'
import { GetClubFeeConditionRequestDto } from './dto/get-clubFee-condition-request.dto'
import { SimpleReply } from '/generated/common'
import { RemoveClubFeeRequestDto } from './dto/remove-clubFee.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { EnumProto_UserRole } from '/generated/enumps'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('clubFee')
export class ClubFeeController {
  constructor(private readonly service: ClubFeeService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: ['club_fee'],
    fields: [],
  })
  async createClubFee(
    @Req() req: Request,
    @Body() bodyData: CreateClubFeeRequestDto,
  ): Promise<ClubFeeReply> {
    const response = {} as ClubFeeReply

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

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Get('detail')
  @CheckPermissions({
    action: [Action.READ],
    subject: ['club_fee'],
    fields: [],
  })
  async getDetail(
    @Req() req: Request,
    @Query() request: GetClubFeeConditionRequestDto,
  ): Promise<ClubFeeReply> {
    if (req['userInfo'].role !== EnumProto_UserRole.ADMIN) {
      request.clubId = req['userInfo'].club.id
    }

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
    subject: ['club_fee'],
    fields: [],
  })
  async getList(
    @Req() req: Request,
    @Query() request: GetClubFeeConditionRequestDto,
  ): Promise<ClubFeeListReply> {
    if (req['userInfo'].role !== EnumProto_UserRole.ADMIN) {
      request.clubId = req['userInfo'].club.id
    }

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

  @CheckPermissions({
    action: [Action.DELETE],
    subject: ['club_fee'],
    fields: [],
  })
  @Get('remove/:id')
  async removeClubFee(
    @Req() req: Request,
    @Param() request: RemoveClubFeeRequestDto,
  ): Promise<SimpleReply> {
    if (req['userInfo'].role !== EnumProto_UserRole.ADMIN) {
      request.clubId = req['userInfo'].club.id
    }
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
