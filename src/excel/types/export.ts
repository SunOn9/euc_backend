import {
  EnumProto_Gender,
  EnumProto_MemberStatus,
  EnumProto_MemberType,
  EnumProto_MoneyMethod,
} from '/generated/enumps'

export type ExportMember = {
  name: string
  nickName: string
  birthday: string
  status: string
  type: string
  hometown: string
  gender: string
  clubName: string
  totalEvent: number
}

export type ExportFund = {
  type: string
  title: string
  description: string
  amount: number
  doneDate: string
  method: string
  fundAmount: number
}

export function convertEnumMoneyMethodToVietnamese(
  status: EnumProto_MoneyMethod
): string {
  switch (status) {
    case EnumProto_MoneyMethod.CASH || 0: {
      return "Tiền mặt";
    }
    case EnumProto_MoneyMethod.ATM_TRANSFER || 1: {
      return "Chuyển khoản";
    }
    case EnumProto_MoneyMethod.MOMO_TRANSFER || 2: {
      return "Momo";
    }
    default: {
      return "Khác";
    }
  }
}

export function convertEnumGenderToString(gender: EnumProto_Gender): string {
  switch (gender) {
    case EnumProto_Gender.MALE: {
      return 'Nam'
    }
    case EnumProto_Gender.FEMALE: {
      return 'Nữ'
    }
    default: {
      break
    }
  }
}

export function convertEnumStatusToString(
  status: EnumProto_MemberStatus,
): string {
  switch (status) {
    case EnumProto_MemberStatus.BELIEVER: {
      return 'Tín hữu'
    }
    case EnumProto_MemberStatus.SEEKER: {
      return 'Thân hữu'
    }
    case EnumProto_MemberStatus.POTENTIAL_SEEKER: {
      return 'Thân hữu tiềm năng'
    }
    default: {
      break
    }
  }
}

export function convertEnumTypeToString(type: EnumProto_MemberType): string {
  switch (type) {
    case EnumProto_MemberType.STUDENT: {
      return 'X'
    }
    case EnumProto_MemberType.WORKER: {
      return ''
    }
    default: {
      break
    }
  }
}
