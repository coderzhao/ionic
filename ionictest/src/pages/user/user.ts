import { Component } from '@angular/core';
import { NavController,LoadingController,ModalController,ToastController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DetailPage } from '../detail/detail';
import {MY_URL} from "../../providers/Constants";
import {Http} from '@angular/http';
@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})
export class UserPage {
    handleFlag="";
    color="";

  constructor(public navCtrl: NavController,
  public LoadCtrl:LoadingController,
  public modalCtrl:ModalController,
  public toastCtrl:ToastController,
  public http:Http) {
    if(localStorage.logined =="true"){
      this.handleFlag="注销";
      this.color="danger";
    }else{
      this.handleFlag="登录";
      this.color="selfColor";
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
    this.http.get(MY_URL + "customer/exit").subscribe(data => {
        localStorage.logined = "false";
        this.handleFlag="登录";
        this.color="selfColor";
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "注销失败，请检查！",
        duration: 2000
      });
      toast.present();
    });

  },1000);
  setTimeout(()=>{
    loading.dismiss();
  },1000);
  }else{
  //如果目前为未登录状态
  let modal = this.modalCtrl.create(LoginPage);
  modal.onDidDismiss(data => {
    this.handleFlag=data.handleFlag;
    if(data.handleFlag=="登录"){
      this.color="selfColor";
    }else{
      this.color=data.color;
    }
  })
    modal.present();
  }

  }
}
