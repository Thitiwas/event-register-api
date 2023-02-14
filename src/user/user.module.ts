import { Module } from '@nestjs/common'
import { UserLogic } from './user.logic'
import { UserDB } from './user.db'
import { User } from 'src/models/user.model'
import { SequelizeModule } from '@nestjs/sequelize'
import { UserController } from './user.controller'
import { Token } from 'src/models/token.model'
import { TokenModule } from 'src/token/token.module'

@Module({
  imports: [SequelizeModule.forFeature([User, Token]), TokenModule],
  controllers: [UserController],
  providers: [UserLogic, UserDB],
  exports: [UserLogic]
})
export class UserModule {}
