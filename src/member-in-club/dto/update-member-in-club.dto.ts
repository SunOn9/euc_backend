import { PartialType } from '@nestjs/swagger';
import { CreateMemberInClubDto } from './create-member-in-club.dto';

export class UpdateMemberInClubDto extends PartialType(CreateMemberInClubDto) {}
