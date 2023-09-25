import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { CreateAuthRequest } from 'src/generated/auth/auth.request'

export class CreateAuthRequestDto implements CreateAuthRequest {
  // @ApiPropertyOptional()
  // @IsOptional()
  // @IsNumber()
  // @Type(() => Number)
  // public userId?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public ipAddress?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public authToken?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public sessionId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public userAgent?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public platform?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public longtitude?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public latitude?: number
}
