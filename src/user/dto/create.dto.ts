import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsEmail, IsNumber } from 'class-validator'
import { RoleEnum } from 'src/common/enum/role.enum'
import { StatusEnum } from 'src/common/enum/status.enum'

export class CreateUser {
  @IsString()
  @ApiProperty({
    example: 'BUTTER'
  })
  name: string

  @IsEmail()
  @ApiProperty({
    example: 'admin@email.com'
  })
  username: string

  @IsString()
  @ApiProperty({
    example: '123456789'
  })
  password: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: StatusEnum.ACTIVE
  })
  status: StatusEnum = StatusEnum.ACTIVE

  @IsOptional()
  @IsString()
  role: RoleEnum = RoleEnum.ADMIN

  @IsOptional()
  @IsNumber()
  createdBy: number

  @IsOptional()
  @IsNumber()
  updatedBy: number
}
