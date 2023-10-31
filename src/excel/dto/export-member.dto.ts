import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import {
  ExportMemberRequest,
  ExportOption,
} from '/generated/member/member.request'
import { GetMemberConditionRequestDto } from '/member/dto/get-member-condition-request.dto'

export class ExportMemberRequestDto implements ExportMemberRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetMemberConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  options!: ExportOption
}
