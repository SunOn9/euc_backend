import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsEnum,
} from 'class-validator'
import { Action, Subject } from '../casl/casl.enum'
import { Transform } from 'class-transformer'

export class RawRulesDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsEnum({ each: true })
  action: Action[]

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsEnum({ each: true })
  subject: Subject[]

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields: string[]

  @ApiPropertyOptional()
  @IsOptional()
  conditions: any

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  inverted: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason: string
}
