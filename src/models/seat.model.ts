import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'
import { SeatStatusEnum } from 'src/common/enum/seat.enum'
import { Event } from '../models/events.model'
@Table
export class Seat extends Model {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  seatID: number

  @Column(DataType.INTEGER)
  seatNumber: number

  @Column(DataType.TEXT)
  firstname: string

  @Default('')
  @Column(DataType.TEXT)
  surname: string

  @Default('')
  @Column(DataType.TEXT)
  email: string

  @Default('')
  @Column(DataType.TEXT)
  phone: string

  @Column(DataType.TEXT)
  status: SeatStatusEnum = SeatStatusEnum.AVAILABLE

  @Column(DataType.BOOLEAN)
  bookedByAdmin: boolean = false

  @ForeignKey(() => Event)
  @Column(DataType.INTEGER)
  eventID: number

  @BelongsTo(() => Event)
  event: Event
}
