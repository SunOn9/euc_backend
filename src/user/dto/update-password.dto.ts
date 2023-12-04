import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator'
import { UpdatePasswordRequest } from '/generated/user/user.request'

export class UpdatePasswordRequestDto implements UpdatePasswordRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  oldPassword!: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  newPassword!: string
}
