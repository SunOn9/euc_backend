import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { CreateAreaRequest } from '/generated/area/area.request'

export class CreateAreaRequestDto implements CreateAreaRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string
}
