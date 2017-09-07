declare function readResData(data:any,id:any);
declare function dataURItoBlob(basestring:any);
declare function removeDiv();
import { Component } from '@angular/core';
import {ViewController,ToastController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {CROSS_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-verify',
  templateUrl: 'verify.html'
})
export class VerifyPage {

  isChange: boolean = false;//头像是否改变标识
  firstPicturePath: string = 'data:image/jpeg;base64,' + IMG_BASE;//用户默认图片
  secondPicturePath: string = 'data:image/jpeg;base64,' + IMG_BASE;//用户默认图片
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
      targetWidth: 400,
      targetHeight: 400
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64,flag);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64,flag);
      });
    }
  }

  private getPictureSuccess(imageBase64,flag) {
    removeDiv();
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

    this.http.post(CROSS_URL + "customer/verify-face", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      readResData(data,flag);
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "获取图片失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  submitUrl(flag) {
    removeDiv();
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
    this.http.post(CROSS_URL + "customer/verify-face", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
        readResData(data,flag);
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "获取图片失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
export class Picture{
  firstUrl:string;
  secondUrl:string;
}






