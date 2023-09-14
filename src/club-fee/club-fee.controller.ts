import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClubFeeService } from './club-fee.service';
import { CreateClubFeeDto } from './dto/create-club-fee.dto';
import { UpdateClubFeeDto } from './dto/update-club-fee.dto';

@Controller('club-fee')
export class ClubFeeController {
  constructor(private readonly clubFeeService: ClubFeeService) {}

  @Post()
  create(@Body() createClubFeeDto: CreateClubFeeDto) {
    return this.clubFeeService.create(createClubFeeDto);
  }

  @Get()
  findAll() {
    return this.clubFeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubFeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubFeeDto: UpdateClubFeeDto) {
    return this.clubFeeService.update(+id, updateClubFeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubFeeService.remove(+id);
  }
}
