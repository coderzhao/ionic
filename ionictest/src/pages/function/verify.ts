declare function readResData(data:any,id:any);
declare function dataURItoBlob(basestring:any);
declare function removeDiv();
declare function clearVerifyResult();
declare function upload1();
declare function upload2();
declare function disMiss(flag:any);
declare function errorVerifyResult();
declare function verifyResultClick(flag:any);
declare function verifyResponseClick();
import { Component } from '@angular/core';
import {ViewController,ToastController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {CROSS_URL} from "../../providers/Constants";
import {MY_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html'
})
export class VerifyPage {

  //assets/img/verify/left_img.png
  //assets/img/verify/right_img.png
  isChange: boolean = false;//头像是否改变标识
  firstPicturePath: string = 'data:image/jpeg;base64,' + IMG_BASE;
  secondPicturePath: string = 'data:image/jpeg;base64,' + IMG_BASE;
  imageBase64: string;//保存头像base64,用于上传

  constructor(private viewCtrl: ViewController,
              private toastCtrl:ToastController,
              private nativeService: NativeService,
              private http:Http) {
  }
  picture:Picture={
    firstUrl:"",
    secondUrl:""
  }

   //type:1拍照,0从图库选择
   //flag:1第一个图，2第二个图
  getPicture(type,flag) {
    let options = {
      targetWidth: 250,
      targetHeight: 250
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64,flag);
        disMiss(flag);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64,flag);
        disMiss(flag);
      });
    }
  }

  private getPictureSuccess(imageBase64,flag) {
    removeDiv();
    clearVerifyResult();
    this.isChange = true;
    this.imageBase64 = <string>imageBase64;
    if(flag == 1){
      this.firstPicturePath = 'data:image/jpeg;base64,' + imageBase64;
    }else if(flag == 2){
      this.secondPicturePath = 'data:image/jpeg;base64,' + imageBase64;
    }
    let formdata = new FormData();
    if(this.firstPicturePath.indexOf("data:image")==0){
      //base64 转换成二进制文件，封装到表单里进行提交
      let firstFileData =dataURItoBlob(this.firstPicturePath);
      formdata.append("photo1", firstFileData);
    }else{
      formdata.append("photo1", this.firstPicturePath);
    }
    if(this.secondPicturePath.indexOf("data:image")==0){
      //base64 转换成二进制文件，封装到表单里进行提交
      let secondFileData =dataURItoBlob(this.secondPicturePath);
      formdata.append("photo2", secondFileData);
    }else{
      formdata.append("photo2", this.secondPicturePath);
    }

    this.http.post(MY_URL + "customer/verify-face", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      let resultMessage=readResData(data,flag);
      verifyResultClick("result");
      // let toast = this.toastCtrl.create({
      //   message: resultMessage,
      //   duration: 3000
      // });
      // toast.present();
    },erorr=> {
      console.log(erorr);
      errorVerifyResult();
    });
  }

  checkUrl(flag){
    if(flag==1){
      if(this.picture.firstUrl==""){
        return false;
      }
    } else if(flag ==2){
        if(this.picture.secondUrl==""){
          return false;
        }
      }
      return true;
    }

  submitUrl(flag) {
    if(this.checkUrl(flag)){
      removeDiv();
      clearVerifyResult();
      let formdata = new FormData();
      if(flag==1){
        this.firstPicturePath=this.picture.firstUrl;
        formdata.append("photo1", this.picture.firstUrl);
        if(this.secondPicturePath.indexOf("data:image")==0){
          //base64 转换成二进制文件，封装到表单里进行提交
          let secondFileData =dataURItoBlob(this.secondPicturePath);
          formdata.append("photo2", secondFileData);
        }else{
          formdata.append("photo2", this.secondPicturePath);
        }
      }else if(flag==2){
        this.secondPicturePath=this.picture.secondUrl;
        formdata.append("photo2", this.picture.secondUrl);
        if(this.firstPicturePath.indexOf("data:image")==0){
          //base64 转换成二进制文件，封装到表单里进行提交
          let firstFileData =dataURItoBlob(this.firstPicturePath);
          formdata.append("photo1", firstFileData);
        }else{
          formdata.append("photo1", this.firstPicturePath);
        }
      }
      this.http.post(MY_URL + "customer/verify-face", formdata).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        let resultMessage=readResData(data,flag);
        verifyResultClick("result");
        // let toast = this.toastCtrl.create({
        //   message: resultMessage,
        //   duration: 3000
        // });
        // toast.present();
      },erorr=> {
        console.log(erorr);
        errorVerifyResult();
      });
    }else{
      let toast = this.toastCtrl.create({
        message: "请输入URL再进行检测！",
        duration: 2000
      });
      toast.present();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  click1(){
    upload1();
  }
  click2(){
    upload2()
  }
  //对比结果点击事件
  resultclick(){
    verifyResultClick("click");
  }

  //responseJson点击事件
  responseclick(){
    verifyResponseClick();
  }
}
export class Picture{
  firstUrl:string;
  secondUrl:string;
}






