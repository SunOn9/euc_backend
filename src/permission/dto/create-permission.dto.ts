import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreatePermissionRequest } from '/generated/permission/permission.request'
import { RawRulesDto } from './raw-rules.dto'
// import { Transform } from 'class-transformer'

export class CreatePermissionRequestDto implements CreatePermissionRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string

  @ApiProperty()
  @IsNotEmpty()
  rules!: RawRulesDto
}
