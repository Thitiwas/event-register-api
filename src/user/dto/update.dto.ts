import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsEmail, IsNumber } from 'class-validator'
import { RoleEnum } from 'src/common/enum/role.enum'
import { StatusEnum } from 'src/common/enum/status.enum'

export class UpdateUser {
  @IsString()
  @ApiProperty({
    example: 'BUTTER'
  })
  name: string

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: StatusEnum.ACTIVE
  })
  status: StatusEnum = StatusEnum.ACTIVE

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: RoleEnum.ADMIN
  })
  role: RoleEnum = RoleEnum.ADMIN
}
