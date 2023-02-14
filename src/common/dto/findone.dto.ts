import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class FindOneDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly sortBy: string = 'createdAt'

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly sortOrder: 'ASC' | 'DESC' = 'DESC'

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly search: string = ''

  buildOptionalQuery() {
    return {
      order: [[this.sortBy, this.sortOrder ? this.sortOrder : 'DESC']]
    }
  }
}