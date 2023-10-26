import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator'
import { PermissionsGuard } from '/permission/guard/permission.guard'
import { Controller } from '@nestjs/common/decorators/core/controller.decorator'
import { ExcelService } from './excel.service'
import { CheckPermissions } from '/permission/guard/permission.decorator'
import { Action } from '/permission/casl/casl.type'
import { MemberEntity } from '/member/entities/member.entity'
import { Get, Query } from '@nestjs/common/decorators'
import { GetMemberConditionRequestDto } from '/member/dto/get-member-condition-request.dto'
import { SimpleReply } from '/generated/common'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import * as CONST from '/prelude/constant'
@UseGuards(PermissionsGuard)
@Controller('excel')
export class AreaController {
  constructor(private readonly service: ExcelService) {}

  @Get('export-member')
  @CheckPermissions({
    action: [Action.READ],
    subject: [MemberEntity],
    fields: [],
  })
  async getList(
    // @Req() req: Request,
    @Query() request: GetMemberConditionRequestDto,
  ): Promise<SimpleReply> {
    const response = {} as SimpleReply
    const listData = await this.service.exportMember(request)

    if (listData.isErr()) {
      throw new CustomException(
        'ERROR',
        listData.error.message,
        HttpStatus.BAD_REQUEST,
      )
    }

    response.statusCode = CONST.DEFAULT_SUCCESS_CODE
    response.message = CONST.DEFAULT_SUCCESS_MESSAGE
    response.payload = listData
    return response
  }
}
