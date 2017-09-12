declare function handleData(url:any,data:any,flag:any);
declare function dataURItoBlob(basestring:any);
declare function showResult(dataobj:any);
import { Component } from '@angular/core';
import {ViewController, ToastController, List} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {CROSS_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';
import { PhotoViewer } from 'ionic-native';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  isChange: boolean = false;//头像是否改变标识
  picturePath: string = './assets/img/1.png';//用户默认图片
  imageBase64: string;//保存头像base64,用于上传
  base64Img1:string = 'data:image/jpeg;base64,' + IMG_BASE;
  searchArray:Array<any>=[];//查找图库的数据集合
  Title:string="";
  Result:string="";

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
    this.http.post(CROSS_URL + "customer/getDemoFace", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      if(data==""){
        let toast = this.toastCtrl.create({
          message: "没有找到相关图片！",
          duration: 2000
        });
        toast.present();
      }else{
        let dataObj=eval(data.results);
        this.Title="在图库中的查找相似结果 ："
        this.searchArray=showResult(dataObj);
      }
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "人脸搜索失败，请检查！",
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
    this.http.post(CROSS_URL + "customer/getDemoFace", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      if(data==""){
        let toast = this.toastCtrl.create({
          message: "没有找到相关图片！",
          duration: 2000
        });
        toast.present();
      }else{
        let dataObj=eval(data.results);
        this.Title="在图库中的查找相似结果 ："
        this.searchArray=showResult(dataObj);
      }
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "人脸搜索失败，请检查！",
        duration: 2000
      });
      toast.present();
    });
  }

  submitUrl() {
    this.searchArray=[];
    this.Title="";
    let formData = new FormData();
    formData.append("n","4");
    formData.append("photo", this.picture.Url);
    //传递app端登录用户的用户名
    this.http.post(CROSS_URL + "customer/getDemoFace", formData).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      this.picturePath=this.picture.Url;
      if(data==""){
        let toast = this.toastCtrl.create({
          message: "没有找到相关图片！",
          duration: 2000
        });
        toast.present();
      }else{
        let dataObj=eval(data.results);
        this.Title="在图库中的查找相似结果 ："
        this.searchArray=showResult(dataObj);
      }
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "获取图片人脸失败，请检查！",
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
