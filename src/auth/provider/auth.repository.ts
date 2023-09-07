import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { AuthEntity } from '../entities/auth.entity';
import { AuthReflect } from './auth.proto';
import { Result, err, ok } from 'neverthrow';
import { Auth } from 'src/generated/auth/auth';
import { GetAuthConditionRequestDto } from '../dto/get-condition-auth.dto';
import { UtilsService } from 'lib/utils';
import CustomException from 'lib/utils/custom.exception';

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
  constructor(
    private proto: AuthReflect,
    private dataSource: DataSource,
    private utilService: UtilsService,
  ) {
    super(AuthEntity, dataSource.createEntityManager());
  }

  async createAuth(createData: AuthEntity): Promise<Result<Auth, Error>> {
    try {
      const data = await this.save(createData);

      if (!data) {
        return err(new Error('Cannot create Auth'));
      }

      console.log(
        '🚀 ~ file: auth.repository.ts:26 ~ AuthRepository ~ createAuth ~ data:',
        data,
      );

      return ok(this.proto.reflect(data));
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getDetail(
    conditions: GetAuthConditionRequestDto,
  ): Promise<Result<Auth, Error>> {
    try {
      if (this.utilService.isObjectEmpty(conditions)) {
        return err(new Error(`Empty condition`));
      }

      const queryBuilder = this.setupQueryCondition(conditions);
      const data = await queryBuilder.getOne();

      // const data = await this.findOne({
      //   where: {
      //     ...conditions,
      //   },
      //   relations: ['user'],
      // });

      if (!data) {
        const errorMessage = this.utilService.generateErrorMessage(conditions);
        return err(
          new Error(`Cannot find auth by condition [ ${errorMessage} ]`),
        );
      }

      console.log(
        '🚀 ~ file: auth.repository.ts:26 ~ AuthRepository ~ getAuth ~ data:',
        data,
      );

      return ok(this.proto.reflect(data));
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST);
    }
  }

  setupQueryCondition(conditions: any): SelectQueryBuilder<AuthEntity> {
    const queryBuilder = this.createQueryBuilder(AuthEntity.tableName);

    if (conditions.id) {
      queryBuilder.andWhere(`id = :id`, {
        id: `${conditions.id}`,
      });
    }

    if (conditions.userId) {
      queryBuilder.andWhere(`user_id = :userId`, {
        userId: `${conditions.userId}`,
      });
    }

    if (conditions.ipAddress) {
      queryBuilder.andWhere(`ip_address = :ipAddress`, {
        ipAddress: `${conditions.ipAddress}`,
      });
    }

    if (conditions.authToken) {
      queryBuilder.andWhere(`auth_token = :authToken`, {
        authToken: `${conditions.authToken}`,
      });
    }

    if (conditions.sessionId) {
      queryBuilder.andWhere(`session_id = :sessionId`, {
        sessionId: `${conditions.sessionId}`,
      });
    }

    if (conditions.userAgent) {
      queryBuilder.andWhere(`user_agent = :userAgent`, {
        userAgent: `${conditions.userAgent}`,
      });
    }

    if (conditions.platform) {
      queryBuilder.andWhere(`platform = :platform`, {
        platform: `${conditions.platform}`,
      });
    }

    if (conditions.longtitude) {
      queryBuilder.andWhere(`longtitude = :longtitude`, {
        longtitude: `${conditions.longtitude}`,
      });
    }

    if (conditions.latitude) {
      queryBuilder.andWhere(`latitude = :latitude`, {
        latitude: `${conditions.latitude}`,
      });
    }

    if (conditions.isExtra) {
      queryBuilder.leftJoinAndSelect('auth.user', 'user');
    }

    return queryBuilder;
  }
}
