import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreatePlaceRequest } from '/generated/place/place.request'
import { Type } from 'class-transformer'

export class CreatePlaceRequestDto implements CreatePlaceRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fee?: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clubId?: number
}
