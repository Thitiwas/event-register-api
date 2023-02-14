import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { WhereOptions } from 'sequelize/types/model'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { User } from '../models/user.model'
import { CreateUser } from './dto/create.dto'

@Injectable()
export class UserDB {
  constructor(
    @InjectModel(User)
    private userModel: typeof User
  ) {}
  findOne(
    condition: WhereOptions,
    attributes?: Array<string>,
    includes?: Array<any>
  ): Promise<User> {
    const payload = {
      where: condition
    }
    if (attributes && attributes.length) payload['attributes'] = attributes
    if (includes && includes.length) payload['include'] = includes
    return this.userModel.findOne(payload)
  }

  async create(payload: any): Promise<User> {
    return await this.userModel.create(payload)
  }

  async update(condition: WhereOptions, payload?: any): Promise<any> {
    return await this.userModel.update(payload, {
      where: condition
    })
  }

  async findPagination(
    condition: WhereOptions,
    query: PaginateDto,
    attributes?: Array<string>,
    includes?: Array<any>
  ): Promise<User[]> {
    const {
      order,
      limit,
      offset
    }: { order: Array<any>; limit: number; offset: number } =
      query.buildOptionalQuery()
    const payload = {
      where: condition,
      order,
      limit,
      offset
    }
    if (attributes && attributes.length) payload['attributes'] = attributes
    if (includes && includes.length) payload['include'] = includes
    return await this.userModel.findAll(payload)
  }
}
