import { Component } from '@angular/core';
import { UserPage } from '../user/user';
import { FunctionPage } from '../function/function';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FunctionPage;
  tab3Root = UserPage;
  constructor() {

  }


}
