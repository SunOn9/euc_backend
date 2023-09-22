import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import {
  UpdateUserDataRequest,
  UpdateUserRequest,
} from '/generated/user/user.request';
import { GetUserConditionRequestDto } from './get-user-condition-request.dto';

export class UpdateUserRequestDto implements UpdateUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetUserConditionRequestDto;

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateUserDataRequest;
}
