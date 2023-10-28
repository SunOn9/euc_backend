import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { UpdateUserPermissionRequest } from '/generated/user/user.request';
import { Type } from 'class-transformer';


export class UpdateUserPermissionRequestDto implements UpdateUserPermissionRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  permissionIdList: number[];
}
