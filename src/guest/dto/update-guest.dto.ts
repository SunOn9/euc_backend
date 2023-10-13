import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetGuestConditionRequestDto } from './get-guest-condition-request.dto'
import {
  UpdateGuestDataRequest,
  UpdateGuestRequest,
} from '/generated/guest/guest.request'

export class UpdateGuestRequestDto implements UpdateGuestRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetGuestConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateGuestDataRequest
}
