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
import { ClubService } from '/club/club.service'

@Injectable()
export class MemberService {
  constructor(
    private readonly repo: MemberRepository,
    private readonly logService: LogService,
    private readonly clubService: ClubService,
    @InjectRepository(MemberInClubEntity)
    private memberInClubRepo: Repository<MemberInClubEntity>,
  ) { }

  async create(
    requestData: CreateMemberRequestDto,
    sessionId: string,
    userInfo: User,
  ) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN) {
      requestData.clubId = userInfo.club.id
    }

    //Check club
    const clubReply = await this.clubService.getDetail({
      id: requestData.clubId,
    })

    if (clubReply.isErr()) {
      return err(new Error(`Club with id: [${requestData.clubId}] don't exits`))
    }

    // Check name and nickname member exits
    const memberReply = await this.repo.getDetail({
      name: requestData.name,
      nickName: requestData.nickName,
    })

    if (memberReply.isOk()) {
      if (requestData.nickName === undefined) {
        return err(
          new Error(`Member already exits with name: [${requestData.name}]`),
        )
      } else {
        return err(
          new Error(
            `Member already exits with name: [${requestData.name}] and nickname: [${requestData.nickName}]`,
          ),
        )
      }
    }

    const createReply = await this.repo.createMember(requestData)

    if (createReply.isOk()) {
      await this.logService.create({
        action: Action.CREATE,
        subject: MemberEntity.tableName,
        newData: createReply.value,
        sessionId: sessionId,
        user: userInfo,
      })

      await this.clubService.update(
        {
          conditions: {
            id: requestData.clubId,
          },
          data: {
            totalMember: ++clubReply.value.totalMember,
          },
        },
        sessionId,
        userInfo,
      )
    }

    return createReply
  }

  async getDetail(requestData: GetMemberConditionRequestDto, userInfo: User) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN && userInfo.role !== EnumProto_UserRole.STAFF) {
      requestData.clubId = userInfo.club.id
    }

    return await this.repo.getDetail(requestData)

  }

  async getList(requestData: GetMemberConditionRequestDto, userInfo: User) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN && userInfo.role !== EnumProto_UserRole.STAFF) {
      requestData.clubId = userInfo.club.id
    }

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
    //Check member
    const memberReply = await this.repo.getDetail({
      id: requestData.memberId,
      isExtraClub: true,
    })

    if (memberReply.isErr()) {
      return err(memberReply.error)
    }

    //Check old club
    const oldClub = await this.clubService.getDetail({
      id: memberReply.value.memberInClub[0].club.id,
    })

    if (oldClub.isErr()) {
      return err(oldClub.error)
    }

    //Check new club
    const newClub = await this.clubService.getDetail({
      id: requestData.newClubId,
    })

    if (newClub.isErr()) {
      return err(newClub.error)
    }

    // Delete old memberInClub
    await this.memberInClubRepo.softDelete(
      memberReply.value.memberInClub[0].club.id,
    )

    // Update old club
    await this.clubService.update(
      {
        conditions: { id: memberReply.value.memberInClub[0].club.id },
        data: {
          totalMember: --memberReply.value.memberInClub[0].club.totalMember,
        },
      },
      sessionId,
      userInfo,
    )

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

      await this.clubService.update(
        {
          conditions: { id: requestData.newClubId },
          data: {
            totalMember: ++memberReply.value.memberInClub[0].club.totalMember,
          },
        },
        sessionId,
        userInfo,
      )
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
      isExtraClub: true,
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

      // console.log(memberReply.value.memberInClub[0].club)

      //Check club
      const clubReply = await this.clubService.getDetail({
        id: memberReply.value.memberInClub[0].club.id,
      })

      if (clubReply.isErr()) {
        return err(clubReply.error)
      }

      // console.log(clubReply.value.totalMember)

      await this.clubService.update(
        {
          conditions: {
            id: memberReply.value.memberInClub[0].club.id,
          },
          data: {
            totalMember: --clubReply.value.totalMember,
          },
        },
        sessionId,
        userInfo,
      )
    }
    return removeReply
  }
}
