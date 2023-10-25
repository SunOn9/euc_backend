import { IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { GetPlaceConditionRequestDto } from './get-place-condition-request.dto'
import { UpdatePlaceRequest, UpdatePlaceDataRequest } from '/generated/place/place.request'

export class UpdatePlaceRequestDto implements UpdatePlaceRequest {
  @ApiProperty()
  @IsNotEmpty()
  conditions!: GetPlaceConditionRequestDto

  @ApiProperty()
  @IsNotEmpty()
  data!: UpdatePlaceDataRequest
}
