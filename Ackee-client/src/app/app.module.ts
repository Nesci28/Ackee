import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule } from "ng2-charts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { HttpConfigInterceptor } from "./interceptors/http.interceptor";
import { LoginComponent } from "./login/login.component";
import { BaseComponent } from "./shared/base/base.component";
import { ViewsComponent } from "./views/views.component";
import { PagesComponent } from './pages/pages.component';
import { ReferrersComponent } from './referrers/referrers.component';
import { DurationsComponent } from './durations/durations.component';
import { LanguagesComponent } from './languages/languages.component';
import { LoadingInCardComponent } from './shared/loading-in-card/loading-in-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    BaseComponent,
    ViewsComponent,
    PagesComponent,
    ReferrersComponent,
    DurationsComponent,
    LanguagesComponent,
    LoadingInCardComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
