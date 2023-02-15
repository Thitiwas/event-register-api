import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { CreateSeatDto } from './CreateSeat.dto'

export class RegisterDto extends CreateSeatDto {
  @IsNumber()
  @ApiProperty({
    example: 101
  })
  seatID: number
}
