import { Injectable, NotAcceptableException } from '@nestjs/common'
import { CreateAuthRequestDto } from './dto/create-auth.dto'
import { Result, err, ok } from 'neverthrow'
import { Auth } from 'src/generated/auth/auth'
import { AuthEntity } from './entities/auth.entity'
import { AuthRepository } from './provider/auth.repository'
import { GetAuthConditionRequestDto } from './dto/get-condition-auth.dto'
import { UserEntity } from 'src/user/entities/user.entity'
import { UserService } from '/user/user.service'
import * as bcrypt from 'bcrypt'
import { User } from '/generated/user/user'

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly userService: UserService,
  ) {}

  async create(
    createData: CreateAuthRequestDto,
    userId: number,
  ): Promise<Result<Auth, Error>> {
    const partialUser: Partial<UserEntity> = {
      id: userId,
    }
    const createAuthData = {
      user: partialUser,
      ...createData,
    } as AuthEntity

    return await this.repo.createAuth(createAuthData)
  }

  async getDetail(
    condition: GetAuthConditionRequestDto,
  ): Promise<Result<Auth, Error>> {
    return await this.repo.getDetail(condition)
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Partial<User> | null> {
    const user = await this.userService.getDetail({
      username: username,
    })

    if (user.isErr()) {
      throw new NotAcceptableException(
        `Could not find user with email : [${username}]`,
      )
    }

    const passwordValid = await bcrypt.compare(password, user.value.password)

    if (passwordValid) {
      const { password, ...other } = user.value
      return other
    }

    return null
  }
}
