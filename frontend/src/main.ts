import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './app/jwt-interceptor';



bootstrapApplication(AppComponent, {
  providers: [provideRouter(appRoutes), provideHttpClient(withInterceptors([jwtInterceptor])),
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: JwtInterceptor,
    //   multi: true
    // }
  ]
}).catch(console.error);
