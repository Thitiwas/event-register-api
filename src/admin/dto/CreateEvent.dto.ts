import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator'
import { StatusEnum } from 'src/common/enum/status.enum'
import { DateTime } from 'luxon'

export class CreateEventDto {
  @IsString()
  @ApiProperty({
    example: 'Event code challenge'
  })
  name: string

  @IsString()
  @ApiProperty({
    example: 'รายละเอียดของ event ครั้งนี้เพื่อทดสอบคุณ'
  })
  descriptions: string

  @IsString()
  @ApiProperty({
    example: 'google map url'
  })
  location: string

  @IsString()
  @ApiProperty({
    example: 'ห้อง 408 อาคาร A'
  })
  locationName: string

  @IsString()
  @ApiProperty({
    example: DateTime.local().plus({ days: 10 })
  })
  eventDate: Date

  @IsString()
  @ApiProperty({
    example: DateTime.local()
  })
  startRegisterAt: Date

  @IsString()
  @ApiProperty({
    example: DateTime.local().plus({ days: 3 })
  })
  endRegisterAt: Date

  @IsOptional()
  @IsNumber()
  availableseat: number

  @IsNumber()
  @ApiProperty({
    example: 5
  })
  seatColumn: number

  @IsNumber()
  @ApiProperty({
    example: 10
  })
  totalSeat: number

  @IsNumber()
  @ApiProperty({
    example: 1
  })
  seatPerUser: number = 1

  @IsOptional()
  @IsString()
  status: StatusEnum = StatusEnum.ACTIVE

  @IsOptional()
  @IsNumber()
  createdBy: number

  @IsOptional()
  @IsArray()
  updatedBy: Array<any> = []
}
