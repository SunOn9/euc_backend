import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { DoneReceiptSessionRequest } from '/generated/receipt-session/receipt-session.request'

export class DoneReceiptSessionRequestDto implements DoneReceiptSessionRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
