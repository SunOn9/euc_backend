import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { CreateMemberInClubDto } from './dto/create-member-in-club.dto'
import { UpdateMemberInClubDto } from './dto/update-member-in-club.dto'

@Injectable()
export class MemberInClubService {
  create(createMemberInClubDto: CreateMemberInClubDto) {
    return 'This action adds a new memberInClub'
  }

  findAll() {
    return `This action returns all memberInClub`
  }

  findOne(id: number) {
    return `This action returns a #${id} memberInClub`
  }

  update(id: number, updateMemberInClubDto: UpdateMemberInClubDto) {
    return `This action updates a #${id} memberInClub`
  }

  remove(id: number) {
    return `This action removes a #${id} memberInClub`
  }
}
