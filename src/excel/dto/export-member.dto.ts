import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import {
  ExportMemberRequest,
} from '/generated/member/member.request'
import { GetMemberConditionRequestDto } from '/member/dto/get-member-condition-request.dto'
import { ExportOption } from '/generated/common'

export class ExportMemberRequestDto implements ExportMemberRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetMemberConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  options!: ExportOption
}
