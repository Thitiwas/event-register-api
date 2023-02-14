import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { WhereOptions } from 'sequelize/types/model'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { Token } from '../../models/token.model'
import { CreateToken } from '../dto/createtoken.dto'

@Injectable()
export class TokenDB {
  constructor(
    @InjectModel(Token)
    private tokenModel: typeof Token
  ) {}

  async findPagination(
    condition: WhereOptions,
    query: PaginateDto,
    attributes?: Array<string>,
    includes?: Array<any>
  ): Promise<Token[]> {
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

    if (includes && includes.length) payload['include'] = includes
    if (attributes && attributes.length) payload['attributes'] = attributes
    return await this.tokenModel.findAll(payload)
  }

  findOne(
    condition: WhereOptions,
    attributes?: Array<string>,
    includes?: Array<any>
  ): Promise<Token> {
    const payload = {
      where: condition
    }
    if (includes && includes.length) payload['include'] = includes
    if (attributes && attributes.length) payload['attributes'] = attributes

    return this.tokenModel.findOne(payload)
  }

  async create(payload: any): Promise<Token> {
    return await this.tokenModel.create(payload)
  }

  async update(condition: WhereOptions, payload: any): Promise<any> {
    return await this.tokenModel.update(payload, {
      where: condition
    })
  }
}
