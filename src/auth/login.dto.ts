import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    example: 'admin@email.com'
  })
  username: string

  @IsString()
  @ApiProperty({
    example: '123456789'
  })
  pass: string
}
