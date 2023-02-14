import { Global, Module } from '@nestjs/common'
import { TokenLogic } from './logics/token.logic'
import { SequelizeModule } from '@nestjs/sequelize'
import { Token } from '../models/token.model'
import { TokenDB } from './db/token.db'
import { User } from 'src/models/user.model'

@Global()
@Module({
  imports: [SequelizeModule.forFeature([Token, User])],
  providers: [TokenLogic, TokenDB],
  exports: [TokenLogic]
})
export class TokenModule {}
