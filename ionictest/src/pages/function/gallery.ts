import { Component } from '@angular/core';
import {ViewController,ToastController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";

@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html'
})
export class GalleryPage {

  isChange: boolean = false;//头像是否改变标识
  picturePath: string = './assets/img/1.png';//用户默认图片
  imageBase64: string;//保存头像base64,用于上传

  constructor(private viewCtrl: ViewController,
              private toastCtrl:ToastController,
              private nativeService: NativeService) {
  }
  picture:Picture={
    Url:""
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

  private getPictureSuccess(imageBase64) {
    this.isChange = true;
    this.imageBase64 = <string>imageBase64;
    this.picturePath = 'data:image/jpeg;base64,' + imageBase64;
  }

  submitPicture() {
    if (this.isChange) {
      console.log(this.imageBase64);//这是图片数据.
      this.nativeService.showLoading('正在上传....');
      let toast = this.toastCtrl.create({
        message: "上传成功！",
        duration: 2000
      });
      toast.present();
      //  this.viewCtrl.dismiss({picturePath: this.picturePath});//这里可以把图片传出去.
    } else {
      this.dismiss();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
export class Picture{
  Url:string;
}
