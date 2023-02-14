import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEmail,
  IsEnum,
  IsBoolean
} from 'class-validator'
import { SeatStatusEnum } from 'src/common/enum/seat.enum'

export class CreateSeatDto {
  @IsNumber()
  seatNumber: number

  @IsString()
  firstname: string = ''

  @IsString()
  surname: string = ''

  @IsEmail()
  email: string = ''

  phone: string

  @IsEnum(SeatStatusEnum)
  status: SeatStatusEnum = SeatStatusEnum.AVAILABLE

  @IsBoolean()
  bookedByAdmin: boolean = false

  @IsNumber()
  eventID: number
}
