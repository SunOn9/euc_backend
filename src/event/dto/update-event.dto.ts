import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetEventConditionRequestDto } from './get-event-condition-request.dto'
import {
  UpdateEventDataRequest,
  UpdateEventRequest,
} from '/generated/event/event.request'

export class UpdateEventRequestDto implements UpdateEventRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetEventConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateEventDataRequest
}
