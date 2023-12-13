import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ExcelService } from './excel.service'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '/permission/casl/casl.type'
import { MemberEntity } from '/member/entities/member.entity'
import { Body, Post, Req, Res } from '@nestjs/common/decorators'
import { Response } from 'express'
import { HttpStatus } from '@nestjs/common'
import CustomException from 'lib/utils/custom.exception'
import { ExportMemberRequestDto } from './dto/export-member.dto'
import { ApiHeader } from '@nestjs/swagger/dist/decorators/api-header.decorator'
import { ExportOptionDto } from './dto/export-fund.dto'

@ApiHeader({
  name: 'sessionId',
  description: 'Session',
  required: true,
})
@UseGuards(PermissionsGuard)
@Controller('excel')
export class ExcelController {
  constructor(private readonly service: ExcelService) { }

  @Post('export-member')
  @CheckPermissions({
    action: [Action.READ],
    subject: ['member'],
    fields: [],
  })
  async exportMember(
    @Res() res: Response,
    @Body() request: ExportMemberRequestDto,
    @Req() req: Request
  ) {
    const data = await this.service.exportMember(
      request,
      MemberEntity.tableName,
      req['userInfo']
    )

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    res.download(data.value.name)
  }

  @Post('export-fund')
  @CheckPermissions({
    action: [Action.READ],
    subject: ['payment_session', 'receipt_session'],
    fields: [],
  })
  async exportFund(
    @Res() res: Response,
    @Body() request: ExportOptionDto,
    @Req() req: Request
  ) {
    const data = await this.service.exportFund(
      request,
      'fund',
      req['userInfo']
    )

    if (data.isErr()) {
      throw new CustomException(
        'ERROR',
        data.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    res.download(data.value.name)
  }
}
