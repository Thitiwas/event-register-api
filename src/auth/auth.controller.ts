import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { LoginDto } from './login.dto'
import { Public } from './constants'
import { AuthLogic } from './auth.logic'
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authLogic: AuthLogic) {}

  @ApiOperation({
    description: 'Admin Login'
  })
  @Public()
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authLogic.login(body)
  }

  @ApiOperation({
    description: 'Admin logout'
  })
  @ApiBearerAuth()
  @Post('/logout')
  logout() {
    return this.authLogic.logout()
  }
}
