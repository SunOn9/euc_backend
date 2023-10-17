import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ClubService } from './club.service'
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
import { ClubListReply, ClubReply } from '/generated/club/club.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateClubRequestDto } from './dto/create-club.dto'
import * as CONST from '../prelude/constant'
import { GetClubConditionRequestDto } from './dto/get-club-condition-request.dto'
import { UpdateClubRequestDto } from './dto/update-club.dto'
import { SimpleReply } from '/generated/common'
import { RemoveClubRequestDto } from './dto/remove-club.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { ClubEntity } from './entities/club.entity'

@UseGuards(PermissionsGuard)
@Controller('club')
export class ClubController {
  constructor(private readonly service: ClubService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [ClubEntity],
    fields: [],
  })
  async createClub(
    @Req() req: Request,
    @Body() bodyData: CreateClubRequestDto,
  ): Promise<ClubReply> {
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
    const response = {} as ClubReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [ClubEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateClub(
    @Req() req: Request,
    @Body() bodyData: UpdateClubRequestDto,
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
    subject: [ClubEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetClubConditionRequestDto,
  ): Promise<ClubReply> {
    const response = {} as ClubReply
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
    subject: [ClubEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetClubConditionRequestDto,
  ): Promise<ClubListReply> {
    const response = {} as ClubListReply
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
  async removeClub(
    @Req() req: Request,
    @Param() request: RemoveClubRequestDto,
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
