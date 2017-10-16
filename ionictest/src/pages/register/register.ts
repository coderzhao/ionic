import {Component} from '@angular/core';
import {MY_URL} from "../../providers/Constants";
import {NavController,ViewController,ToastController,LoadingController} from 'ionic-angular';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
@Component(
{
	selector:"register-page",
	templateUrl:"register.html"
})

export class RegisterPage{
	constructor(private navCtrl:NavController,
	private toastCtrl:ToastController,
	public LoadCtrl:LoadingController,
	private viewCtrl:ViewController,
  private http:Http){

	}

	userInfo:UserInfo={
		username:'',
		password:'',
		againPassword:'',
		email:''
	}

	goBack(){
		this.viewCtrl.dismiss();
	}

	checkUserName(){
    if(this.userInfo.username !=""){
      this.http.get(MY_URL + "/customer/check?userName=" + this.userInfo.username).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        if (data) {
          let toast = this.toastCtrl.create({
            message: "用户名已经存在！",
            duration: 2000
          });
          toast.present();
        }
        else {
          this.register();
        }
      });
    }
  }

	register(){
    if (this.userInfo.username == "") {
      let toast = this.toastCtrl.create({
        message: "您输入的用户名格式不能为空！",
        duration: 2000
      });
      toast.present();
    } else if(this.userInfo.email == ""){
		let toast = this.toastCtrl.create({
							message: "您输入的邮箱不能为空！",
							duration: 2000
					});
					toast.present();
		}else if(this.userInfo.password == ""){
		let toast = this.toastCtrl.create({
							message: "您输入的密码不能为空！",
							duration: 2000
					});
					toast.present();
		}else if(this.userInfo.password.length< 6){
      let toast = this.toastCtrl.create({
        message: "密码长度必须大于6位！",
        duration: 2000
      });
      toast.present();
    }else if(this.userInfo.againPassword == ""){
		let toast = this.toastCtrl.create({
							message: "您输入的确认密码不能为空！",
							duration: 2000
					});
					toast.present();
		}else if(this.userInfo.password != this.userInfo.againPassword){
		let toast = this.toastCtrl.create({
							message: "您输入的两次密码不一致！",
							duration: 2000
					});
					toast.present();
		}else if(!/^([a-zA-Z0-9_]{6,20})$/.test(this.userInfo.username)){
      let toast = this.toastCtrl.create({
        message: "用户名由6位以上数字、字母或下划线组成!",
        duration: 2000
      });
      toast.present();
    }else if(!/.+@.+\.[a-zA-Z]{2,4}$/.test(this.userInfo.email)){
      let toast = this.toastCtrl.create({
        message: "请输入正确的E-Mail地址!",
        duration: 2000
      });
      toast.present();
    } else {
			this.loadDefault();
		}
	}

	loadDefault(){
		let loading = this.LoadCtrl.create({
			content:"注册中...",
			dismissOnPageChange:true,
			showBackdrop:true,
			cssClass:'danger'
		});
		loading.present();
		setTimeout(()=>{
      this.http.get(MY_URL + "/customer/appCommitReg?name=" + this.userInfo.username + "&password=" + this.userInfo.password
      +"&email="+this.userInfo.email).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        if(data) {
          let toast = this.toastCtrl.create({
            message: "注册成功，请登录",
            duration: 3000
          });
          toast.present();
          this.navCtrl.pop(RegisterPage);
        }else{
          let toast = this.toastCtrl.create({
            message: "注册失败！",
            duration: 2000
          });
          toast.present();
        }
      },erorr=> {
        console.log(erorr);
        let toast = this.toastCtrl.create({
          message: "注册请求发生错误！",
          duration: 2000
        });
        toast.present();
      });},1000);
    setTimeout(()=>{
      loading.dismiss();
    },1000);
  }
}

export class UserInfo{
	username:string;
	password:string;
	email:string;
	againPassword:string;
}
