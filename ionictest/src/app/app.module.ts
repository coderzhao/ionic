import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';
import { DetectPage } from '../pages/function/detect';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { RegisterPage } from '../pages/register/register';
import { DetailPage } from '../pages/detail/detail';
import { FunctionPage } from '../pages/function/function';
import { VerifyPage } from '../pages/function/verify';
import { GalleryPage } from '../pages/function/gallery';
import { SearchPage } from '../pages/function/search';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {NativeService} from '../providers/NativeService';
import {HttpModule} from "@angular/http";
import {AppMinimize} from "@ionic-native/app-minimize";


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    UserPage,
    DetectPage,
    HomePage,
    TabsPage,
    RegisterPage,
    DetailPage,
    FunctionPage,
    VerifyPage,
    GalleryPage,
    SearchPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    UserPage,
    DetectPage,
    HomePage,
    TabsPage,
    RegisterPage,
    DetailPage,
    FunctionPage,
    VerifyPage,
    GalleryPage,
    SearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeService,
    AppMinimize
  ]
})
export class AppModule {}
