import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ExcelService } from './excel.service'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '/permission/casl/casl.type'
import { MemberEntity } from '/member/entities/member.entity'
import { Get, Query, Res } from '@nestjs/common/decorators'
import { GetMemberConditionRequestDto } from '/member/dto/get-member-condition-request.dto'
import { Response } from 'express'
import { HttpStatus } from '@nestjs/common'
import CustomException from 'lib/utils/custom.exception'

@UseGuards(PermissionsGuard)
@Controller('excel')
export class ExcelController {
  constructor(private readonly service: ExcelService) {}

  @Get('export-member')
  @CheckPermissions({
    action: [Action.READ],
    subject: [MemberEntity],
    fields: [],
  })
  async exportMember(
    @Res() res: Response,
    @Query() request: GetMemberConditionRequestDto,
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
