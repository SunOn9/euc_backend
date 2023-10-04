import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CreateClubFeeDto } from './dto/create-club-fee.dto'
import { UpdateClubFeeDto } from './dto/update-club-fee.dto'

@Injectable()
export class ClubFeeService {
  create(createClubFeeDto: CreateClubFeeDto) {
    return 'This action adds a new clubFee'
  }

  findAll() {
    return `This action returns all clubFee`
  }

  findOne(id: number) {
    return `This action returns a #${id} clubFee`
  }

  update(id: number, updateClubFeeDto: UpdateClubFeeDto) {
    return `This action updates a #${id} clubFee`
  }

  remove(id: number) {
    return `This action removes a #${id} clubFee`
  }
}
