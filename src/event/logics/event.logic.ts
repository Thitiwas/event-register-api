import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { EventDB } from '../services/event.db'
import { CreateSeatDto } from '../dto/CreateSeat.dto'
import { SeatDB } from '../services/seat.db'
import { GetSeatDto } from '../dto/GetSeat.dto'
import { RegisterDto } from '../dto/Register.dto'
import { SeatStatusEnum } from 'src/common/enum/seat.enum'
import { DateTime } from 'luxon'
import { Op } from 'sequelize'
import { Event } from '../../models/events.model'
import { Sequelize } from 'sequelize-typescript'
import { Seat } from '../../models/seat.model'
import { InjectModel } from '@nestjs/sequelize'
import { Transaction } from 'sequelize'
@Injectable()
export class EventLogic {
  constructor(
    private eventDB: EventDB,
    private seatDB: SeatDB,
    @InjectModel(Seat)
    private seatModel: typeof Seat
  ) {}
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
    const currentDate = Date.now()
    return await this.eventDB.findPagination(
      {
        startRegisterAt: {
          [Op.lte]: currentDate
        },
        endRegisterAt: {
          [Op.gte]: currentDate
        }
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

  async registerTransaction(payload: RegisterDto, role: string) {
    const transaction = await this.seatModel.sequelize.transaction()
    try {
      const seatData = await this.seatModel.findOne({
        where: {
          seatID: payload.seatID,
          eventID: payload.eventID,
          status: 'available'
        },
        include: [
          {
            model: Event,
            attributes: ['startRegisterAt', 'endRegisterAt']
          }
        ],
        lock: {
          of: Seat,
          level: Transaction.LOCK.UPDATE
        },
        transaction
      })

      if (
        !seatData ||
        !seatData.event ||
        seatData.status !== SeatStatusEnum.AVAILABLE
      ) {
        throw new BadRequestException(`ตำแหน่งที่นั่งที่คุณเลือกถูกจองแล้ว`)
      }
      const startDate = DateTime.fromJSDate(
        seatData.event.startRegisterAt
      ).toMillis()
      const endDate = DateTime.fromJSDate(
        seatData.event.endRegisterAt
      ).toMillis()

      const dateToCheck = DateTime.now().toMillis()
      if (dateToCheck <= startDate || dateToCheck >= endDate) {
        let message = 'Event นี้ปิดลงทะเบียนแล้ว'
        if (dateToCheck <= startDate) message = 'Event นี้ยังไม่เปิดลงทะเบียน'
        throw new BadRequestException(message)
      }

      payload.status = SeatStatusEnum.BOOKED
      await this.seatDB.update(
        { eventID: payload.eventID, seatID: payload.seatID },
        payload,
        transaction
      )
      await this.eventDB.decrement(
        { eventID: payload.eventID },
        'availableseat',
        transaction
      )

      await transaction.commit()
      return { message: 'update success' }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
