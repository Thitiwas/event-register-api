import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserLogic } from 'src/user/user.logic'
import { LoginDto } from './login.dto'
import * as bcrypt from 'bcrypt'
import { StatusEnum } from 'src/common/enum/status.enum'
@Injectable()
export class AuthService {
  constructor(private userLogic: UserLogic) {}

  async validateUser({ username, pass }: LoginDto): Promise<any> {
    const { data } = await this.userLogic.findOne({
      username,
      status: StatusEnum.ACTIVE
    })

    const compared = await bcrypt.compare(pass, data.password)
    if (data && compared) {
      const { password, ...result } = data
      return result
    }
    throw new UnauthorizedException()
  }
}
