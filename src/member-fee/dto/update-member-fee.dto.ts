import { PartialType } from '@nestjs/swagger';
import { CreateMemberFeeDto } from './create-member-fee.dto';

export class UpdateMemberFeeDto extends PartialType(CreateMemberFeeDto) {}
