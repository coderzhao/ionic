declare function readResDataCol(data:any);
declare function dataURItoBlob(basestring:any);
declare function removeBeforeDiv();
declare function clearVerifyResult();
declare function upload1();
declare function upload2();
declare function disMiss(flag:any);
declare function errorVerifyResult();
declare function setSearchResultClick(flag:any);
declare function verifyResponseClick();
declare function getNumValue();
import { Component } from '@angular/core';
import {ViewController,ToastController} from 'ionic-angular';
import {NativeService} from "../../providers/NativeService";
import {GROUP_IMG} from "../../providers/Pictrue";
import {MY_URL} from "../../providers/Constants";
import {IMG_BASE} from "../../providers/Constants";
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-setSearch',
  templateUrl: 'setSearch.html'
})
export class SetSearchPage {

  isChange: boolean = false;//头像是否改变标识
  firstPicturePath: string = 'data:image/jpeg;base64,' + IMG_BASE;
  secondPicturePath: string = 'data:image/jpeg;base64,' + GROUP_IMG;
  //secondPicturePath: string = 'http://yun.anytec.cn:8080/img/index/two/group5.png';
  imageBase64: string;//保存头像base64,用于上传
  numValue:number=70;

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
    removeBeforeDiv();
    clearVerifyResult();
    this.isChange = true;
    this.imageBase64 = <string>imageBase64;
    if(flag == 1){
      this.firstPicturePath = 'data:image/jpeg;base64,' + imageBase64;
    }else if(flag == 2){
      this.secondPicturePath = 'data:image/jpeg;base64,' + imageBase64;
    }
    let formdatacheck =new FormData();
    let formdata = new FormData();
    formdata.append("threshold",""+this.numValue/100);
    if(this.firstPicturePath.indexOf("data:image")==0){
      //base64 转换成二进制文件，封装到表单里进行提交
      let firstFileData =dataURItoBlob(this.firstPicturePath);
      formdata.append("photo1", firstFileData);
      formdatacheck.append("photo",firstFileData);
    }else{
      formdata.append("photo1", this.firstPicturePath);
      formdatacheck.append("photo",this.firstPicturePath);
    }
    if(this.secondPicturePath.indexOf("data:image")==0){
      //base64 转换成二进制文件，封装到表单里进行提交
      let secondFileData =dataURItoBlob(this.secondPicturePath);
      formdata.append("photo2", secondFileData);
    }else{
      formdata.append("photo2", this.secondPicturePath);
    }

    this.http.post(MY_URL + "customer/faceNumber", formdatacheck).map(res =>
      res.json()).subscribe(data => {
      console.log(data);
      if(data==1){
        formdata.append("mf_selector", "all");
        this.http.post(MY_URL + "customer/verify-face", formdata).map(res =>
          res.json()).subscribe(data => {
          console.log(data);
          readResDataCol(data);
          //let resultMessage=readResDataCol(data);
          setSearchResultClick("result");
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
        clearVerifyResult();
        let toast = this.toastCtrl.create({
          message: "左侧框的人脸数不是1,请确保左侧人脸数只有一张",
          duration: 2000
        });
        toast.present();
      }
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
      removeBeforeDiv();
      clearVerifyResult();
      let formdatacheck =new FormData();
      let formdata = new FormData();
      formdata.append("threshold",""+this.numValue/100);
      if(flag==1){
        this.firstPicturePath=this.picture.firstUrl;
        formdata.append("photo1", this.picture.firstUrl);
        formdatacheck.append("photo", this.picture.firstUrl);
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
          formdatacheck.append("photo", firstFileData);
        }else{
          formdatacheck.append("photo", this.firstPicturePath);
        }
      }
      this.http.post(MY_URL + "customer/faceNumber", formdatacheck).map(res =>
        res.json()).subscribe(data => {
        console.log(data);
        if(data==1){
          formdata.append("mf_selector", "all");
          this.http.post(MY_URL + "customer/verify-face", formdata).map(res =>
            res.json()).subscribe(data => {
            console.log(data);
            readResDataCol(data);
            //let resultMessage=readResDataCol(data);
            setSearchResultClick("result");
          },erorr=> {
            console.log(erorr);
            errorVerifyResult();
          });
        }else{
          clearVerifyResult();
          let toast = this.toastCtrl.create({
            message: "左侧框的人脸数不是1,请确保左侧人脸数只有一张",
            duration: 2000
          });
          toast.present();
        }
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
    setSearchResultClick("click");
  }

  //responseJson点击事件
  responseclick(){
    verifyResponseClick();
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
  firstUrl:string;
  secondUrl:string;
}






