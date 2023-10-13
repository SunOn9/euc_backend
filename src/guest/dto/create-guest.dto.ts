import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreateGuestRequest } from '/generated/guest/guest.request'
import { EnumProto_MemberType } from '/generated/enumps'

export class CreateGuestRequestDto implements CreateGuestRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickName?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_MemberType)
  type: EnumProto_MemberType
}
