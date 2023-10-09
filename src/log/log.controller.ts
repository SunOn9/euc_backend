import { Controller, Get, HttpStatus, Query, Req } from '@nestjs/common'
import { LogService } from './log.service'

import { LogListReply, LogReply } from '/generated/log/log.reply'
import { GetLogConditionRequestDto } from './dto/get-log-condition-request.dto'
import CustomException from 'lib/utils/custom.exception'
import * as CONST from '../prelude/constant'

@Controller('log')
export class LogController {
  constructor(private readonly service: LogService) {}

  @Get('list')
  async getList(
    @Req() req: Request,
    @Query() request: GetLogConditionRequestDto,
  ): Promise<LogListReply> {
    const response = {} as LogListReply
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

  @Get('detail')
  async getDetail(
    @Req() req: Request,
    @Query() request: GetLogConditionRequestDto,
  ): Promise<LogReply> {
    const response = {} as LogReply
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
}
