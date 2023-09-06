import { Injectable } from '@nestjs/common';
import { CreateAuthRequestDto } from './dto/create-auth.dto';
import { Result } from 'neverthrow';
import { Auth } from 'src/generated/auth/auth';
import { AuthEntity } from './entities/auth.entity';
import { AuthRepository } from './provider/auth.repository';
import { AuthReflect } from './provider/auth.proto';
import { GetAuthConditionRequestDto } from './dto/get-condition-auth.dto';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly protoService: AuthReflect,
  ) {}

  async create(createData: CreateAuthRequestDto): Promise<Result<Auth, Error>> {
    const { userId, ...other } = createData;
    const partialUser: Partial<UserEntity> = {
      id: userId,
    };
    const createAuthData = {
      user: partialUser,
      ...other,
    } as AuthEntity;

    return await this.repo.createAuth(createAuthData);
  }

  async getDetail(
    condition: GetAuthConditionRequestDto,
  ): Promise<Result<Auth, Error>> {
    return await this.repo.getDetail(condition);
  }
}
