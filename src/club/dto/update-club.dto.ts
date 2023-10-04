import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'

import { GetClubConditionRequestDto } from './get-club-condition-request.dto'
import {
  UpdateClubDataRequest,
  UpdateClubRequest,
} from '/generated/club/club.request'

export class UpdateClubRequestDto implements UpdateClubRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetClubConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateClubDataRequest
}
