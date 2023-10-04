import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'

import { GetAreaConditionRequestDto } from './get-area-condition-request.dto'
import {
  UpdateAreaDataRequest,
  UpdateAreaRequest,
} from '/generated/area/area.request'

export class UpdateAreaRequestDto implements UpdateAreaRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetAreaConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdateAreaDataRequest
}
