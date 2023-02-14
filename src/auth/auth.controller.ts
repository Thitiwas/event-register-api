import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { LoginDto } from './login.dto'
import { Public } from './constants'
import { AuthLogic } from './auth.logic'
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authLogic: AuthLogic) {}

  @Public()
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authLogic.login(body)
  }

  @ApiBearerAuth()
  @Post('/logout')
  logout() {
    return this.authLogic.logout()
  }
}
