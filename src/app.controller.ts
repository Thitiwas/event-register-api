import { Controller, Get } from '@nestjs/common'
import { Public } from './auth/constants'

@Controller()
export class AppController {
  constructor() {}

  @Public()
  @Get()
  getHello(): string {
    return 'Event Register Project'
  }
}
