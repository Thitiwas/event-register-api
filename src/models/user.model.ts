import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table
} from 'sequelize-typescript'
import { RoleEnum } from 'src/common/enum/role.enum'
import { StatusEnum } from 'src/common/enum/status.enum'
import { Token } from './token.model'

@Table
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: false })
  userID: number

  @Column
  name: string

  @Column
  username: string

  @Column
  password: string

  @Column
  status: StatusEnum

  @Column
  role: RoleEnum

  @Column
  createdBy: number

  @Column
  updatedBy: number

  @HasMany(() => Token)
  tokens: Token[]
}
