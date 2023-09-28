import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { GetAuthConditionRequest } from 'src/generated/auth/auth.request'

export class GetAuthConditionRequestDto implements GetAuthConditionRequest {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number

  @IsOptional()
  @IsString()
  ipAddress?: string

  @IsOptional()
  @IsString()
  authToken?: string

  @IsOptional()
  @IsString()
  sessionId?: string

  @IsOptional()
  @IsString()
  userAgent?: string

  @IsOptional()
  @IsString()
  platform?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longtitude?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isExtra?: boolean

  @IsOptional()
  @IsDate()
  fromDate?: Date

  @IsOptional()
  @IsDate()
  toDate?: Date
}
