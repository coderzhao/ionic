import { Component,ViewChild } from '@angular/core';
import { UserPage } from '../user/user';
import { FunctionPage } from '../function/function';
import { HomePage } from '../home/home';
import {Tabs} from "ionic-angular";
declare function divwidth();


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('mainTabs') tabs:Tabs;
  tab1Root = HomePage;
  tab2Root = FunctionPage;
  tab3Root = UserPage;
  constructor() {

  }

  functionClick(){
    divwidth();
  }
}
