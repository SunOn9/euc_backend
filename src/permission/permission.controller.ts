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

@Controller('permission')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  async createUser(
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

  @Get('detail/:id')
  async getDetail(
    // @Req() req: Request,
    @Param() request: GetPermissionConditionRequestDto,
  ): Promise<PermissionReply> {
    const response = {} as PermissionReply
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
