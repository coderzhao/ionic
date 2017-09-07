/**
  * Created by yanxiaojun617@163.com on 01-03.
  */
 import {Injectable} from '@angular/core';
 import {ToastController, LoadingController} from 'ionic-angular';
 import {Camera} from 'ionic-native';

 @Injectable()
 export class NativeService {
   private toast;
   private loading;

   constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController) {
   }

  //显示信息提示方法
   showToast = (message: string = 'success', duration: number = 2500) => {
     this.toast = this.toastCtrl.create({
       message: message,
       duration: duration,
       position: 'top',
       showCloseButton: true,
       closeButtonText: 'close'
     });
     this.toast.present();
   };

   /**
    * 关闭信息提示框
    */
   hideToast = () => {
     this.toast.dismissAll()
   };

  //显示loading
   showLoading = (content: string = '') => {
     this.loading = this.loadingCtrl.create({
       content: content
     });
     this.loading.present();
     setTimeout(() => {
       this.loading.dismiss();
     }, 20000);
   };

   /**
    * 关闭loading
    */
   hideLoading = () => {
     this.loading.dismissAll()
   };


  //使用cordova-plugin-camera获取照片的base64
   getPicture = (options) => {
     return new Promise((resolve, reject) => {
       Camera.getPicture(Object.assign({
         sourceType: Camera.PictureSourceType.CAMERA,
         destinationType: Camera.DestinationType.DATA_URL,
         quality: 90,
         allowEdit: true,
         encodingType: Camera.EncodingType.JPEG,
         targetWidth: 800,
         targetHeight: 800,
         saveToPhotoAlbum: false,
         correctOrientation: false
       }, options)).then((imageData) => {
         resolve(imageData);
       }, (err) => {
         console.log(err);
         err == 20 ? this.showToast('nopower') : reject(err);
       });
     });
   };

   //通过图库获取照片
   getPictureByPhotoLibrary = (options = {}) => {
     return new Promise((resolve) => {
       this.getPicture(Object.assign({
         sourceType: Camera.PictureSourceType.PHOTOLIBRARY
       }, options)).then(imageBase64 => {
         resolve(imageBase64);
       }).catch(err => {
         String(err).indexOf('cancel') != -1 ? this.showToast('cancelselect', 1500) : this.showToast('failtoget');
       });
     });
   };

  //通过相机获取照片
   getPictureByCamera = (options = {}) => {
     return new Promise((resolve) => {
       this.getPicture(Object.assign({
         sourceType: Camera.PictureSourceType.CAMERA
       }, options)).then(imageBase64 => {
         resolve(imageBase64);
       }).catch(err => {
         String(err).indexOf('cancel') != -1 ? this.showToast('cancelphoto', 1500) : this.showToast('failtoget');
       });
     });
   };

 }
