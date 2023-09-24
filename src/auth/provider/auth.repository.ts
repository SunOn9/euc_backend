import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, FindOneOptions, ILike, Repository } from 'typeorm';
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
        return err(new Error(`Empty conditions`));
      }

      const options = this.setupConditions(conditions)

      if (conditions.isExtra) {
        options.relations = ['user'];
      }

      const data = await this.findOne(options);

      if (this.utilService.isObjectEmpty(data)) {
        const errorMessage = this.utilService.generateErrorMessage(conditions);
        return err(
          new Error(`Cannot find auth by conditions [ ${errorMessage} ]`),
        );
      }

      return ok(this.proto.reflect(data));
    } catch (e) {
      throw new CustomException('ERROR', e.message, HttpStatus.BAD_REQUEST);
    }
  }

  setupConditions(conditions: GetAuthConditionRequestDto): FindOneOptions<AuthEntity> {
    const { isExtra, ipAddress, ...other } = conditions

    const options: FindOneOptions<AuthEntity> = ({
      where: {
        ipAddress: ILike(`%${ipAddress}%`),
        ...other
      }
    })

    return options
  }
}
