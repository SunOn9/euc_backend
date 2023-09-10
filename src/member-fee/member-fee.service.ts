import { Injectable } from '@nestjs/common';
import { CreateMemberFeeDto } from './dto/create-member-fee.dto';
import { UpdateMemberFeeDto } from './dto/update-member-fee.dto';

@Injectable()
export class MemberFeeService {
  create(createMemberFeeDto: CreateMemberFeeDto) {
    return 'This action adds a new memberFee';
  }

  findAll() {
    return `This action returns all memberFee`;
  }

  findOne(id: number) {
    return `This action returns a #${id} memberFee`;
  }

  update(id: number, updateMemberFeeDto: UpdateMemberFeeDto) {
    return `This action updates a #${id} memberFee`;
  }

  remove(id: number) {
    return `This action removes a #${id} memberFee`;
  }
}
