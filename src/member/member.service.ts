import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { err, ok } from 'neverthrow'
import { CreateMemberRequestDto } from './dto/create-member.dto'
import { GetMemberConditionRequestDto } from './dto/get-member-condition-request.dto'
import { RemoveMemberRequestDto } from './dto/remove-member.dto'
import { UpdateMemberRequestDto } from './dto/update-member.dto'
import { MemberRepository } from './provider/member.repository'
import { User } from '/generated/user/user'
import { LogService } from '/log/log.service'
import { Action } from '/permission/casl/casl.type'
import { MemberEntity } from './entities/member.entity'
import { EnumProto_UserRole } from '/generated/enumps'
import { UpdateClubOfMemberRequestDto } from './dto/update-club-of-member.dto'
import { MemberInClubEntity } from './entities/member-in-club.entity'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators'

@Injectable()
export class MemberService {
  constructor(
    private readonly repo: MemberRepository,
    private readonly logService: LogService,
    @InjectRepository(MemberInClubEntity)
    private memberInClubRepo: Repository<MemberInClubEntity>,
  ) {}

  //TODO: update total member in Club

  async create(
    requestData: CreateMemberRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN) {
      requestData.clubId = userInfo.club.id
    }

    // //Check member exits
    // const memberReply = await this.repo.getDetail({
    //   name: requestData.name,
    // })

    // if (memberReply.isOk()) {
    //   return err(
    //     new Error(`Member already exits with name: [${requestData.name}]`),
    //   )
    // }

    const createReply = await this.repo.createMember(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: MemberEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return createReply
  }

  async getDetail(requestData: GetMemberConditionRequestDto) {
    const updateReply = await this.repo.getDetail(requestData)

    return updateReply
  }

  async getList(requestData: GetMemberConditionRequestDto) {
    return await this.repo.getList(requestData)
  }

  async update(
    requestData: UpdateMemberRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const memberReply = await this.repo.getDetail(requestData.conditions)

    if (memberReply.isErr()) {
      return err(memberReply.error)
    }

    const updateReply = await this.repo.updateMember(requestData)

    if (updateReply.isOk()) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: MemberEntity.tableName,
        oldData: memberReply.value,
        newData: updateReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return updateReply
  }

  async updateClubOfMember(
    requestData: UpdateClubOfMemberRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    const memberReply = await this.repo.getDetail({
      id: requestData.memberId,
      isExtraClub: true,
    })

    if (memberReply.isErr()) {
      return err(memberReply.error)
    }

    await this.memberInClubRepo.softDelete(memberReply.value.memberInClub[0].id)

    const createReply = await this.memberInClubRepo.save({
      club: { id: requestData.newClubId },
      member: { id: memberReply.value.id },
    } as MemberInClubEntity)

    const newMemberReply = await this.repo.getDetail({
      id: requestData.memberId,
      isExtraClub: true,
    })

    if (createReply) {
      await this.logService.create({
        action: Action.UPDATE,
        subject: MemberEntity.tableName,
        oldData: memberReply.value,
        newData: newMemberReply,
        sessionId: sessionId,
        user: userInfo,
      })
    }

    return ok(true)
  }

  async remove(
    requestData: RemoveMemberRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    //Check member
    const memberReply = await this.repo.getDetail({
      id: requestData.id,
    })

    if (memberReply.isErr()) {
      return err(memberReply.error)
    }

    const removeReply = await this.repo.removeMember(requestData)

    if (removeReply.isOk()) {
      await this.logService.create({
        action: Action.DELETE,
        subject: MemberEntity.tableName,
        oldData: memberReply.value,
        sessionId: sessionId,
        user: userInfo,
      })
    }
    return removeReply
  }
}
