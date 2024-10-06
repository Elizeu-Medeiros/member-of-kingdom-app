import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class DatePipe implements PipeTransform {
  transform(value: Date | string | null, format: string = 'dd/MM/yyyy'): string {
    if (!value) return '';

    const date = typeof value === 'string' ? new Date(value) : value;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'dd/MM/yyyy':
        return `${day}/${month}/${year}`;
      case 'MM/dd/yyyy':
        return `${month}/${day}/${year}`;
      default:
        return `${day}/${month}/${year}`;
    }
  }
}
