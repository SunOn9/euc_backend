import { IsDateString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { ExportOption } from '/generated/common'

export class ExportOptionDto implements ExportOption {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  fromDate: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  toDate: Date
}
