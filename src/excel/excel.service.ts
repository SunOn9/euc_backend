import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { GetMemberConditionRequestDto } from '/member/dto/get-member-condition-request.dto'
import { MemberService } from '/member/member.service'
import { pythonBridge } from 'python-bridge'
import { Result, err, ok } from 'neverthrow'
import * as tmp from 'tmp'
import { join } from 'path'
// import { ReadStream, createReadStream } from 'fs'

const cwd = process.cwd()

@Injectable()
export class ExcelService {
  constructor(private readonly memberService: MemberService) {}

  async generateFile<T>(
    list: T,
    name: string,
  ): Promise<Result<tmp.FileResult, Error>> {
    const py = pythonBridge({ cwd: join(cwd, 'src/excel') })

    const { ex, end } = py

    try {
      await ex`from xltpl.writerx import BookWriter`

      const templatePath = `./template/${name}.xlsx`

      await ex`writer = BookWriter(${templatePath})`

      const data = { items: list }

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

  async exportMember(request: GetMemberConditionRequestDto, name: string) {
    const reply = await this.memberService.getList({
      ...request,
      isExtraClub: true,
    })

    if (reply.isErr()) {
      return err(reply.error)
    }

    const list = reply.value.memberList

    return this.generateFile(list, name)
  }
}
