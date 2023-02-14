import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class PaginateDto {
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

  @IsNumberString()
  @IsOptional()
  @ApiPropertyOptional()
  readonly page: string = '1'

  @IsOptional()
  @IsNumberString()
  @ApiPropertyOptional()
  readonly limit: string = '25'

  buildOptionalQuery() {
    return {
      order: [[this.sortBy, this.sortOrder ? this.sortOrder : 'DESC']],
      limit: Number(this.limit),
      offset: (Number(this.page) - 1) * Number(this.limit)
    }
  }
}
