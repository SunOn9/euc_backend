import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ExcelService } from './excel.service'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '/permission/casl/casl.type'
import { MemberEntity } from '/member/entities/member.entity'
import { Body, Post, Res } from '@nestjs/common/decorators'
import { Response } from 'express'
import { HttpStatus } from '@nestjs/common'
import CustomException from 'lib/utils/custom.exception'
import { ExportMemberRequestDto } from './dto/export-member.dto'

@UseGuards(PermissionsGuard)
@Controller('excel')
export class ExcelController {
  constructor(private readonly service: ExcelService) {}

  @Post('export-member')
  @CheckPermissions({
    action: [Action.READ],
    subject: [MemberEntity],
    fields: [],
  })
  async exportMember(
    @Res() res: Response,
    @Body() request: ExportMemberRequestDto,
  ) {
    const data = await this.service.exportMember(
      request,
      MemberEntity.tableName,
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
