import { IsArray, IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { RemoveGuestFromEventRequest } from '/generated/event/event.request'

export class RemoveGuestFromEventRequestDto
  implements RemoveGuestFromEventRequest
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
  guestIdList!: number[]
}
