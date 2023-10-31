import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { MemberService } from '/member/member.service'
import { pythonBridge } from 'python-bridge'
import { Result, err, ok } from 'neverthrow'
import * as tmp from 'tmp'
import { join } from 'path'
import {
  ExportMember,
  convertEnumGenderToString,
  convertEnumStatusToString,
  convertEnumTypeToString,
} from './types/export'
import { UtilsService } from 'lib/utils'
import { ExportMemberRequest } from '/generated/member/member.request'
import { Member_Event } from '/generated/member/member'
import { ExportMemberRequestDto } from './dto/export-member.dto'
// import { ReadStream, createReadStream } from 'fs'

const cwd = process.cwd()

@Injectable()
export class ExcelService {
  constructor(
    private readonly memberService: MemberService,
    private readonly utilService: UtilsService,
  ) {}

  async generateFile<T>(
    exportData: T,
    name: string,
    extraData?: any,
  ): Promise<Result<tmp.FileResult, Error>> {
    const py = pythonBridge({ cwd: join(cwd, 'src/excel') })

    const { ex, end } = py

    try {
      await ex`from xltpl.writerx import BookWriter`

      const templatePath = `./template/${name}.xlsx`

      await ex`writer = BookWriter(${templatePath})`

      const data = { items: exportData, extra: extraData }

      await ex`writer.render_book(${[data]})`

      const tmpFile = tmp.fileSync({ postfix: '.xlsx', mode: 0o666 })

      await ex`writer.save(${tmpFile.name})`

      return ok(tmpFile)
    } catch (error) {
      return err(error)
    } finally {
      end()
    }
  }

  async exportMember(request: ExportMemberRequestDto, name: string) {
    const memberReply = await this.memberService.getList({
      ...request.conditions,
      isExtraClub: true,
      isExtraEvent: true,
      isExtraArea: true,
    })

    if (memberReply.isErr()) {
      return err(memberReply.error)
    }

    const { memberList } = memberReply.value
    const { fromDate, toDate } = request.options
    const exportData: ExportMember[] = []

    for (const member of memberList) {
      let eventList: Member_Event[]
      if (fromDate !== undefined && toDate !== undefined) {
        eventList = member.event.filter(each =>
          this.utilService.isDateBetween(
            request.options.fromDate,
            request.options.toDate,
            each.createdAt,
          ),
        )
      } else {
        eventList = member.event
      }

      exportData.push({
        name: member.name,
        nickName: member.nickName,
        birthday: this.utilService.convertToVietNamDate(member.birthday),
        status: convertEnumStatusToString(member.status),
        type: convertEnumTypeToString(member.type),
        hometown: member.hometown.name,
        gender: convertEnumGenderToString(member.gender),
        clubName: member.memberInClub[0].club.name,
        totalEvent: eventList.length,
      })
    }
    return this.generateFile(exportData, name)
  }
}
