import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { EnumProto_SessionStatus } from '/generated/enumps';
import { CreateReceiptSessionRequest } from '/generated/receipt-session/receipt-session.request';
import { Type } from 'class-transformer';

export class CreateReceiptSessionRequestDto implements CreateReceiptSessionRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsEnum(EnumProto_SessionStatus)
  // status: EnumProto_SessionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  eventId?: number
}
