import { IsBoolean, IsNumber, IsOptional } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Transform, Type } from 'class-transformer'
import { GetClubFeeConditionRequest } from '/generated/clubFee/clubFee.request'

export class GetClubFeeConditionRequestDto
  implements GetClubFeeConditionRequest
{
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  studentFee?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  workerFee?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  monthlyFee?: number

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
  isExtraClub?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clubId?: number
}
