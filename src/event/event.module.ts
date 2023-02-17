import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EventController } from './controllers/event.controller'
import { Event } from 'src/models/events.model'
import { EventLogic } from './logics/event.logic'
import { EventDB } from './services/event.db'
import { Seat } from 'src/models/seat.model'
import { SeatDB } from './services/seat.db'

@Module({
  imports: [SequelizeModule.forFeature([Event, Seat])],
  controllers: [EventController],
  providers: [EventLogic, EventDB, SeatDB],
  exports: [EventDB, SeatDB]
})
export class EventModule {}
