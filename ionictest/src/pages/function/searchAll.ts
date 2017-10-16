declare function dataURItoBlob(basestring:any);
declare function handleSearchAllData(url:any,dataobj:any);
declare function clearSearchAllResult();
declare function upload1();
declare function disMiss(flag:any);
declare function searchResultClick(flag:any);
declare function searchResponseClick();
declare function getNumValue();
import { Component } from '@angular/core';
import {ViewController, ToastController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {MY_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';

@Component({
  selector: 'page-searchall',
  templateUrl: 'searchAll.html'
})
export class SearchAllPage {

  isChange: boolean = false;//头像是否改变标识
  picturePath: string = 'data:image/jpeg;base64,' + IMG_BASE;
  imageBase64: string;//保存头像base64,用于上传
  base64Img1:string = 'data:image/jpeg;base64,' + IMG_BASE;
  searchArray:Array<any>=[];//查找图库的数据集合
  Title:string="搜索结果";
  Result:string="";
  confidence:number=0.5;
  numValue:number=50;

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
        clearSearchAllResult();
        this.getPictureSuccess(imageBase64);
        disMiss(1);
      });
    } else {
      this.nativeService.getPictureByPhotoLibrary(options).then(imageBase64 => {
        clearSearchAllResult();
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
    let filedata =dataURItoBlob(this.picturePath);
    let formdata = new FormData();
    formdata.append("threshold",""+this.numValue/100);
    formdata.append("photo", filedata);
    formdata.append("mf_selector","all");
    this.http.post(MY_URL + "customer/getDemoAllFace", formdata).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      if(data==""){
        if(localStorage.logined=="true"){
          let toast = this.toastCtrl.create({
            //message: "在个人库中没有找到相关图片！",
            message: "在库中没有找到相关人脸信息！",
            duration: 2000
          });
          toast.present();
        }else{
          let toast = this.toastCtrl.create({
            //message: "在试用库中没有找到相关图片！",
            message: "在库中没有找到相关人脸信息！",
            duration: 2000
          });
          toast.present();
        }
      }else{
        if(localStorage.logined=="true"){
          //this.Title="个人图库搜索结果"
          this.Title="图库搜索结果"
        }else{
          //this.Title="试用图库搜索结果"
          this.Title="图库搜索结果"
        }
        let dataObj=eval(data);
        handleSearchAllData(this.picturePath,dataObj);
        searchResultClick("result");
      }
    },erorr=> {
      console.log(erorr);
      let toast = this.toastCtrl.create({
        message: "图片中未检测出人脸，请检查！",
        duration: 2000
      });
      toast.present();
      this.searchArray=[];
    });
  }

  submitUrl() {
    if(this.picture.Url==""){
      let toast = this.toastCtrl.create({
        message: "请输入URL再进行检测！",
        duration: 2000
      });
      toast.present();
    }else{
      clearSearchAllResult();
      this.searchArray=[];
      let formData = new FormData();
      formData.append("threshold",""+this.numValue/100);
      formData.append("photo", this.picture.Url);
      formData.append("mf_selector","all");
      //传递app端登录用户的用户名
      this.http.post(MY_URL + "customer/getDemoAllFace", formData).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        this.picturePath=this.picture.Url;
        if(data==""){
          if(localStorage.logined=="true"){
            let toast = this.toastCtrl.create({
              // message: "在个人库中没有找到相关图片！",
              message: "在库中没有找到相关人脸信息！",
              duration: 2000
            });
            toast.present();
          }else{
            let toast = this.toastCtrl.create({
              //message: "在试用库中没有找到相关图片！",
              message: "在库中没有找到相关人脸信息！",
              duration: 2000
            });
            toast.present();
          }
        }else{
          if(localStorage.logined=="true"){
            //this.Title="个人图库搜索结果"
            this.Title="图库搜索结果"
          }else{
            //this.Title="试用图库搜索结果"
            this.Title="图库搜索结果"
          }
          let dataObj=eval(data);
          handleSearchAllData(this.picturePath,dataObj);

          // this.searchArray=showSearchResult(dataObj);
          // searchResultClick("result");
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
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  click(){
    upload1();
  }
  //搜索结果点击事件
  resultclick(){
    searchResultClick("click");
  }

  //responseJson点击事件
  responseclick(){
    searchResponseClick();
  }

  valueChange(){
    let numValue=getNumValue();
    if(numValue=="error"){
      let toast = this.toastCtrl.create({
        message: "请输入范围在0~100之间的阀值！",
        duration: 2000
      });
      toast.present()
      this.numValue=50;
    }else{
      this.numValue=numValue;
    }
  }

}
export class Picture{
  Url:string;
}
