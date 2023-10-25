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
import { EnumProto_MoneyMethod } from '/generated/enumps'
import { CreateReceiptRequest } from '/generated/receipt/receipt.request'

export class CreateReceiptRequestDto implements CreateReceiptRequest {
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
