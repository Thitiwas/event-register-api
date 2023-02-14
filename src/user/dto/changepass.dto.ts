import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber } from 'class-validator'

export class ChangePassword {
  @IsNumber()
  @ApiProperty({
    example: 1
  })
  userID: number

  @IsString()
  @ApiProperty({
    example: '123456789124'
  })
  password: string
}
