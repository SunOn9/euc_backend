import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { CreateUserRequest } from '/generated/user/user.request'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { EnumProto_UserRole } from '/generated/enumps'
import { Type } from 'class-transformer'

export class CreateUserRequestDto implements CreateUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_UserRole)
  role: EnumProto_UserRole

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  clubId: number;
}
