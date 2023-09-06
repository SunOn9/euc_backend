import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { GetAuthConditionRequest } from 'src/generated/auth/auth.request';

export class GetAuthConditionRequestDto implements GetAuthConditionRequest {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public id?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public userId?: number;

  @IsOptional()
  @IsString()
  public ipAddress?: string;

  @IsOptional()
  @IsString()
  public authToken?: string;

  @IsOptional()
  @IsString()
  public sessionId?: string;

  @IsOptional()
  @IsString()
  public userAgent?: string;

  @IsOptional()
  @IsString()
  public platform?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public longtitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public latitude?: number;
}
