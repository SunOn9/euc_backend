import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsJSON,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Transform, Type } from 'class-transformer'
import { GetLogConditionRequest } from '/generated/log/log.request'
import { Action, Subject } from '/permission/casl/casl.type'

export class GetLogConditionRequestDto implements GetLogConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number

  @ApiPropertyOptional({ type: [String] })
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sessionId: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraUser?: boolean
}
