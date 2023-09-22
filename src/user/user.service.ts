import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UserRepository } from './provider/user.repository';
import * as bcrypt from 'bcrypt';
import { GetUserConditionRequestDto } from './dto/get-user-condition-request.dto';
import { UpdateUserRequestDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async create(createData: CreateUserRequestDto) {
    createData.password = await bcrypt.hash(createData.password, 10);

    return await this.repo.createUser(createData);
  }

  async getDetail(requestData: GetUserConditionRequestDto) {
    return await this.repo.getDetail(requestData);
  }

  async getList(requestData: GetUserConditionRequestDto) {
    return await this.repo.getList(requestData);
  }

  async update(requestData: UpdateUserRequestDto) {
    return await this.repo.updateUser(requestData);
  }
}
