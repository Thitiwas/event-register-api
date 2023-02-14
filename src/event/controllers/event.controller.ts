import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/auth/constants'
import { Roles } from 'src/auth/roles.decorator'
import { PaginateDto } from 'src/common/dto/pagination.dto'
import { CreateEventDto } from '../dto/CreateEvent.dto'
import { GetSeatDto } from '../dto/GetSeat.dto'
import { EventLogic } from '../logics/event.logic'

@ApiBearerAuth()
@ApiTags('event')
@Controller('event')
export class EventController {
  constructor(private eventLogic: EventLogic) {}

  @Roles('admin')
  @Post('/')
  createOne(@Body() body: CreateEventDto) {
    return this.eventLogic.create(body)
  }

  @Public()
  @Get('/seat/:eventID')
  findSeatByEventID(
    @Param('eventID') eventID: number,
    @Query() query: GetSeatDto
  ) {
    return this.eventLogic.findALlSeatByEventID(Number(eventID), query)
  }

  @Public()
  @Get('/:eventID')
  findAllByEventID(@Param('eventID') eventID: number) {
    return this.eventLogic.findByEventID(Number(eventID))
  }

  @Public()
  @Get('/')
  find(@Query() query: PaginateDto) {
    return this.eventLogic.findEventPagination(query)
  }
}
