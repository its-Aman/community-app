import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, Menu, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  rootMenuPage: string = 'TabsPage';
  userDetails: any;
  user_image: any;

  @ViewChild(Menu) menu: Menu;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public app: App,
    private events: Events,
    private alrtCtrl: AlertController,
    private camera: Camera,
    private diagnostic: Diagnostic,
  ) {
    this.events.subscribe('user-updated', data => {
      this.global.log(`in user-updated event`, data);
      this.userDetails = data;
      if (this.userDetails.user_image) {
        this.global.log(`in if`);
        this.user_image = this.global.image_base_path + 'user/' + this.userDetails.user_image;
        // this.user_image = this.global.sanatizeImage(false, 'user/' + this.userDetails.user_image);
      } else {
        this.global.log(`in else`);
        this.user_image = `../assets/icon/sidebar-profile-photo.png`;
      }
    });

    this.events.subscribe(`setEventPage`, data => {
      this.global.hideLoader();
    })
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter MenuPage');

    this.userDetails = JSON.parse(localStorage.getItem('user'));
    //TODO: fix basepath it 
    if (this.userDetails.user_image) {
      this.user_image = this.global.image_base_path + 'user/' + this.userDetails.user_image;
      // this.user_image = this.global.sanatizeImage(false, 'user/' + this.userDetails.user_image);
    } else {
      this.user_image = `../assets/icon/sidebar-profile-photo.png`;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');

    this.events.subscribe('user-updated', data => {
      this.global.log(`in user-updated event`, data);
      this.userDetails = data;
      if (this.userDetails.user_image) {
        this.user_image = this.global.image_base_path + 'user/' + this.userDetails.user_image;
        // this.user_image = this.global.sanatizeImage(false, 'user/' + this.userDetails.user_image);
      } else {
        this.user_image = `../assets/icon/sidebar-profile-photo.png`;
      }
    });

    this.menu.ionOpen.subscribe(res => {
      this.global.log(`in ionOpen`, res, localStorage.getItem('user'));
      this.userDetails = JSON.parse(localStorage.getItem('user'));
      this.user_image = this.global.image_base_path + 'user/' + this.userDetails.user_image;
    });
  }

  vendorList() {
    this.global.log('vendorList');
    this.navCtrl.push('CommunityAppPage', { data: null })
  }

  promotionDiscount() {
    this.global.log('promotionDiscount');
    this.navCtrl.push('PromotionDiscountPage', { data: null })
  }

  aboutUs() {
    this.global.log('aboutUs');
    this.navCtrl.push('AboutPage', { data: null });
  }

  contactUs() {
    this.global.log('contactUs');
    this.navCtrl.push('ContactUsPage', { data: null });
  }

  setting() {
    this.global.log('setting');
    this.navCtrl.push('ChangePinPage');
  }

  privacyPolicy() {
    this.global.log('privacyPolicy');
    this.navCtrl.push('PrivacyPolicyPage', { data: null });
  }

  logout() {
    this.global.log('logout');
    let uuid = localStorage.getItem('uuid');
    localStorage.clear();
    this.navCtrl.setRoot('LoginPage', { signInData: true });
    localStorage.setItem('uuid', uuid);
  }

  editProfile() {
    this.global.log('editProfile');
    this.menu.close().then(res => {
      this.events.publish('select-edit-profile', 'profile');
    });
  }

  scanQRCode() {
    this.navCtrl.push('ScanQrCodePage', { data: null });
  }

  choosePhoto() {
    let alert = this.alrtCtrl.create({
      title: `Profile Picture`,
      buttons: [
        {
          text: "Gallery",
          handler: () => {
            this.global.log(`Gallery choosed`);
            this.handleCameraPermission(this.camera.PictureSourceType.PHOTOLIBRARY || this.camera.PictureSourceType.SAVEDPHOTOALBUM);
          }
        },
        {
          text: "Camera",
          handler: () => {
            this.global.log(`Camera choosed`);
            this.handleCameraPermission(this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    });

    alert.present();
  }

  takePhoto(type: number) {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: type,
      correctOrientation: true,
      saveToPhotoAlbum: true,
    }

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.global.log(`got the image`, base64Image);
      this.user_image = base64Image;
      this.saveProfileImage(base64Image);
    }, (err) => {
      // Handle error
      this.global.log(`Some error in taking picture`, err);
    });
  }

  handleCameraPermission(type: number) {
    this.diagnostic.isCameraAuthorized().then(res => {
      this.global.log(`Got the isCameraAuthorized res `, res);
      if (res) {
        this.takePhoto(type);
      } else {
        this.diagnostic.requestCameraAuthorization().then(res => {
          this.global.log(`Got the requestCameraAuthorization res `, res);
          if (res) {
            this.takePhoto(type);
          } else {
            this.global.log(`App needs Camera Permission.`);
          }
        }).catch(err => {
          this.global.log(`Got the requestCameraAuthorization error `, err);
        });
      }
    }).catch(err => {
      this.global.log(`Got the isCameraAuthorized error`, err);
    });
  }

  saveProfileImage(image: string) {
    let data = {
      login_user_id: JSON.parse(localStorage.getItem('user')).id,
      user_image: image,
    };

    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/SaveImage', data)
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`saveprofile data`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            this.user_image = this.global.image_base_path + 'user/' + res.Image;
            // this.user_image = this.global.sanatizeImage(false, 'user/' + res.Image);
            let user = JSON.parse(localStorage.getItem('user'));
            user.user_image = res.Image;
            localStorage.setItem('user', JSON.stringify(user));
            this.events.publish('user-updated-menu', user);
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`Some error in save profile image`);
        }
      )
  }

}
