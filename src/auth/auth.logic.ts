import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { StatusEnum } from 'src/common/enum/status.enum'
import { TokenLogic } from 'src/token/logics/token.logic'
import { AuthService } from './auth.service'
import { LoginDto } from './login.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { CreateUser } from 'src/user/dto/create.dto'

@Injectable()
export class AuthLogic {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private tokenLogic: TokenLogic
  ) {}

  async login(user: LoginDto) {
    try {
      const userInfo = await this.authService.validateUser(user)
      const now = new Date()
      const payload = {
        username: user.username,
        name: userInfo.dataValues.name,
        sub: userInfo.dataValues.userID,
        role: userInfo.dataValues.role
      }
      const access_token = this.jwtService.sign(payload, { expiresIn: '7d' })
      await this.tokenLogic.create({
        token: access_token,
        status: StatusEnum.ACTIVE,
        userID: payload.sub
      })
      return {
        access_token,
        ...payload,
        tokenExpire: now.setDate(now.getDate() + 7)
      }
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
  async logout() {
    const bearerToken = JwtAuthGuard.getTokenFromRequest()
    const token = bearerToken.split(' ')[1] || null
    return await this.tokenLogic.updateByToken(token, {
      status: StatusEnum.INACTIVE
    })
  }
}
