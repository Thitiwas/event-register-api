import { Op } from 'sequelize'
import { FindAllDto } from 'src/common/dto/findall.dto'
import { SeatStatusEnum } from 'src/common/enum/seat.enum'

export class GetSeatDto extends FindAllDto {
  buildCondition(eventID: number): any {
    return {
      eventID: {
        [Op.eq]: eventID
      },
      [Op.or]: [
        { firstname: { [Op.like]: `%${this.search}%` } },
        { surname: { [Op.like]: `%${this.search}%` } },
        { email: { [Op.like]: `%${this.search}%` } }
      ]
    }
  }
}
