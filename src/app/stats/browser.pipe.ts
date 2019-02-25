import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'browserdatacustom'
})
export class BrowserPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log('transofrming data');
    // value is browser data
    return `Top Browsers: Chrome: ${value.Chrome}, Firefox: ${value.Firefox}, Edge: ${value.Edge}`;
  }
}
