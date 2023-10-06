import { IsNumber, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Type } from 'class-transformer'
import { RemoveClubFeeRequest } from '/generated/club-fee/club-fee.request'

export class RemoveClubFeeRequestDto implements RemoveClubFeeRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clubId?: number
}
