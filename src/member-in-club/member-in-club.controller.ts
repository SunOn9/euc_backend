import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberInClubService } from './member-in-club.service';
import { CreateMemberInClubDto } from './dto/create-member-in-club.dto';
import { UpdateMemberInClubDto } from './dto/update-member-in-club.dto';

@Controller('member-in-club')
export class MemberInClubController {
  constructor(private readonly memberInClubService: MemberInClubService) {}

  @Post()
  create(@Body() createMemberInClubDto: CreateMemberInClubDto) {
    return this.memberInClubService.create(createMemberInClubDto);
  }

  @Get()
  findAll() {
    return this.memberInClubService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberInClubService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberInClubDto: UpdateMemberInClubDto) {
    return this.memberInClubService.update(+id, updateMemberInClubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberInClubService.remove(+id);
  }
}
