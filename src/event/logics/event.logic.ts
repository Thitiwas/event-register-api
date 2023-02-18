import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { EventDB } from '../services/event.db'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CreateSeatDto } from '../dto/CreateSeat.dto'
import { SeatDB } from '../services/seat.db'
import { GetSeatDto } from '../dto/GetSeat.dto'
import { RoleEnum } from 'src/common/enum/role.enum'
import { RegisterDto } from '../dto/Register.dto'
import { SeatStatusEnum } from 'src/common/enum/seat.enum'
@Injectable()
export class EventLogic {
  constructor(private eventDB: EventDB, private seatDB: SeatDB) {}
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
    const seats = await this.seatDB.findAll(
      condition,
      ['seatID', 'seatNumber', 'firstname', 'surname', 'status', 'eventID'],
      [],
      query
    )
    const booked = await this.seatDB.count({
      eventID,
      status: SeatStatusEnum.BOOKED
    })
    const available = await this.seatDB.count({
      eventID,
      status: SeatStatusEnum.AVAILABLE
    })
    return { seats, booked, available }
  }

  async findSeatByID(seatID: number) {
    try {
      return await this.seatDB.findOne({ seatID })
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }

  async register(payload: RegisterDto, role: string) {
    try {
      const seatData = await this.findSeatByID(payload.seatID)
      if (seatData.status === SeatStatusEnum.BOOKED)
        throw new BadRequestException(
          `selected seat not available please try again.`
        )
      await JwtAuthGuard.getAuthorizedUser()
      if (role === RoleEnum.ADMIN) payload.bookedByAdmin = true
      payload.status = SeatStatusEnum.BOOKED
      await this.seatDB.update(
        { eventID: payload.eventID, seatID: payload.seatID },
        payload
      )
      return { message: 'update success' }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
