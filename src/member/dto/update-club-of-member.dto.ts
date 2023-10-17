import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { UpdateClubOfMemberRequest } from '/generated/member/member.request'
import { Type } from 'class-transformer'

export class UpdateClubOfMemberRequestDto implements UpdateClubOfMemberRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  memberId: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  newClubId: number
}
