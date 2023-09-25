import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { LoginRequest } from 'src/generated/auth/auth.request'
import { CreateAuthRequestDto } from './create-auth.dto'

export class LoginRequestDto implements LoginRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  username!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password!: string

  @ApiProperty()
  @IsNotEmpty()
  data!: CreateAuthRequestDto
}
