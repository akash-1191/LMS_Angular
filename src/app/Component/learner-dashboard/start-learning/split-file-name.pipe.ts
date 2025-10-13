import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'splitFileName' })
export class SplitFileNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const parts = value.split('/');
    return parts[parts.length - 1];
  }
}
