import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Transform, Type } from 'class-transformer'
import { GetPaymentConditionRequest } from '/generated/payment/payment.request'
import { EnumProto_MoneyMethod } from '/generated/enumps'

export class GetPaymentConditionRequestDto implements GetPaymentConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EnumProto_MoneyMethod)
  method?: EnumProto_MoneyMethod

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
  isDeleted?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraPaymentSession?: boolean
}
