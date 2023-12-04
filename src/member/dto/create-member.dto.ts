import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import {
  EnumProto_Gender,
  EnumProto_MemberStatus,
  EnumProto_MemberType,
} from '/generated/enumps'
import { CreateMemberRequest } from '/generated/member/member.request'
import { Type } from 'class-transformer'

export class CreateMemberRequestDto implements CreateMemberRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_Gender)
  gender: EnumProto_Gender

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickName?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_MemberType)
  type: EnumProto_MemberType

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthday?: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_MemberStatus)
  status: EnumProto_MemberStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  monthlyFee?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clubId?: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  areaId: number
}
