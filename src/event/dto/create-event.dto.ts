import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreateEventRequest } from '/generated/event/event.request'
import { EnumProto_EventType } from '/generated/enumps'

export class CreateEventRequestDto implements CreateEventRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startEventDate: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endEventDate?: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_EventType)
  type: EnumProto_EventType
}
