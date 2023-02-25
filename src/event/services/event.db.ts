import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { WhereOptions } from 'sequelize/types/model'
import { FindOneDto } from 'src/common/dto/findone.dto'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { Event } from '../../models/events.model'

@Injectable()
export class EventDB {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event
  ) {}
  findOne(
    condition: WhereOptions,
    attributes?: Array<string>,
    includes?: Array<any>,
    order?: Array<any>
  ): Promise<Event> {
    const payload = {
      where: condition
    }
    if (order && order.length) payload['order'] = order
    if (attributes && attributes.length) payload['attributes'] = attributes
    if (includes && includes.length) payload['include'] = includes
    return this.eventModel.findOne(payload)
  }

  async create(payload: any): Promise<Event> {
    return await this.eventModel.create(payload)
  }

  async update(condition: WhereOptions, payload?: any): Promise<any> {
    return await this.eventModel.update(payload, {
      where: condition
    })
  }

  async findPagination(
    condition: WhereOptions,
    query: PaginateDto,
    attributes?: Array<string>,
    includes?: Array<any>
  ): Promise<{ total: number; results: Event[] }> {
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

    const total = await this.eventModel.count(payload)
    const results = await this.eventModel.findAll(payload)
    return { total, results }
  }

  async decrement(condition: WhereOptions, field: string, transaction?: any) {
    let options = {
      where: condition
    }
    if (transaction) options['transaction'] = transaction
    const decrementValue = 1
    return await this.eventModel.update(
      {
        [field]: Sequelize.literal(`${field} - ${decrementValue}`)
      },
      options
    )
  }
}
