import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuditInterceptorService implements HttpInterceptor {
  constructor() {}

  public intercept( req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   const started = Date.now();
   return next.handle(req).pipe(
     filter((event: HttpEvent<any>) => event instanceof HttpResponse),
     tap((resp: HttpResponse<any>) => this.auditEvent(resp, started))
   );
  }
  private auditEvent(resp: HttpResponse<any>, started: number) {
    const elapseMs = Date.now() - started;
    const eventMessage = resp.statusText + ' on ' + resp.url;
    const message = eventMessage + ' in ' + elapseMs + ' ms';
    console.log(message);
  }
}

