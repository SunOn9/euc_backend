import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserRequest } from '/generated/user/user.request';
import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { EnumProto_UserRole } from '/generated/enumps';

export class CreateUserRequestDto implements CreateUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(EnumProto_UserRole)
  role: EnumProto_UserRole;
}
