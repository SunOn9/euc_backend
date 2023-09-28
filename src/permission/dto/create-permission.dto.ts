import { IsJSON, IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreatePermissionRequest } from '/generated/permission/permission.request'
import { Transform } from 'class-transformer'

export class CreatePermissionRequestDto implements CreatePermissionRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  rules: JSON
}
