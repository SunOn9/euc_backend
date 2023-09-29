import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'

import { GetPermissionConditionRequestDto } from './get-permission-condition-request.dto'
import {
  UpdatePermissionDataRequest,
  UpdatePermissionRequest,
} from '/generated/permission/permission.request'

export class UpdatePermissionRequestDto implements UpdatePermissionRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetPermissionConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdatePermissionDataRequest
}
