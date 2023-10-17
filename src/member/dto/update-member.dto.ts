import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetMemberConditionRequestDto } from './get-member-condition-request.dto'
import {
  UpdateMemberDataRequest,
  UpdateMemberRequest,
} from '/generated/member/member.request'

export class UpdateMemberRequestDto implements UpdateMemberRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetMemberConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateMemberDataRequest
}
