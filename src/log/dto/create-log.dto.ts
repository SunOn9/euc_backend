import { CreateLogRequest } from '/generated/log/log.request'
import { User } from '/generated/user/user'
import { Action } from '/permission/casl/casl.type'

export class CreateLogRequestDto implements CreateLogRequest {
  subject: string

  action: Action

  oldData?: any

  newData?: any

  sessionId: string

  user: User
}
