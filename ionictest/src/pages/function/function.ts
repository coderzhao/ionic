import { Component } from '@angular/core';
import { NavController,LoadingController,ModalController } from 'ionic-angular';
import { DetectPage } from './detect';
import { VerifyPage } from './verify';
import {GalleryPage} from "./gallery";
@Component({
  selector: 'page-function',
  templateUrl: 'function.html'
})
export class FunctionPage {
  handleFlag="";
  color="";

  constructor(public navCtrl: NavController,
              public LoadCtrl:LoadingController,
              public modalCtrl:ModalController) {
  }

  itemClick(flag){
    if(flag =="1"){
      this.navCtrl.push(DetectPage);
    }else if(flag=="2"){
      this.navCtrl.push(VerifyPage);
    }else if(flag="3"){
      this.navCtrl.push(GalleryPage);
    }
  }

}
