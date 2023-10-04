import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreateClubRequest } from '/generated/club/club.request'
import { Type } from 'class-transformer'

export class CreateClubRequestDto implements CreateClubRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  fund?: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  areaId: number
}
