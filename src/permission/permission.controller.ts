import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { PermissionService } from './permission.service'
import CustomException from 'lib/utils/custom.exception'
import { CreatePermissionRequestDto } from './dto/create-permission.dto'
import {
  PermissionListReply,
  PermissionReply,
} from '/generated/permission/permission.reply'
import * as CONST from '../prelude/constant'
import { GetPermissionConditionRequestDto } from './dto/get-permission-condition-request.dto'
import { PermissionsGuard } from './guard/permission.guard'
import { CheckPermissions } from './guard/permission.decorator'
import { Action } from './casl/casl.type'
import { PermissionEntity } from './entities/permission.entity'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  @CheckPermissions({
    action: [Action.CREATE],
    subject: [PermissionEntity],
    fields: [],
  })
  async create(
    // @Req() req: Request,
    @Body() bodyData: CreatePermissionRequestDto,
  ): Promise<PermissionReply> {
    const response = {} as PermissionReply
    const data = await this.service.create(bodyData)

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

  // @Get('detail')
  // async getDetail(
  //   @Req() req: Request,
  //   // @Param() request: GetPermissionConditionRequestDto,
  // ): Promise<PermissionReply> {
  //   const response = {} as PermissionReply

  //   const data = await this.service.getDetail({ id: /*req.user.id*/ 1 })

  //   if (data.isErr()) {
  //     throw new CustomException(
  //       'ERROR',
  //       data.error.message,
  //       HttpStatus.BAD_REQUEST,
  //     )
  //   }

  //   response.statusCode = CONST.DEFAULT_SUCCESS_CODE
  //   response.message = CONST.DEFAULT_SUCCESS_MESSAGE
  //   response.payload = data.value
  //   return response
  // }

  @Get('list')
  @CheckPermissions({
    action: [Action.READ],
    subject: [PermissionEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetPermissionConditionRequestDto,
  ): Promise<PermissionListReply> {
    const response = {} as PermissionListReply
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
}
