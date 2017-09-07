declare function handleData(url:any,data:any,flag:any);
declare function dataURItoBlob(basestring:any);
import {Component} from '@angular/core';
import {ViewController, ToastController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {CROSS_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-detect',
  templateUrl: 'detect.html'
})
export class DetectPage {

  isChange: boolean = false;//头像是否改变标识
  picturePath: string = './assets/img/1.png';//用户默认图片
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
        this.getPictureSuccess(imageBase64);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        this.getPictureSuccess(imageBase64);
      });
    }
  }

  // private getPictureSuccess(imageBase64) {
  //         this.isChange = true;
  //         this.imageBase64 = <string>imageBase64;
  //         this.picturePath = 'data:image/jpeg;base64,' + imageBase64;
  //       }
  private test(){
    this.imageBase64 = <string>IMG_BASE;
    this.picturePath = 'data:image/jpeg;base64,' + IMG_BASE;
    let formdata = new FormData();
    let filedata = dataURItoBlob(this.picturePath);
    formdata.append("photo", filedata);
    this.http.post(CROSS_URL + "customer/detect-face", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      handleData(this.picturePath,data,"detect");
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "获取图片失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  private getPictureSuccess(imageBase64) {
    this.isChange = true;
    this.imageBase64 = <string>imageBase64;
    this.picturePath = 'data:image/jpeg;base64,' + imageBase64;
    //base64 转换成二进制文件，封装到表单里进行提交
    let filedata =dataURItoBlob(this.picturePath);
    let formdata = new FormData();
    formdata.append("photo", filedata);
    this.http.post(CROSS_URL + "customer/detect-face", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      handleData(this.picturePath,data,"detect");
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "获取图片失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  submitUrl() {
    let formData = new FormData();
    formData.append("photo", this.picture.Url);
    this.http.post(CROSS_URL + "customer/detect-face", formData).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      handleData(this.picture.Url,data,"detect");
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "URL获取图片失败，请检查！",
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
  Url:string;
}
