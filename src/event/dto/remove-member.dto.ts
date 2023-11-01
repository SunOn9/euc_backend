import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { RemoveMemberFromEventRequest } from '/generated/event/event.request'

export class RemoveMemberFromEventRequestDto
  implements RemoveMemberFromEventRequest
{
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  eventId!: number

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  memberIdList!: number[]
}
