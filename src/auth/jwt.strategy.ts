import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { jwtConstants } from './constants'
import { JwtAuthGuard } from './jwt-auth.guard'
import { StatusEnum } from 'src/common/enum/status.enum'
import { TokenLogic } from 'src/token/logics/token.logic'
const Strategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private tokenLogic: TokenLogic) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: any) {
    const bearerToken = JwtAuthGuard.getTokenFromRequest()
    const tokens = bearerToken.split(' ')
    const validToken = await this.tokenLogic.findOneByTokenAndStatus(
      tokens[1],
      StatusEnum.ACTIVE
    )
    if (!validToken.data) {
      throw new UnauthorizedException()
    }
    return payload
  }
}
