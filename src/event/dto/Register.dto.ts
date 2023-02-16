import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { SeatStatusEnum } from 'src/common/enum/seat.enum'
import { CreateSeatDto } from './CreateSeat.dto'

export class RegisterDto {
  @IsNumber()
  @ApiProperty({
    example: 101
  })
  seatID: number

  @IsString()
  @ApiProperty({
    example: 'นายฐิติวัสส์'
  })
  firstname: string = ''

  @IsString()
  @ApiProperty({
    example: 'ประสงค์'
  })
  surname: string = ''

  @IsEmail()
  @ApiProperty({
    example: 'champ@emaol.com'
  })
  email: string = ''

  @IsString()
  @ApiProperty({
    example: '0909900212'
  })
  phone: string

  @IsEnum(SeatStatusEnum)
  status: SeatStatusEnum = SeatStatusEnum.AVAILABLE

  @IsOptional()
  @IsBoolean()
  bookedByAdmin: boolean = false

  @IsNumber()
  @ApiProperty({
    example: '15'
  })
  eventID: number
}
