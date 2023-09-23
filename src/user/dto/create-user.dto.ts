import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { CreateUserRequest } from '/generated/user/user.request'
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { EnumProto_UserRole } from '/generated/enumps'

export class CreateUserRequestDto implements CreateUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_UserRole)
  role: EnumProto_UserRole
}
