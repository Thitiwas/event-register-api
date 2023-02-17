import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AdminEventController } from './controllers/event.controller'
import { Event } from 'src/models/events.model'
import { AdminEventLogic } from './logics/admin.logic'
import { EventDB } from '../event/services/event.db'
import { Seat } from 'src/models/seat.model'
import { SeatDB } from '../event/services/seat.db'

@Module({
  imports: [SequelizeModule.forFeature([Event, Seat])],
  controllers: [AdminEventController],
  providers: [AdminEventLogic, EventDB, SeatDB],
  exports: []
})
export class AdminModule {}
