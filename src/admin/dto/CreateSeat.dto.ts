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
  @ApiProperty({
    example: 1
  })
  seatNumber: number

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
