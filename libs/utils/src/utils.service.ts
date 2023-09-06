import { Injectable } from '@nestjs/common';
@Injectable()
export class UtilsService {
  public generateErrorMessage(data: any): string {
    return Object.keys(data)
      .map((key) => `${key}: ${data[key]}`)
      .join('; ');
  }
  public isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }
}
