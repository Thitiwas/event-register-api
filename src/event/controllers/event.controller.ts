import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/auth/constants'
import { Roles } from 'src/auth/roles.decorator'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { RoleEnum } from 'src/common/enum/role.enum'
import { GetSeatDto } from '../dto/GetSeat.dto'
import { RegisterDto } from '../dto/Register.dto'
import { EventLogic } from '../logics/event.logic'

@ApiBearerAuth()
@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private eventLogic: EventLogic) {}

  @ApiOperation({
    description: 'User เลือกที่นั่งและกรอกข้อมูลลงทะเบียนเข้างาน'
  })
  @Public()
  @Post('/register')
  register(@Body() body: RegisterDto) {
    return this.eventLogic.register(body, RoleEnum.CUSTOMER)
  }

  @ApiOperation({
    description: 'แสดงรายการที่นั่งใน event ตาม event id ที่ระบุ'
  })
  @Public()
  @Get('/seat/:eventID')
  findSeatByEventID(
    @Param('eventID') eventID: number,
    @Query() query: GetSeatDto
  ) {
    return this.eventLogic.findALlSeatByEventID(Number(eventID), query)
  }

  @ApiOperation({
    description: 'แสดงรายละเอียดของ Event ตาม EventID ที่ระบุ'
  })
  @Public()
  @Get('/:eventID')
  findAllByEventID(@Param('eventID') eventID: number) {
    return this.eventLogic.findByEventID(Number(eventID))
  }

  @ApiOperation({
    description: 'แสดงรายการ Event ที่ออนไลน์มาแสดงแบบ Pagination'
  })
  @Public()
  @Get('/')
  find(@Query() query: PaginateDto) {
    return this.eventLogic.findEventPagination(query)
  }
}
