declare function handleData(url:any,data:any,flag:any);
declare function dataURItoBlob(basestring:any);
declare function upload1();
declare function getAttribute();
declare function attribute();
declare function disMiss(flag:any);
declare function clearDetectResult();
declare function detectResultClick(flag:any);
declare function detectResponseClick();
import {Component} from '@angular/core';
import {ViewController, ToastController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {CROSS_URL} from "../../providers/Constants";
import {MY_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';
import { PhotoViewer } from 'ionic-native';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-detect',
  templateUrl: 'detect.html'
})
export class DetectPage {

  isChange: boolean = false;//头像是否改变标识
  picturePath: string = 'data:image/jpeg;base64,' + IMG_BASE;
    // './assets/img/1.png';//用户默认图片
  imageBase64: string;//保存头像base64,用于上传

  constructor(private viewCtrl: ViewController,
              private toastCtrl: ToastController,
              private nativeService: NativeService,
              private http: Http) {
  }

  picture: Picture = {
    Url: ""
  }


  getPicture(type) {//1拍照,0从图库选择
    let options = {
      targetWidth: 400,
      targetHeight: 400
    };
    if (type == 1) {
      this.nativeService.getPictureByCamera(options).then(imageBase64 => {
        clearDetectResult();
        this.getPictureSuccess(imageBase64);
        disMiss(1);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        clearDetectResult();
        this.getPictureSuccess(imageBase64);
        disMiss(1);
      });
    }
  }


  private getPictureSuccess(imageBase64) {
    this.isChange = true;
    this.imageBase64 = <string>imageBase64;
    this.picturePath = 'data:image/jpeg;base64,' + imageBase64;
    //base64 转换成二进制文件，封装到表单里进行提交
    let fileData =dataURItoBlob(this.picturePath);
    let formData = new FormData();
    let attributeCheck =getAttribute();
    for(let inx in attributeCheck){
      formData.append(attributeCheck[inx],"true");
    }
    formData.append("photo", fileData);

    //this.http.post(CROSS_URL + "customer/detect-face", formdata).map(res =>
      this.http.post(MY_URL + "customer/detect-face", formData).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      clearDetectResult();
      if(data==""){
        let toast = this.toastCtrl.create({
          message: "图片中没有找到人脸！",
          duration: 2000
        });
        toast.present();
      }else{
        handleData(this.picturePath,data,"detect");
        detectResultClick("result");
      }
    },erorr=> {
      console.log(erorr);
        clearDetectResult();
      let toast = this.toastCtrl.create({
        message: "获取图片人脸失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  //URL提交图片路径
  submitUrl() {
    if(this.picture.Url==""){
      let toast = this.toastCtrl.create({
        message: "请输入URL再进行检测！",
        duration: 2000
      });
      toast.present();
    }else{
      let formData = new FormData();
      let attributeCheck =getAttribute();
      for(let inx in attributeCheck){
        formData.append(attributeCheck[inx],"true");
      }
      formData.append("photo", this.picture.Url);
      this.http.post(MY_URL + "customer/detect-face", formData).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        clearDetectResult();
        this.picturePath=this.picture.Url;
        if(data==""){
          let toast = this.toastCtrl.create({
            message: "图片中没有找到人脸！",
            duration: 2000
          });
          toast.present();
        }else{
          handleData(this.picturePath,data,"detect");
          detectResultClick("result");
        }
      },erorr=> {
        console.log(erorr);
        clearDetectResult();
        this.picturePath=this.picture.Url;
        let toast = this.toastCtrl.create({
          message: "获取图片人脸失败，请检查！",
          duration: 2000
        });
        toast.present();
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  //选择图片上传方式弹出窗
  click(){
    upload1();
  }

  //属性复选框点击事件
  checked(){
    attribute();
  }

  //属性结果点击事件
  resultclick(){
    detectResultClick("click");
  }

  //responseJson点击事件
  responseclick(){
    detectResponseClick();
  }
}
export class Picture{
  Url:string;
}





