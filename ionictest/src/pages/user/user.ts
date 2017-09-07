import { Component } from '@angular/core';
import { NavController,LoadingController,ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DetailPage } from '../detail/detail';
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
    handleFlag="";
    color="";

  constructor(public navCtrl: NavController,
  public LoadCtrl:LoadingController,
  public modalCtrl:ModalController) {
    if(localStorage.logined =="true"){
      this.handleFlag="注销";
      this.color="danger";
    }else{
      this.handleFlag="登录";
      this.color="primary";
    }
  }

  itemClick(flag){
  if(flag !=""){
    this.navCtrl.push(DetailPage);
  }
  }

  operate(){
  //如果目前为登录状态
  if(localStorage.logined =="true"){
  let loading = this.LoadCtrl.create({
    content:"注销中...",
    dismissOnPageChange:true,
    showBackdrop:true,
    cssClass:'danger'
  });
  loading.present();
  setTimeout(()=>{
    localStorage.logined = "false";
    this.handleFlag="登录";
    this.color="primary";
  },1000);
  setTimeout(()=>{
    loading.dismiss();
  },1000);
  }else{
  //如果目前为未登录状态
  let modal = this.modalCtrl.create(LoginPage);
  modal.onDidDismiss(data => {
    this.handleFlag=data.handleFlag;
    this.color=data.color;
  })
    modal.present();
  }

  }
}
