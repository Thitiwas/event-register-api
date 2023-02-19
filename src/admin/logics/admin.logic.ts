import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { EventDB } from '../../event/services/event.db'
import { CreateEventDto } from '../dto/CreateEvent.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CreateSeatDto } from '../dto/CreateSeat.dto'
import { SeatDB } from '../../event/services/seat.db'
import { GetSeatDto } from '../dto/GetSeat.dto'
import { RoleEnum } from 'src/common/enum/role.enum'
import { RegisterDto } from '../dto/Register.dto'
import { SeatStatusEnum } from 'src/common/enum/seat.enum'
import { DateTime } from 'luxon'
import { Op } from 'sequelize'
import { Event } from '../../models/events.model'
@Injectable()
export class AdminEventLogic {
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
    return await this.eventDB.findPagination({}, query)
  }

  async findByEventID(eventID: number) {
    return await this.eventDB.findOne({ eventID })
  }

  async findALlSeatByEventID(eventID: number, query: GetSeatDto) {
    const condition = await query.buildCondition(eventID)
    const seats = await this.seatDB.findAll(condition, [], [], query)
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
      const seatData = await this.seatDB.findOne(
        { seatID: payload.seatID },
        [],
        [
          {
            model: Event,
            attributes: ['startRegisterAt', 'endRegisterAt']
          }
        ]
      )
      if (!seatData || !seatData.event) {
        throw new BadRequestException(`ตำแหน่งที่นั่งที่คุณเลือกไม่มีอยู่`)
      }
      const startDate = DateTime.fromJSDate(
        seatData.event.startRegisterAt
      ).toMillis()
      const endDate = DateTime.fromJSDate(
        seatData.event.endRegisterAt
      ).toMillis()

      const dateToCheck = DateTime.now().toMillis()
      if (dateToCheck >= endDate) {
        throw new BadRequestException('Event นี้ปิดลงทะเบียนแล้ว')
      } else if (seatData.status === SeatStatusEnum.BOOKED) {
        throw new BadRequestException(`ตำแหน่งที่นั่งที่คุณเลือกถูกจองแล้ว`)
      }
      payload.bookedByAdmin = true
      payload.status = SeatStatusEnum.BOOKED
      await this.seatDB.update(
        { eventID: payload.eventID, seatID: payload.seatID },
        payload
      )
      return { message: 'update success' }
    } catch (error) {
      throw error
    }
  }
}
