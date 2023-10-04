import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm'
import { AuthEntity } from '../entities/auth.entity'
import { AuthReflect } from './auth.proto'
import { Result, err, ok } from 'neverthrow'
import { Auth } from 'src/generated/auth/auth'
import { GetAuthConditionRequestDto } from '../dto/get-condition-auth.dto'
import { UtilsService } from 'lib/utils'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
  constructor(
    private proto: AuthReflect,
    private dataSource: DataSource,
    private utilService: UtilsService,
  ) {
    super(AuthEntity, dataSource.createEntityManager())
  }

  async createAuth(createData: AuthEntity): Promise<Result<Auth, Error>> {
    try {
      const data = await this.save(createData)

      if (!data) {
        return err(new Error('Cannot create Auth'))
      }

      return ok(this.proto.reflect(data))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getDetail(
    conditions: GetAuthConditionRequestDto,
  ): Promise<Result<Auth, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty conditions`))
      }

      const queryBuilder = this.setupQueryCondition(conditions)

      if (conditions.isExtra) {
        queryBuilder.setFindOptions({
          relationLoadStrategy: 'query',
          relations: {
            // auth: true,
          },
        })
      }

      const dataReply = await queryBuilder.orderBy(`id`, 'DESC').getOne()

      if (!dataReply) {
        return err(
          new Error(`Cannot get auth with conditions: [${conditions}]`),
        )
      }
      return ok(this.proto.reflect(dataReply))
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST)
    }
  }

  setupQueryCondition(
    conditions: GetAuthConditionRequestDto,
  ): SelectQueryBuilder<AuthEntity> {
    const queryBuilder = this.createQueryBuilder(AuthEntity.tableName)

    if (conditions.id !== undefined) {
      queryBuilder.andWhere(`id = :id`, {
        id: `${conditions.id}`,
      })
    }

    if (conditions.userId !== undefined) {
      queryBuilder.andWhere(`user_id = :userId`, {
        userId: `${conditions.userId}`,
      })
    }

    if (conditions.ipAddress !== undefined) {
      queryBuilder.andWhere(`ip_address LIKE :ipAddress`, {
        ipAddress: `%${conditions.ipAddress}%`,
      })
    }

    if (conditions.authToken !== undefined) {
      queryBuilder.andWhere(`auth_token = :authToken`, {
        authToken: `${conditions.authToken}`,
      })
    }

    if (conditions.sessionId !== undefined) {
      queryBuilder.andWhere(`session_id = :sessionId`, {
        sessionId: `%${conditions.sessionId}%`,
      })
    }

    if (conditions.userAgent !== undefined) {
      queryBuilder.andWhere(`user_agent = :userAgent`, {
        userAgent: `${conditions.userAgent}`,
      })
    }

    if (conditions.platform !== undefined) {
      queryBuilder.andWhere(`platform = :platform`, {
        platform: `${conditions.platform}`,
      })
    }

    if (conditions.longtitude !== undefined) {
      queryBuilder.andWhere(`longtitude = :longtitude`, {
        longtitude: `${conditions.longtitude}`,
      })
    }

    if (conditions.latitude !== undefined) {
      queryBuilder.andWhere(`latitude = :latitude`, {
        latitude: `${conditions.latitude}`,
      })
    }

    if (conditions.fromDate !== undefined && conditions.toDate !== undefined) {
      queryBuilder.andWhere(`created_at BETWEEN (:fromDate, :toDate)`, {
        fromDate: `${conditions.fromDate}`,
        toDate: `${conditions.toDate}`,
      })
    }

    return queryBuilder
  }
}
