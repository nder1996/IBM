import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainViewComponent } from './presentation/pages/main-view/main-view.component';
import { LoginComponent } from './presentation/components/login/login.component';
import { LoginFailedComponent } from './presentation/components/login-failed/login-failed.component';
import { WelcomeComponent } from './presentation/components/welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    LoginComponent,
    LoginFailedComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
