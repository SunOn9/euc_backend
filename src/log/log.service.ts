import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { LogRepository } from './provider/log.repository'
import { CreateLogRequestDto } from './dto/create-log.dto'
import { GetLogConditionRequestDto } from './dto/get-log-condition-request.dto'
import { User } from '/generated/user/user'
import { EnumProto_UserRole } from '/generated/enumps'
import CustomException from 'lib/utils/custom.exception'
import { HttpStatus } from '@nestjs/common'

@Injectable()
export class LogService {
  constructor(private readonly repo: LogRepository) {}

  async create(requestData: CreateLogRequestDto) {
    return await this.repo.createLog(requestData)
  }

  async getDetail(requestData: GetLogConditionRequestDto, userInfo: User) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN) {
      throw new CustomException('', `Forbidden resource`, HttpStatus.FORBIDDEN)
    }
    return await this.repo.getDetail(requestData)
  }

  async getList(requestData: GetLogConditionRequestDto, userInfo: User) {
    if (userInfo.role !== EnumProto_UserRole.ADMIN) {
      throw new CustomException('', `Forbidden resource`, HttpStatus.FORBIDDEN)
    }
    return await this.repo.getList(requestData)
  }
}
