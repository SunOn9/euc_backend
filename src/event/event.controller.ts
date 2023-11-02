import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { EventService } from './event.service'
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
  // Req,
} from '@nestjs/common/decorators/http/route-params.decorator'
import { EventListReply, EventReply } from '/generated/event/event.reply'
import CustomException from 'lib/utils/custom.exception'
import { CreateEventRequestDto } from './dto/create-event.dto'
import * as CONST from '../prelude/constant'
import { GetEventConditionRequestDto } from './dto/get-event-condition-request.dto'
import { UpdateEventRequestDto } from './dto/update-event.dto'
import { SimpleReply } from '/generated/common'
import { RemoveEventRequestDto } from './dto/remove-event.dto'
import { UseGuards } from '@nestjs/common'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '../permission/casl/casl.type'
import { EventEntity } from './entities/event.entity'
import { AddMemberToEventRequestDto } from './dto/add-member.dto'
import { AddGuestToEventRequestDto } from './dto/add-guest.dto'
import { RemoveGuestFromEventRequestDto } from './dto/remove-guest.dto'
import { RemoveMemberFromEventRequestDto } from './dto/remove-member.dto'
import { EndEventRequestDto } from './dto/end-event.dto'

@UseGuards(PermissionsGuard)
@Controller('event')
export class EventController {
  constructor(private readonly service: EventService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [EventEntity],
    fields: [],
  })
  async createEvent(
    @Req() req: Request,
    @Body() bodyData: CreateEventRequestDto,
  ): Promise<EventReply> {
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
    const response = {} as EventReply

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = data.value
    return response
  }

  @Post('update')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [EventEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async updateEvent(
    @Req() req: Request,
    @Body() bodyData: UpdateEventRequestDto,
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
    subject: [EventEntity],
    fields: [],
  })
  async getDetail(
    // @Req() req: Request,
    @Query() request: GetEventConditionRequestDto,
  ): Promise<EventReply> {
    const response = {} as EventReply
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
    subject: [EventEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetEventConditionRequestDto,
  ): Promise<EventListReply> {
    const response = {} as EventListReply
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
  async removeEvent(
    @Req() req: Request,
    @Param() request: RemoveEventRequestDto,
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

  @Post('add-member')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [EventEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async addMember(
    @Req() req: Request,
    @Body() bodyData: AddMemberToEventRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.addMember(
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

  @Post('remove-member')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [EventEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async removeMember(
    @Req() req: Request,
    @Body() bodyData: RemoveMemberFromEventRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.removeMember(
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
    response.payload = CONST.DEFAULT_REMOVE_SUCCESS_MESSAGE
    return response
  }

  @Post('add-guest')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [EventEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async addGuest(
    @Req() req: Request,
    @Body() bodyData: AddGuestToEventRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.addGuest(
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

  @Post('remove-guest')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [EventEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async removeGuest(
    @Req() req: Request,
    @Body() bodyData: RemoveGuestFromEventRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.removeGuest(
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
    response.payload = CONST.DEFAULT_REMOVE_SUCCESS_MESSAGE
    return response
  }

  @Post('end')
  @CheckPermissions({
    action: [Action.UPDATE],
    subject: [EventEntity],
    fields: [],
  })
  @HttpCode(HttpStatus.CREATED)
  async endEvent(
    @Req() req: Request,
    @Body() bodyData: EndEventRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const data = await this.service.endEvent(
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
}
