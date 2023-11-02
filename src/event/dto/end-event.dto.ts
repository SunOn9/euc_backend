import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { EndEventRequest } from '/generated/event/event.request'

export class EndEventRequestDto implements EndEventRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
