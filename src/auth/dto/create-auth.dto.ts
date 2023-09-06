import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAuthRequest } from 'src/generated/auth/auth.request';

export class CreateAuthRequestDto implements CreateAuthRequest {
  @IsNumber()
  @Type(() => Number)
  userId: number;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  authToken?: string;

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longtitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;
}
