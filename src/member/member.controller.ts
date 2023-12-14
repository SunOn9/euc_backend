import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { MemberService } from './member.service'
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
import { MemberListReply, MemberReply } from '/generated/member/member.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateMemberRequestDto } from './dto/create-member.dto'
import * as CONST from '../prelude/constant'
import { GetMemberConditionRequestDto } from './dto/get-member-condition-request.dto'
import { UpdateMemberRequestDto } from './dto/update-member.dto'
import { SimpleReply } from '/generated/common'
import { RemoveMemberRequestDto } from './dto/remove-member.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { UpdateClubOfMemberRequestDto } from './dto/update-club-of-member.dto'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('member')
export class MemberController {
  constructor(private readonly service: MemberService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: ['member'],
    fields: [],
  })
  async createMember(
    @Req() req: Request,
    @Body() bodyData: CreateMemberRequestDto,
  ): Promise<MemberReply> {
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
    const response = {} as MemberReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: ['member'],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateMember(
    @Req() req: Request,
    @Body() bodyData: UpdateMemberRequestDto,
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

  @Post('change-club')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: ['member'],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateClubOfMember(
    @Req() req: Request,
    @Body() bodyData: UpdateClubOfMemberRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.updateClubOfMember(
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
    subject: ['member'],
    fields: [],
  })
  async getDetail(
    @Req() req: Request,
    @Query() request: GetMemberConditionRequestDto,
  ): Promise<MemberReply> {
    const response = {} as MemberReply
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
    subject: ['member'],
    fields: [],
  })
  async getList(
    @Req() req: Request,
    @Query() request: GetMemberConditionRequestDto,
  ): Promise<MemberListReply> {
    const response = {} as MemberListReply
    const listData = await this.service.getList(request, req['userInfo'],)

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
    subject: ['member'],
    fields: [],
  })
  async removeMember(
    @Req() req: Request,
    @Param() request: RemoveMemberRequestDto,
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
