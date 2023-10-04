import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { AreaService } from './area.service'
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
  // Req,
} from '@nestjs/common/decorators/http/route-params.decorator'
import { AreaListReply, AreaReply } from '/generated/area/area.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateAreaRequestDto } from './dto/create-area.dto'
import * as CONST from '../prelude/constant'
import { GetAreaConditionRequestDto } from './dto/get-area-condition-request.dto'
import { UpdateAreaRequestDto } from './dto/update-area.dto'
import { SimpleReply } from '/generated/common'
import { RemoveAreaRequestDto } from './dto/remove-area.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { AreaEntity } from './entities/area.entity'

@UseGuards(PermissionsGuard)
@Controller('area')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [AreaEntity],
    fields: [],
  })
  async createArea(
    // @Req() req: Request,
    @Body() bodyData: CreateAreaRequestDto,
  ): Promise<AreaReply> {
    const data = await this.service.create(bodyData)

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }
    const response = {} as AreaReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [AreaEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateArea(
    // @Req() req: Request,
    @Body() bodyData: UpdateAreaRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.update(bodyData)

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
    subject: [AreaEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetAreaConditionRequestDto,
  ): Promise<AreaReply> {
    const response = {} as AreaReply
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
    subject: [AreaEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetAreaConditionRequestDto,
  ): Promise<AreaListReply> {
    const response = {} as AreaListReply
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
  async removeArea(
    // @Req() req: Request,
    @Param() request: RemoveAreaRequestDto,
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
