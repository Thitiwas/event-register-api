import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { StatusEnum } from 'src/common/enum/status.enum'
import { Seat } from './seat.model'
import { User } from './user.model'

@Table
export class Event extends Model {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  eventID: number

  @Column(DataType.TEXT)
  name: string

  @Column(DataType.TEXT)
  descriptions: string

  @Column(DataType.TEXT)
  location: string

  @Column(DataType.TEXT)
  locationName: string

  @Column(DataType.DATE)
  eventDate: Date

  @Column(DataType.DATE)
  startRegisterAt: Date

  @Column(DataType.DATE)
  endRegisterAt: Date

  @Column(DataType.INTEGER)
  seatColumn: number

  @Column(DataType.INTEGER)
  totalSeat: number

  @Column(DataType.INTEGER)
  seatPerUser: number

  @Column(DataType.TEXT)
  status: StatusEnum

  @Column(DataType.JSONB)
  updatedBy: Array<any>

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  createdBy: number

  @BelongsTo(() => User)
  adminUser: User

  @HasMany(() => Seat)
  seats: Seat
}
