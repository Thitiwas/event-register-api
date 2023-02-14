import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from 'src/user/user.module'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthLogic } from './auth.logic'
import { TokenModule } from 'src/token/token.module'

@Module({
  imports: [
    UserModule,
    TokenModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthLogic, AuthService, JwtStrategy]
})
export class AuthModule {}
