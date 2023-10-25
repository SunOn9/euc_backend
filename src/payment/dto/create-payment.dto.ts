import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { CreatePaymentRequest } from '/generated/payment/payment.request'
import { EnumProto_MoneyMethod } from '/generated/enumps'

export class CreatePaymentRequestDto implements CreatePaymentRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  amount: number

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_MoneyMethod)
  method: EnumProto_MoneyMethod
}
