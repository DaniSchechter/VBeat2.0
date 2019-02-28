import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class CookieInterceptor implements HttpInterceptor {

    constructor() {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(request.url.indexOf("maps.googleapis.com") != -1) {
          return next.handle(request);
        }
        request = request.clone({
            withCredentials: true
        });
        return next.handle(request);
    }
}
