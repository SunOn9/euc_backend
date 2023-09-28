import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import {
  UpdateUserDataRequest,
  UpdateUserRequest,
} from '/generated/user/user.request'
import { GetPermissionConditionRequestDto } from './get-permission-condition-request.dto'

export class UpdateUserRequestDto implements UpdateUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetPermissionConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateUserDataRequest
}
