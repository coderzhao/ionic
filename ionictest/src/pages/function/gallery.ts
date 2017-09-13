declare function handleData(url:any,data:any,flag:any);
declare function dataURItoBlob(basestring:any);
declare function showResult(dataobj:any);
import { Component } from '@angular/core';
import {ViewController, ToastController, List} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {CROSS_URL} from "../../providers/Constants";
import {MY_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';
import { PhotoViewer } from 'ionic-native';

@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html'
})
export class GalleryPage {

  isChange: boolean = false;//头像是否改变标识
  picturePath: string = './assets/img/1.png';//用户默认图片
  imageBase64: string;//保存头像base64,用于上传
  base64Img1:string = 'data:image/jpeg;base64,' + IMG_BASE;
  searchArray:Array<any>=[];//查找图库的数据集合
  galleryArray:Array<any>=[];//我的图库数据集合
  Title:string="";

  constructor(private viewCtrl: ViewController,
              private toastCtrl:ToastController,
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
    this.http.post(MY_URL + "customer/detect-face", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      if(data==""){
        let toast = this.toastCtrl.create({
          message: "图片中没有找到人脸！",
          duration: 2000
        });
        toast.present();
      }else{
        handleData(this.picturePath,data,"detect");
      }
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
    this.http.post(MY_URL + "customer/addToGallery", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      this.galleryArray =data;
        let toast = this.toastCtrl.create({
          message: "添加人脸成功！",
          duration: 2000
        });
        toast.present();
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "添加人脸失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  submitUrl() {
    this.galleryArray=[];
    this.Title="";
    let formData = new FormData();
    formData.append("photo", this.picture.Url);
    //传递app端登录用户的用户名
    this.http.post(MY_URL + "customer/addToGallery", formData).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      this.picturePath=this.picture.Url;
      this.Title="我的图库 ：";
      this.galleryArray =data;
        let toast = this.toastCtrl.create({
          message: "添加人脸成功！",
          duration: 2000
        });
        toast.present();
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "添加人脸失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  getMyGallery(){
    this.searchArray=[];
    this.Title="";
    this.http.get(MY_URL + "customer/getMyGallery").map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      this.Title="我的图库 ：";
      this.galleryArray =data;
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "获取图库失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  deleteMyGallery($event){
    if(confirm("是否删除该图片？")){
      console.log($event.target.alt);
      this.http.get(MY_URL + "customer/deleteToGallery?id="+$event.target.alt).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        this.galleryArray =data;
      },erorr=> {
        console.log(erorr);
        let toast = this.toastCtrl.create({
          message: "删除人脸失败，请检查！",
          duration: 2000
        });
        toast.present();
      });
    }
  }

}
export class Picture{
  Url:string;
}
