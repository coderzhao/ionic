import { Component } from '@angular/core';
import { NavController,LoadingController,ToastController,ModalController,ViewController} from 'ionic-angular';
import { CROSS_URL } from "../../providers/Constants";
import {RegisterPage} from '../register/register';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
@Component({
	selector:'login-page',
	templateUrl:'login.html'
})



export class LoginPage {
	constructor(public navCtrl:NavController,
		public LoadCtrl:LoadingController,
		private toastCtrl:ToastController,
		private modalCtrl:ModalController,
		private viewCtrl:ViewController,
    private http:Http
		){

	}
	userInfo:UserInfo={
		username:'',
		password:'',
		Url:'images/1.jpg'
	}

	// loadDefault(){
	// 	let loading = this.LoadCtrl.create({
	// 		content:"加载中...",
	// 		dismissOnPageChange:true,
	// 		showBackdrop:true,
	// 		cssClass:'danger'
	// 	});
	// 	loading.present();
	// 	setTimeout(()=>{
	// 	//验证密码是否为1，记录登录状态
	// 	  if(this.userInfo.password =="1"){
	// 		  localStorage.username = this.userInfo.username;
	// 			localStorage.logined = "true";
	// 			let data={
	// 			  handleFlag:"注销",
     //      color:"danger"
     //    }
	// 			this.viewCtrl.dismiss(data);
	// 			let toast = this.toastCtrl.create({
	// 								message: "登录成功！",
	// 								duration: 2000
	// 						});
	// 			toast.present();
	// 		}else{
	// 		 let toast = this.toastCtrl.create({
	// 							message: "密码不正确！",
	// 							duration: 2000
	// 					});
	// 		 toast.present();
	// 		}
	// 	},1000);
	// 	setTimeout(()=>{
	// 		loading.dismiss();
	// 	},1000);
	// }




  loadDefault(){
  	let loading = this.LoadCtrl.create({
  		content:"加载中...",
  		dismissOnPageChange:true,
  		showBackdrop:true,
  		cssClass:'danger'
  	});
  	loading.present();
  	setTimeout(()=>{
      //验证账号密码是否正确，记录登录状态
      this.http.get(CROSS_URL + "/customer/loginCheck?name=" + this.userInfo.username + "&password=" + this.userInfo.password).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        if(data){
          localStorage.logined =data;
          localStorage.username = this.userInfo.username;
          let msg={
            handleFlag:"注销",
            color:"danger"
          }
          this.viewCtrl.dismiss(msg);
          let toast = this.toastCtrl.create({
            message: "登录成功！",
            duration: 2000
          });
          toast.present();
        }
        else{
          let toast = this.toastCtrl.create({
            message: "密码不正确！",
            duration: 2000
          });
          toast.present();
        }
      },erorr=> {
        console.log(erorr);
        let toast = this.toastCtrl.create({
          message: "登录请求发生错误！",
          duration: 2000
        });
        toast.present();
      });},1000);
  	setTimeout(()=>{
  		loading.dismiss();
  	},1000);
  }


	login(){
		if(this.userInfo.username == "" ){
    let toast = this.toastCtrl.create({
              message: "您输入的用户名格式不正确！",
              duration: 2000
          });
          toast.present();
		} else if(this.userInfo.password == ""){
    let toast = this.toastCtrl.create({
              message: "您输入的密码不能为空！",
              duration: 2000
          });
          toast.present();
		}
		else {
      this.loadDefault();
		}
	}

	//login页面消失
	goBack(){
    let data={
       handleFlag:"登录",
        color:"primary"
    }
		this.viewCtrl.dismiss(data);
	}

	goToRegister(){
	let modal = this.modalCtrl.create(RegisterPage);
    modal.present();
	}

  forgetPassword(){
    let toast = this.toastCtrl.create({
      message: "重置密码模块need to do！",
      duration: 2000
    });
    toast.present();

  }
}

export class UserInfo{
  username:string;
  password:string;
  Url:string;
}


// this.http.get(CROSS_URL+"/customer/loginCheck?name="+this.userInfo.username+"&password="+this.userInfo.password).map(res =>
//   res.json()).subscribe(data => {
//   console.log(data);
//   let toast = this.toastCtrl.create({
//     message: data,
//     duration: 2000
//   });
//   toast.present();
// });