import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/auth/constants'
import { Roles } from 'src/auth/roles.decorator'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { ChangePassword } from './dto/changepass.dto'
import { CreateUser } from './dto/create.dto'
import { UpdateUser } from './dto/update.dto'
import { UserLogic } from './user.logic'
@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userLogic: UserLogic) {}

  @Roles('admin')
  @Post('/')
  creteOne(@Body() body: CreateUser) {
    return this.userLogic.create(body)
  }

  @Roles('admin')
  @Put('/update/:userID')
  update(@Body() body: UpdateUser, @Param('userID') userID: number) {
    return this.userLogic.update(Number(userID), body)
  }

  @Roles('admin')
  @Put('/password')
  changePassword(@Body() body: ChangePassword) {
    return this.userLogic.changePassword(body)
  }

  @Roles('admin')
  @Get('/')
  find(@Query() query: PaginateDto) {
    return this.userLogic.findAll(query)
  }
}
