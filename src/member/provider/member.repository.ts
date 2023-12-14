import { UtilsService } from 'lib/utils'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Result, err, ok } from 'neverthrow'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'
import { CreateMemberRequestDto } from '../dto/create-member.dto'
import { GetMemberConditionRequestDto } from '../dto/get-member-condition-request.dto'
import { RemoveMemberRequestDto } from '../dto/remove-member.dto'
import { UpdateMemberRequestDto } from '../dto/update-member.dto'
import { MemberEntity } from '../entities/member.entity'
import { MemberReflect } from './member.proto'
import { Member } from '/generated/member/member'
import { MemberListDataReply } from '/generated/member/member.reply'
import { ClubEntity } from '/club/entities/club.entity'
import { AreaEntity } from '/area/entities/area.entity'

@Injectable()
export class MemberRepository extends Repository<MemberEntity> {
  constructor(
    // @Inject(CACHE_MANAGER)
    // private cache: Cache,
    private dataSource: DataSource,
    private proto: MemberReflect,
    private utilService: UtilsService,
  ) {
    super(MemberEntity, dataSource.createEntityManager())
  }

  async createMember(
    // createData: Omit<CreateMemberRequestDto, 'clubId'>,
    createData: CreateMemberRequestDto,
  ): Promise<Result<Member, Error>> {
    try {
      const { clubId, areaId, ...other } = createData

      const saveData = {
        ...other,
        hometown: { id: areaId } as AreaEntity,
        memberInClub: [{ club: { id: clubId } as ClubEntity }],
      } as MemberEntity

      const dataReply = await this.save(saveData)

      if (this.utilService.isObjectEmpty(dataReply)) {
        return err(new Error(`Cannot create member in database`))
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateMember(
    updateData: UpdateMemberRequestDto,
  ): Promise<Result<Member, Error>> {
    try {
      if (this.utilService.isObjectEmpty(updateData.conditions)) {
        return err(new Error(`Empty conditions`))
      }

      await this.update(updateData.conditions, updateData.data)

      return await this.getDetail(updateData.conditions)
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getDetail(
    conditions: GetMemberConditionRequestDto,
  ): Promise<Result<Member, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      const dataReply = await queryBuilder.orderBy(`${MemberEntity.tableName}.id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get member with conditions: [${conditions}]`),
        )
      }

      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getList(
    conditions: GetMemberConditionRequestDto,
  ): Promise<Result<MemberListDataReply, Error>> {
    try {
      // if (!conditions) {
      //   return err(new Error(`Empty conditions`));
      // }

      const page = conditions.page ?? 1
      const limit = conditions.limit ?? 20
      const skip: number = limit * page - limit

      const queryBuilder = this.setupQueryCondition(conditions)

      const [dataReply, total] = await queryBuilder
        .orderBy(`${MemberEntity.tableName}.id`, 'DESC')
        .take(limit)
        .skip(skip)
        .getManyAndCount()

      if (!dataReply) {
        return err(
          new Error(`Cannot get list member with conditions: [${conditions}]`),
        )
      }

      const memberList: Member[] = dataReply.map(each => {
        return this.proto.reflect(each)
      })

      return ok({
        total,
        page,
        limit,
        memberList,
      })
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async removeMember(
    removeData: RemoveMemberRequestDto,
  ): Promise<Result<boolean, Error>> {
    const dataReply = await this.softDelete(removeData)

    if (this.utilService.isObjectEmpty(dataReply)) {
      return err(new Error(`Error when remove member`))
    }

    return ok(true)
  }

  setupQueryCondition(
    conditions: GetMemberConditionRequestDto,
  ): SelectQueryBuilder<MemberEntity> {
    const queryBuilder = this.createQueryBuilder(MemberEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`${MemberEntity.tableName}.id = :id`, {
        id: `${conditions.id}`,
      })
    }

    if (conditions.clubId !== undefined) {
      queryBuilder
        .leftJoinAndSelect('member.memberInClub', 'member_in_club')
        .andWhere('member_in_club.club_id = :clubId', { clubId: conditions.clubId })
    }

    if (conditions.name !== undefined) {
      queryBuilder.andWhere(`${MemberEntity.tableName}.name LIKE :name`, {
        name: `%${conditions.name}%`,
      })
    }

    if (conditions.nickName !== undefined) {
      queryBuilder.andWhere(`${MemberEntity.tableName}.nick_name LIKE :nickName`, {
        nickName: `%${conditions.nickName}%`,
      })
    }

    if (conditions.type !== undefined) {
      queryBuilder.andWhere(`${MemberEntity.tableName}.type = :type`, {
        type: `${conditions.type}`,
      })
    }

    if (conditions.status !== undefined) {
      queryBuilder.andWhere(`${MemberEntity.tableName}.status = :status`, {
        status: `${conditions.status}`,
      })
    }

    if (
      conditions.birthdayFrom !== undefined &&
      conditions.birthdayTo !== undefined
    ) {
      queryBuilder.andWhere(`${MemberEntity.tableName}.birthday BETWEEN :birthdayFrom AND :birthdayTo`, {
        birthdayFrom: `${conditions.birthdayFrom}`,
        birthdayTo: `${conditions.birthdayTo}`,
      })
    }

    if (conditions.monthlyFee !== undefined) {
      queryBuilder.andWhere(`${MemberEntity.tableName}.monthly_fee = :monthlyFee`, {
        monthlyFee: `${conditions.monthlyFee}`,
      })
    }

    if (conditions.isDeleted) {
      queryBuilder.withDeleted()
    }

    queryBuilder.setFindOptions({
      relationLoadStrategy: 'query',
      relations: {
        memberInClub: conditions.isExtraClub
          ? {
            club: true,
          }
          : false,
        event: conditions.isExtraEvent ?? false,
        hometown: conditions.isExtraArea ?? false,
      }
    })

    return queryBuilder
  }
}
