import { Component } from '@angular/core';
import { NavController,LoadingController,ModalController,ToastController } from 'ionic-angular';
import { DetectPage } from './detect';
import { VerifyPage } from './verify';
import {GalleryPage} from "./gallery";
import {SearchPage} from "./search";
declare function detectDivWidth();

@Component({
  selector: 'page-function',
  templateUrl: 'function.html'
})
export class FunctionPage {
  handleFlag="";
  color="";
  pictureOne: string = "assets/img/function/icon1.png";//用户默认图片1
  pictureTwo: string = "assets/img/function/icon3.png";//用户默认图片2
  pictureThree: string ="assets/img/function/icon2.png";//用户默认图片4
  pictureFour: string = "assets/img/function/icon4.png";//用户默认图片3

  constructor(public navCtrl: NavController,
              public LoadCtrl:LoadingController,
              public modalCtrl:ModalController,
              public toastCtrl:ToastController) {
  }



    itemClick(flag){
    if(flag =="1"){
      this.navCtrl.push(DetectPage);
    }else if(flag=="2"){
      this.navCtrl.push(VerifyPage);
    }else if(flag=="3"){
      this.navCtrl.push(SearchPage);
    }else if(flag=="4"){
      if(localStorage.logined=="true"){
        this.navCtrl.push(GalleryPage);
      }else{
        let toast = this.toastCtrl.create({
          message: "请先进行用户登录！",
          duration: 2000
        });
        toast.present();
      }

    }
  }

}
