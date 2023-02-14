import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CreateUser } from './dto/create.dto'
import { UserDB } from './user.db'
import * as bcrypt from 'bcrypt'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { ChangePassword } from './dto/changepass.dto'
import { TokenLogic } from 'src/token/logics/token.logic'
import { StatusEnum } from 'src/common/enum/status.enum'
import { UpdateUser } from './dto/update.dto'

@Injectable()
export class UserLogic {
  constructor(private userDB: UserDB, private tokenLogic: TokenLogic) {}
  async findOne(condition: any) {
    let res = { data: null, errors: [] }
    try {
      res.data = await this.userDB.findOne(condition)
    } catch (error) {
      throw new UnauthorizedException('try with the new username')
    }
    return res
  }

  async create(payload: CreateUser) {
    let res = { data: null, errors: [] }
    try {
      const { data } = await this.findOne({ username: payload.username })
      if (data) throw new UnauthorizedException('try with the new username')

      let hashValue: string = await new Promise((myResolve, myReject) => {
        bcrypt.hash(payload.password, 10, async (err, hash) => {
          if (err) myReject()
          myResolve(hash)
        })
      })
      payload.password = hashValue
      const userID = await JwtAuthGuard.getAuthorizedUserId()
      payload.updatedBy = userID
      payload.createdBy = userID
      const { dataValues } = await this.userDB.create(payload)
      if (dataValues?.userID) res.data = { userID: dataValues.userID }
    } catch (error) {
      throw error
    }
    return res
  }

  async findAll(query: PaginateDto) {
    let res = { data: null, errors: [] }
    try {
      res.data = await this.userDB.findPagination({}, query, [
        'name',
        'username',
        'status'
      ])
    } catch (error) {
      res.errors = error
    }
    return res
  }

  async changePassword(payload: ChangePassword) {
    let hashValue: string = await new Promise((myResolve, myReject) => {
      bcrypt.hash(payload.password, 10, async (err, hash) => {
        if (err) myReject()
        myResolve(hash)
      })
    })
    await this.userDB.update(
      { userID: payload.userID },
      { password: hashValue }
    )
    await this.tokenLogic.updateByUserID(payload.userID, {
      status: StatusEnum.INACTIVE
    })
  }

  async update(userID: number, payload: UpdateUser) {
    await this.userDB.update({ userID }, payload)
    await this.tokenLogic.updateByUserID(userID, {
      status: StatusEnum.INACTIVE
    })
  }
}
