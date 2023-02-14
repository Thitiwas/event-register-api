import { Injectable } from '@nestjs/common'
import { WhereOptions } from 'sequelize/types/model'
import { StatusEnum } from 'src/common/enum/status.enum'
import { TokenDB } from '../db/token.db'
import { CreateToken } from '../dto/createtoken.dto'

@Injectable()
export class TokenLogic {
  constructor(private tokenDB: TokenDB) {}
  async findOneByTokenAndStatus(token: number, status: StatusEnum) {
    let res = { data: null, errors: [] }
    try {
      const condition: WhereOptions = { token, status }
      res.data = await this.tokenDB.findOne(condition)
    } catch (error) {
      res.errors = error
    }
    return res
  }

  async create(payload: CreateToken) {
    let res = { data: null, errors: [] }
    try {
      const { dataValues } = await this.tokenDB.create(payload)
      if (dataValues?.tokenID)
        res.data = { tokenID: dataValues.tokenID, token: dataValues.token }
    } catch (error) {
      throw error
    }
    return res
  }

  async updateByToken(token: string, payload: any) {
    let res = { data: null, errors: [] }
    try {
      const updateStatus = await this.tokenDB.update({ token: token }, payload)
      if (updateStatus[0]) {
        res.data = {
          status: 'UPDATED'
        }
      }
    } catch (error) {
      res.errors = error
    }
    return res
  }
  async updateByUserID(userID: number, payload: any) {
    let res = { data: null, errors: [] }
    try {
      const updateStatus = await this.tokenDB.update(
        { userID: userID },
        payload
      )
      if (updateStatus[0]) {
        res.data = {
          status: 'UPDATED'
        }
      }
    } catch (error) {
      res.errors = error
    }
    return res
  }
}
