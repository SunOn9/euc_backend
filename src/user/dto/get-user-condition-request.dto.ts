import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { GetUserConditionRequest } from '/generated/user/user.request'
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { EnumProto_UserRole } from '/generated/enumps'
import { Type } from 'class-transformer'

export class GetUserConditionRequestDto implements GetUserConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EnumProto_UserRole)
  role?: EnumProto_UserRole

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  deletedAt?: Date

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
}
