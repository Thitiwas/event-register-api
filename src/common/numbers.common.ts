import { Injectable } from '@nestjs/common'

@Injectable()
export class NumbersCommon {
  constructor() {}
  decimalTruncate = (num: number, decimalPoints: number) => {
    return Math.trunc(num * 10 ** decimalPoints) / 10 ** decimalPoints
  }
  converThaiBathToSatang = (num: number) => {
    return num * 100
  }
  converSatangToThaiBath = (num: number) => {
    return num / 100
  }
  decimalTruncateAndConvertToSatang = (num: number) => {
    const truncated = this.decimalTruncate(num, 2)
    return truncated * 100
  }
  decimalConvertToBath = (num: number) => {
    return this.decimalTruncate(num / 100, 2)
  }
}
