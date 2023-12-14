import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { MemberService } from '/member/member.service'
import { pythonBridge } from 'python-bridge'
import { Result, err, ok } from 'neverthrow'
import * as tmp from 'tmp'
import { join } from 'path'
import {
  ExportFund,
  ExportMember,
  convertEnumGenderToString,
  convertEnumMoneyMethodToVietnamese,
  convertEnumStatusToString,
  convertEnumTypeToString,
} from './types/export'
import { UtilsService } from 'lib/utils'
import { Member_Event } from '/generated/member/member'
import { ExportMemberRequestDto } from './dto/export-member.dto'
import { ExportOptionDto } from './dto/export-fund.dto'
import { User } from '/generated/user/user'
import { EnumProto_UserRole } from '/generated/enumps'
import { PaymentSessionService } from '/paymentSession/paymentSession.service'
import { ReceiptSessionService } from '/receiptSession/receiptSession.service'
// import { ReadStream, createReadStream } from 'fs'

const cwd = process.cwd()

@Injectable()
export class ExcelService {
  constructor(
    private readonly memberService: MemberService,
    private readonly paymentSessionService: PaymentSessionService,
    private readonly receiptSessionService: ReceiptSessionService,
    private readonly utilService: UtilsService,
  ) { }

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

  async exportMember(request: ExportMemberRequestDto, name: string, userInfo: User) {



    const memberReply = await this.memberService.getList({
      ...request.conditions,
      page: 1,
      limit: 10000,
      isExtraClub: true,
      isExtraEvent: true,
      isExtraArea: true,
    }, userInfo)

    if (memberReply.isErr()) {
      return err(memberReply.error)
    }



    let { memberList } = memberReply.value
    const { fromDate, toDate } = request.options
    const exportData: ExportMember[] = []

    if (userInfo.role !== EnumProto_UserRole.ADMIN && userInfo.role !== EnumProto_UserRole.STAFF) {
      memberList = memberList.filter(each => each.memberInClub[0].id === userInfo.club.id)
    }

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

  async exportFund(request: ExportOptionDto, name: string, userInfo: User) {
    const exportData: ExportFund[] = []
    const { fromDate, toDate } = request

    const funcPayment = async () => {
      const paymentSessionReply = await this.paymentSessionService.getList({
        fromDateDone: fromDate,
        toDateDone: toDate,
        isExtraClub: true,
        isExtraPayment: true,
        page: 1,
        limit: 1000,
      }, userInfo)

      if (paymentSessionReply.isErr()) {
        return err(paymentSessionReply.error)
      }

      let { paymentSessionList } = paymentSessionReply.value

      if (userInfo.role !== EnumProto_UserRole.ADMIN) {
        paymentSessionList = paymentSessionList.filter(each => each.club.id === userInfo.club.id)
      }

      for (const paymentSession of paymentSessionList) {
        for (const payment of paymentSession.payment) {
          exportData.push({
            type: 'Chi',
            title: payment.title,
            description: payment.description,
            method: convertEnumMoneyMethodToVietnamese(payment.method),
            amount: payment.amount,
            fundAmount: payment.fundAmount,
            doneDate: this.utilService.convertToVietNamDate(paymentSession.dateDone),
          })
        }
      }
      return ok(true)

    }

    const funcReceipt = async () => {
      const receiptSessionReply = await this.receiptSessionService.getList({
        fromDateDone: fromDate,
        toDateDone: toDate,
        isExtraClub: true,
        isExtraReceipt: true,
        page: 1,
        limit: 1000,
      }, userInfo)

      if (receiptSessionReply.isErr()) {
        return err(receiptSessionReply.error)
      }

      let { receiptSessionList } = receiptSessionReply.value

      if (userInfo.role !== EnumProto_UserRole.ADMIN) {
        receiptSessionList = receiptSessionList.filter(each => each.club.id === userInfo.club.id)
      }

      for (const receiptSession of receiptSessionList) {
        for (const receipt of receiptSession.receipt) {
          exportData.push({
            type: 'Thu',
            title: receipt.title,
            description: receipt.description,
            method: convertEnumMoneyMethodToVietnamese(receipt.method),
            amount: receipt.amount,
            fundAmount: receipt.fundAmount,
            doneDate: this.utilService.convertToVietNamDate(receiptSession.dateDone),
          })
        }
      }

      return ok(true)
    }

    const [payment, receipt] = await Promise.all([funcPayment(), funcReceipt()])

    if (payment.isErr()) {
      return err(payment.error)
    }

    if (receipt.isErr()) {
      return err(receipt.error)
    }

    exportData.sort(this.compareCreatedAt)

    return this.generateFile(exportData, name, { fromDate: this.utilService.convertToVietNamDate(fromDate), toDate: this.utilService.convertToVietNamDate(toDate) })
  }

  compareCreatedAt(a: ExportFund, b: ExportFund) {
    const timestampA = Date.parse(a.doneDate)
    const timestampB = Date.parse(b.doneDate)

    return timestampA - timestampB
  }
}
