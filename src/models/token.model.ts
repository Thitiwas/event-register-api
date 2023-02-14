import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table
} from 'sequelize-typescript'
import { StatusEnum } from 'src/common/enum/status.enum'
import { User } from './user.model'

@Table
export class Token extends Model {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  tokenID: number

  @Column
  token: string

  @Column
  status: StatusEnum

  @ForeignKey(() => User)
  @Column
  userID: number

  @BelongsTo(() => User)
  user: User
}
