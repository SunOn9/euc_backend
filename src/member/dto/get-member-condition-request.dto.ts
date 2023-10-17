import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { Transform, Type } from 'class-transformer'
import { EnumProto_MemberStatus, EnumProto_MemberType } from '/generated/enumps'
import { GetMemberConditionRequest } from '/generated/member/member.request'

export class GetMemberConditionRequestDto implements GetMemberConditionRequest {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickName?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EnumProto_MemberType)
  type?: EnumProto_MemberType

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthdayFrom?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  birthdayTo?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(EnumProto_MemberStatus)
  status?: EnumProto_MemberStatus

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  monthlyFee?: string

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
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraEvent?: boolean

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isExtraArea?: boolean
}
