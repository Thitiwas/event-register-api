import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/auth/constants'
import { Roles } from 'src/auth/roles.decorator'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { RoleEnum } from 'src/common/enum/role.enum'
import { CreateEventDto } from '../dto/CreateEvent.dto'
import { GetSeatDto } from '../dto/GetSeat.dto'
import { RegisterDto } from '../dto/Register.dto'
import { AdminEventLogic } from '../logics/admin.logic'

@ApiBearerAuth()
@ApiTags('/admin/event')
@Controller('/admin/event')
export class AdminEventController {
  constructor(private adminEventLogic: AdminEventLogic) {}

  @ApiOperation({ description: 'Admin สร้าง Event และที่นั่งตามจำนวนที่กำหนด' })
  @Roles('admin')
  @Post('/')
  createOne(@Body() body: CreateEventDto) {
    return this.adminEventLogic.create(body)
  }

  @ApiOperation({
    description: 'Admin เลือกที่นั่งและกรอกข้อมูลลงทะเบียนเข้างาน'
  })
  @Roles('admin')
  @Post('/register')
  register(@Body() body: RegisterDto) {
    return this.adminEventLogic.register(body, RoleEnum.CUSTOMER)
  }

  @ApiOperation({
    description: 'แสดงรายการที่นั่งใน event ตาม event id ที่ระบุ'
  })
  @Roles('admin')
  @Get('/seat/:eventID')
  findSeatByEventID(
    @Param('eventID') eventID: number,
    @Query() query: GetSeatDto
  ) {
    return this.adminEventLogic.findALlSeatByEventID(Number(eventID), query)
  }

  @ApiOperation({ description: 'แสดงรายการ Event ทั้งหมดมาแสดงแบบ Pagination' })
  @Roles('admin')
  @Get('/')
  find(@Query() query: PaginateDto) {
    return this.adminEventLogic.findEventPagination(query)
  }

  @ApiOperation({
    description: 'แสดงรายละเอียดของ Event ตาม EventID ที่ระบุ'
  })
  @Roles('admin')
  @Get('/:eventID')
  findByEventID(@Param('eventID') eventID: number) {
    return this.adminEventLogic.findByEventID(Number(eventID))
  }
}
