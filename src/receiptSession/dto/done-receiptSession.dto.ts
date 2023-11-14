import { IsNotEmpty, IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { DoneReceiptSessionRequest } from '/generated/receiptSession/receiptSession.request'

export class DoneReceiptSessionRequestDto implements DoneReceiptSessionRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id!: number
}
