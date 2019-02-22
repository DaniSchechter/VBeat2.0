import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'browser'
})
export class BrowserPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
