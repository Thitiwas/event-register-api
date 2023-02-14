import { IsString } from 'class-validator'
import { StatusEnum } from '../../common/enum/status.enum'

export class CreateToken {
  @IsString()
  token: string
  @IsString()
  status: StatusEnum = StatusEnum.ACTIVE
  @IsString()
  userID: string
}
