import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
// import unidecode from 'unidecode'

@Injectable()
export class UtilsService {
  public generateErrorMessage(data: any): string {
    return Object.keys(data)
      .map(key => `${key}: ${data[key]}`)
      .join('; ')
  }

  public isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0
  }

  // public convertToSlug(str: string): string {
  //   return unidecode(str.toLowerCase()).replace(/\s+/g, '-').replace(/-+/g, '-')
  // }

  public convertToVietNamDate(date: Date): string {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  public isDateBetween(
    startDate: Date,
    endDate: Date,
    targetDate: Date,
  ): boolean {
    return targetDate >= startDate && targetDate <= endDate
  }

  public addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days)
    return date
  }
}
