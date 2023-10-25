import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { EnumProto_SessionStatus } from '/generated/enumps';
import { CreateReceiptSessionRequest } from '/generated/receipt-session/receipt-session.request';

export class CreateReceiptSessionRequestDto implements CreateReceiptSessionRequest {
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
