export type CustomError = {
  errorCode: string
  message: string
}

export const FORBIDDEN: CustomError = {
  errorCode: 'EUC001',
  message: 'Không có quyền truy cập',
}
