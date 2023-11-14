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
import { GetPaymentSessionConditionRequest } from '/generated/paymentSession/paymentSession.request'
import { EnumProto_SessionStatus } from '/generated/enumps'

export class GetPaymentSessionConditionRequestDto
  implements GetPaymentSessionConditionRequest
{
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
  @IsEnum(EnumProto_SessionStatus)
  status?: EnumProto_SessionStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fromDateConfirm?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  toDateConfirm?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fromDateDone?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  toDateDone?: Date

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
  isExtraUserConfirm?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraUserDone?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraEvent?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraPayment?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraClub?: boolean
}
