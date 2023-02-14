import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { WhereOptions } from 'sequelize/types/model'
import { FindAllDto } from 'src/common/dto/findall.dto'
import { FindOneDto } from 'src/common/dto/findone.dto'
import { PaginateDto } from 'src/common/dto/pagination.dto'
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
}
