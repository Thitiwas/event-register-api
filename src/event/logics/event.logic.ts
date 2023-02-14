import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { EventDB } from '../services/event.db'
import { CreateEventDto } from '../dto/CreateEvent.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CreateSeatDto } from '../dto/CreateSeat.dto'
import { SeatDB } from '../services/seat.db'
import { GetSeatDto } from '../dto/GetSeat.dto'

@Injectable()
export class EventLogic {
  constructor(private eventDB: EventDB, private seatDB: SeatDB) {}

  async create(payload: CreateEventDto) {
    try {
      payload.createdBy = await JwtAuthGuard.getAuthorizedUserId()
      const resEvent = await this.eventDB.create(payload)
      const seats = await this.genSeats(resEvent.eventID, payload.totalSeat)
      return await this.seatDB.bulkCreate(seats)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async genSeats(eventID: number, totalSeat: number) {
    if (!totalSeat)
      throw new BadRequestException('cannot generate seat please try again')
    let seats: CreateSeatDto[] = []
    for (let index = 0; index < totalSeat; index++) {
      const seat = new CreateSeatDto()
      seat.eventID = eventID
      seat.seatNumber = index + 1
      seats.push(seat)
    }
    return seats
  }

  async findEventPagination(query: PaginateDto) {
    return await this.eventDB.findPagination(
      {
        // add date condition
      },
      query
    )
  }

  async findByEventID(eventID: number) {
    return await this.eventDB.findOne({ eventID })
  }

  async findALlSeatByEventID(eventID: number, query: GetSeatDto) {
    const condition = await query.buildCondition(eventID)
    return await this.seatDB.findAll(condition, [], [], query)
  }
}
