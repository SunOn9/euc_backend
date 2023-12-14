import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { PlaceService } from './place.service'
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
import { PlaceListReply, PlaceReply } from '/generated/place/place.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreatePlaceRequestDto } from './dto/create-place.dto'
import * as CONST from '../prelude/constant'
import { GetPlaceConditionRequestDto } from './dto/get-place-condition-request.dto'
import { UpdatePlaceRequestDto } from './dto/update-place.dto'
import { SimpleReply } from '/generated/common'
import { RemovePlaceRequestDto } from './dto/remove-place.dto'
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
@Controller('place')
export class PlaceController {
  constructor(private readonly service: PlaceService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: ['place'],
    fields: [],
  })
  async createPlace(
    @Req() req: Request,
    @Body() bodyData: CreatePlaceRequestDto,
  ): Promise<PlaceReply> {
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
    const response = {} as PlaceReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: ['place'],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updatePlace(
    @Req() req: Request,
    @Body() bodyData: UpdatePlaceRequestDto,
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
    subject: ['place'],
    fields: [],
  })
  async getDetail(
    @Req() req: Request,
    @Query() request: GetPlaceConditionRequestDto,
  ): Promise<PlaceReply> {
    const response = {} as PlaceReply
    const data = await this.service.getDetail(request, req['userInfo'])

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
    subject: ['place'],
    fields: [],
  })
  async getList(
    @Req() req: Request,
    @Query() request: GetPlaceConditionRequestDto,
  ): Promise<PlaceListReply> {
    const response = {} as PlaceListReply
    const listData = await this.service.getList(request, req['userInfo'])

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
    subject: ['place'],
    fields: [],
  })
  async removePlace(
    @Req() req: Request,
    @Param() request: RemovePlaceRequestDto,
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
