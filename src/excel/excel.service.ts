import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { GetMemberConditionRequestDto } from '/member/dto/get-member-condition-request.dto'
import { MemberService } from '/member/member.service'
import { pythonBridge } from 'python-bridge'
import { err } from 'neverthrow'
import * as tmp from 'tmp'
import { BadRequestException } from '@nestjs/common'

@Injectable()
export class ExcelService {
  constructor(private readonly memberService: MemberService) {}

  async exportMember(request: GetMemberConditionRequestDto) {
    const reply = await this.memberService.getList(request)

    if (reply.isErr()) {
      return err(reply.error)
    }

    const list = reply.value.memberList

    const py = pythonBridge()

    const { ex, end } = py

    try {
      ex`from xltpl.writerx import BookWriter`

      const writer = await py`BookWriter('./template/member.xlsx')`

      const data = { items: list }

      let file = await new Promise((resolve, reject) => {
        tmp.file(
          {
            discardDescriptor: true,
            prefix: 'MemberExport',
            mode: parseInt('0600', 8),
          },
          async (err, file) => {
            if (err) throw new BadRequestException(err)

            ex`${writer}.render_book(${[data]})`
            ex`${writer}.save(${file})`
              .then(_ => {
                resolve(file)
              })
              .catch(err => {
                throw new BadRequestException(err)
              })
          },
        )
      })
    } catch (error) {
      return err(error)
    } finally {
      end()
    }
  }
}
