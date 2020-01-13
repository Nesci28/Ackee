import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartsModule } from "ng2-charts";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { HttpConfigInterceptor } from "./constants/http.interceptor";
import { LoginComponent } from "./components/login/login.component";
import { BaseComponent } from "./components/shared/base/base.component";
import { ViewsOrDurationsComponent } from "./components/views-or-durations/views-or-durations.component";
import { PagesOrLanguagesComponent } from "./components/pages-or-languages/pages-or-languages.component";
import { OsesOrPlatformsComponent } from "./components/oses-or-platforms/oses-or-platforms.component";
import { LoadingInCardComponent } from "./components/shared/loading-in-card/loading-in-card.component";
import { SettingsComponent } from "./components/settings/settings.component";
import { DatePickerRangeComponent } from "./components/shared/date-picker-range/date-picker-range.component";
import { GraphBarComponent } from "./components/shared/graph-bar/graph-bar.component";
import { GraphPieComponent } from "./components/shared/graph-pie/graph-pie.component";
import { GraphTableComponent } from "./components/shared/graph-table/graph-table.component";
import { GraphBubbleComponent } from "./components/shared/graph-bubble/graph-bubble.component";
import { DatePickerComponent } from "./components/shared/date-picker/date-picker.component";
import { GraphLineComponent } from './components/shared/graph-line/graph-line.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    BaseComponent,
    ViewsOrDurationsComponent,
    PagesOrLanguagesComponent,
    OsesOrPlatformsComponent,
    LoadingInCardComponent,
    SettingsComponent,
    DatePickerRangeComponent,
    GraphBarComponent,
    GraphPieComponent,
    GraphTableComponent,
    GraphBubbleComponent,
    DatePickerComponent,
    GraphLineComponent
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
