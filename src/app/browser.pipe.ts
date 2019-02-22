import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'browser'
})
export class BrowserPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // value is browser data
    return `Chrome: ${value.Chrome}<br>Firefox: ${value.Firefox}<br>Edge${value.Edge}<br>`;

  }
}
