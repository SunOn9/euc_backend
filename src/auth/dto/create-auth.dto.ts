import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { CreateAuthRequest } from 'src/generated/auth/auth.request'

export class CreateAuthRequestDto implements CreateAuthRequest {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsNumber()
  // @Type(() => Number)
  // userId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ipAddress?: string

  @IsOptional()
  @IsString()
  authToken?: string

  @IsOptional()
  @IsString()
  sessionId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userAgent?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  platform?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longtitude?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number
}
