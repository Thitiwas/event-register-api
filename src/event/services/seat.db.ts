import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { WhereOptions } from 'sequelize/types/model'
import { FindAllDto } from 'src/common/dto/findall.dto'
import { Seat } from '../../models/seat.model'

@Injectable()
export class SeatDB {
  constructor(
    @InjectModel(Seat)
    private seatModel: typeof Seat
  ) {}
  async create(payload: any): Promise<Seat> {
    return await this.seatModel.create(payload)
  }

  async bulkCreate(payload: any[]): Promise<Seat[]> {
    return await this.seatModel.bulkCreate(payload)
  }

  async findAll(
    condition: WhereOptions,
    attributes?: Array<string>,
    includes?: Array<any>,
    query?: FindAllDto
  ): Promise<Seat[]> {
    const { order }: { order: Array<any> } = query.buildOptionalQuery()
    const payload = {
      where: condition,
      order
    }
    if (attributes && attributes.length) payload['attributes'] = attributes
    if (includes && includes.length) payload['include'] = includes
    return await this.seatModel.findAll(payload)
  }

  async update(
    condition: WhereOptions,
    payload?: any,
    transaction?: any
  ): Promise<any> {
    let options = {
      where: condition
    }
    if (transaction) options['transaction'] = transaction
    return await this.seatModel.update(payload, options)
  }

  findOne(
    condition: WhereOptions,
    attributes?: Array<string>,
    includes?: Array<any>,
    order?: Array<any>,
    transaction?: any
  ): Promise<Seat> {
    const payload = {
      where: condition
    }
    if (transaction) payload['transaction'] = transaction
    if (order && order.length) payload['order'] = order
    if (attributes && attributes.length) payload['attributes'] = attributes
    if (includes && includes.length) payload['include'] = includes
    return this.seatModel.findOne(payload)
  }

  async count(condition: any): Promise<any> {
    return await this.seatModel.count({ where: condition })
  }
}
