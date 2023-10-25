import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreatePaymentSessionRequest } from '/generated/payment-session/payment-session.request'
import { EnumProto_SessionStatus } from '/generated/enumps';

export class CreatePaymentSessionRequestDto implements CreatePaymentSessionRequest {
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
  @IsEnum(EnumProto_SessionStatus)
  status: EnumProto_SessionStatus;
}
