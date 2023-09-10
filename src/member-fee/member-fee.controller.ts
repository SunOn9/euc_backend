import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberFeeService } from './member-fee.service';
import { CreateMemberFeeDto } from './dto/create-member-fee.dto';
import { UpdateMemberFeeDto } from './dto/update-member-fee.dto';

@Controller('member-fee')
export class MemberFeeController {
  constructor(private readonly memberFeeService: MemberFeeService) {}

  @Post()
  create(@Body() createMemberFeeDto: CreateMemberFeeDto) {
    return this.memberFeeService.create(createMemberFeeDto);
  }

  @Get()
  findAll() {
    return this.memberFeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberFeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberFeeDto: UpdateMemberFeeDto) {
    return this.memberFeeService.update(+id, updateMemberFeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberFeeService.remove(+id);
  }
}
