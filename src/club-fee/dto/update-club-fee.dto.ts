import { PartialType } from '@nestjs/swagger';
import { CreateClubFeeDto } from './create-club-fee.dto';

export class UpdateClubFeeDto extends PartialType(CreateClubFeeDto) {}
