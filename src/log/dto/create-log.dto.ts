import {
  IsArray,
  IsEnum,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreateLogRequest } from '/generated/log/log.request'
import { Action, Subject } from '/permission/casl/casl.type'

export class CreateLogRequestDto implements CreateLogRequest {
  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsEnum({ each: true })
  subject: Subject

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsEnum({ each: true })
  action: Action

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  oldData: JSON

  @ApiPropertyOptional()
  @IsOptional()
  @IsJSON()
  newData: JSON

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sessionId: string
}
