import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, LoadingController, Loading, Events, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Keyboard } from '@ionic-native/keyboard';
import { ThemeProvider } from '../../providers/theme/theme';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  base64Image: string;
  professionalList: any;
  loader: Loading;
  noData: boolean;
  userProfile: any = {};
  modeOfCommunication: string[];
  profileForm: FormGroup;
  isDisabled: boolean = true;
  isFormInvalid: boolean = false;
  user_image: any;

  @ViewChild('ip') ip: any;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: GlobalProvider,
    public fb: FormBuilder,
    public keyboard: Keyboard,
    public theme: ThemeProvider,
    public loadingController: LoadingController,
    private events: Events,
    private alrtCtrl: AlertController,
    private camera: Camera,
    private diagnostic: Diagnostic,
  ) {
    this.initForm();
    this.getProfessionalList();

    this.events.subscribe('user-updated-menu', (data) => {
      this.global.cLog(`in user-updated-menu`, data);

      if (data.user_image) {
        this.global.cLog(`in if`);
        this.user_image = this.global.image_base_path + 'user/' + data.user_image;
        // this.user_image = this.global.sanatizeImage(false, 'user/' + data.user_image);
      }
    });

  }

  initForm() {
    this.profileForm = this.fb.group({
      name: [JSON.parse(localStorage.getItem('user')).name, [Validators.required]],
      email: [' ', [Validators.required, Validators.email]],
      address: [' ', [Validators.required]],
      modeOfCommunication: [['1']],
      professionalService: ['1', [Validators.required]],
      city_of_origin: [null],
    });

    this.userProfile["mobile_no"] = JSON.parse(localStorage.getItem('user')).mobileno;
  }

  ionViewDidLoad() {

    this.loader = this.loader = this.loadingController.create({
      content: 'Loading..',
      dismissOnPageChange: true
    });

    console.log('ionViewDidLoad ProfilePage');

    this.getProfileData();
    this.isDisabled = false;
    this.change();

    this.keyboard.onKeyboardHide().subscribe(
      res => {
        this.global.cLog(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });

    this.keyboard.onKeyboardShow().subscribe(
      res => {
        this.global.cLog(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });
  }

  edit() {
    this.global.cLog('edit clicked');
    this.isDisabled = !this.isDisabled;
  }

  submit() {
    this.global.cLog('submit clicked', this.profileForm);

    if (this.profileForm.valid) {
      this.isFormInvalid = false;
      this.global.cLog('form is valid');
      this.updateProfileData();
    } else {
      this.global.cLog('form is invalid');
      this.isFormInvalid = true;
    }
  }

  getProfileData() {
    this.loader.present();
    this.global.postRequest(this.global.base_path + 'Login/Profile', { login_user_id: JSON.parse(localStorage.getItem('user')).id })
      .subscribe(
        res => {
          this.global.cLog(`getProfileData's user data is `, res)
          this.loader.dismiss();
          if (res.success == 'true') {
            this.noData = false;
            this.userProfile = res.userprofile;
            this.setFormData();
          } else {
            this.noData = true;
            this.global.cLog(`${res.error}`);
          }
        }, err => {
          this.noData = true;
          this.loader.dismiss();
          this.global.cLog(`some error in getting user data`);
        });
  }

  setFormData() {
    this.profileForm.controls['name'].setValue(this.userProfile.name);
    this.profileForm.controls['email'].setValue(this.userProfile.email);
    this.profileForm.controls['address'].setValue(this.userProfile.address);
    this.profileForm.controls['modeOfCommunication'].setValue(this.userProfile.mode_of_communication);
    this.profileForm.controls['professionalService'].setValue(this.userProfile.professional_service_id);
    this.profileForm.controls['city_of_origin'].setValue(this.userProfile.city_of_origin);

    if (this.userProfile.user_image) {
      this.global.cLog('asdfasdfasdfa' + this.userProfile.user_image);
      // this.user_image = this.global.sanatizeImage(false, 'user/' + this.userProfile.user_image);
      this.user_image = this.global.image_base_path + 'user/' + this.userProfile.user_image;
    } else {
      this.user_image = `'../assets/icon/thumnail-image.png'`
    }
    this.userProfile["mobile_no"] = JSON.parse(localStorage.getItem('user')).mobileno;

    localStorage.setItem('profile-user', JSON.stringify(this.userProfile));
  }

  change() {
    this.global.cLog('this.ip is ', this.ip);
    let element = this.ip._elementRef.nativeElement;

    let textarea: HTMLElement = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight = '0';
    textarea.style.height = '0';

    // limit size to 96 pixels (6 lines of text)
    let scroll_height = textarea.scrollHeight;
    if (scroll_height > 96)
      scroll_height = 96;
    else
      scroll_height = 50;

    // apply new style
    element.style.height = scroll_height + "px";
    textarea.style.minHeight = scroll_height + "px";
    textarea.style.height = scroll_height + "px";
  }

  removePadding() {
    this.global.cLog(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.cLog(`'in keyboard hide res`, contentNative, foo);
    foo[0].style.paddingBottom = '0px';
  }

  updateProfileData() {
    let foo = this.navParams.get('data');

    let data = this.getUpdatedProfileDataToUpload();
    // this.global.showLoader();
    this.loader.present();
    this.global.postRequest(this.global.base_path + 'Login/EditProfile', data)
      .subscribe(res => {
        // this.global.hideLoader();
        this.loader.dismiss();
        if (res.success == 'true') {
          this.userProfile = res.user;
          this.setFormData();
          this.updateLocalStorage();
          this.global.showToast(`Successfully updated the profile`);
          if (foo && foo.fromLogin) {
            this.navCtrl.setRoot('MenuPage', { data: null });
          }
        } else {
          this.global.showToast(`${res.error}`);
        }
      }, err => {
        this.loader.dismiss();
        // this.global.hideLoader();
        this.global.showToast(`Some error in updating profile`);
      });

  }

  getUpdatedProfileDataToUpload() {
    let data = {
      login_user_id: JSON.parse(localStorage.getItem('user')).id,
      name: this.profileForm.controls['name'].value,
      email: this.profileForm.controls['email'].value,
      address: this.profileForm.controls['address'].value,
      mode_of_communication: this.profileForm.controls['modeOfCommunication'].value,
      city_of_origin: this.profileForm.controls['city_of_origin'].value,
      // user_image: this.base64Image,
      state: "1",
      city: "1",
      country: "1",
      pincode: "301001",
      professional_service_id: this.profileForm.controls['professionalService'].value
    }


    this.global.cLog(`data to be updated in profile api is`, data);

    return data;
  }

  updateLocalStorage() {
    let user = JSON.parse(localStorage.getItem('user'));
    user.name = this.profileForm.controls['name'].value;
    user.user_image = this.userProfile.user_image;

    localStorage.setItem('user', JSON.stringify(user));

    this.events.publish('user-updated', user);
  }

  getProfessionalList() {
    this.global.postRequest(this.global.base_path + 'Login/ProfessionList', {})
      .subscribe(
        res => {
          this.global.cLog(`getPRofessional data`, res);
          if (res.success == 'true') {
            this.professionalList = res.Profession;
          } else {
            this.global.cLog(`getPRofessional error`, res);
            this.global.showToast(res.error);
          }
        }, err => {
          this.global.cLog(`getPRofessional error`, err);
        });
  }

  choosePhoto() {
    let alert = this.alrtCtrl.create({
      title: `Profile Picture`,
      buttons: [
        {
          text: "Gallery",
          handler: () => {
            this.global.cLog(`Gallery choosed`);
            this.handleCameraPermission(this.camera.PictureSourceType.PHOTOLIBRARY || this.camera.PictureSourceType.SAVEDPHOTOALBUM);
          }
        },
        {
          text: "Camera",
          handler: () => {
            this.global.cLog(`Camera choosed`);
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
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.user_image = this.base64Image;
      this.global.cLog(`got the image`, this.base64Image);
      this.saveProfileImage(this.base64Image);
    }, (err) => {
      // Handle error
      this.global.cLog(`Some error in taking picture`, err);
    });
  }

  handleCameraPermission(type: number) {
    this.diagnostic.isCameraAuthorized().then(res => {
      this.global.cLog(`Got the isCameraAuthorized res `, res);
      if (res) {
        this.takePhoto(type);
      } else {
        this.diagnostic.requestCameraAuthorization().then(res => {
          this.global.cLog(`Got the requestCameraAuthorization res `, res);
          if (res) {
            this.takePhoto(type);
          } else {
            this.global.cLog(`App needs Camera Permission.`);
          }
        }).catch(err => {
          this.global.cLog(`Got the requestCameraAuthorization error `, err);
        });
      }
    }).catch(err => {
      this.global.cLog(`Got the isCameraAuthorized error`, err);
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
          this.global.cLog(`saveprofile data`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            this.user_image = this.global.image_base_path + 'user/' + res.Image;
            // this.user_image = this.global.sanatizeImage(false, 'user/' + res.Image);
            let user = JSON.parse(localStorage.getItem('user'));
            user.user_image = res.Image;
            localStorage.setItem('user', JSON.stringify(user));

            this.events.publish('user-updated', user);
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.cLog(`Some error in save profile image`);
        }
      )
  }

  filterEmoji(control: string, event: any) {
    this.global.cLog(`in filterEmoji with data`, control, this.profileForm.controls[control].value, event);

    let reg = new RegExp(/^[a-zA-Z ]*$/);
    
    // if (!((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode == 8 || event.keyCode == 32 || event.keyCode == 16) && (control == 'city_of_origin' || control == 'name')) {

    if (!(reg.test(this.profileForm.controls[control].value)) && (control == 'city_of_origin' || control == 'name')) {
      this.profileForm.controls[control].setValue(this.profileForm.controls[control].value.slice(0, -1));
      this.profileForm.controls[control].setValue(this.profileForm.controls[control].value.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, ''));
    } else {
      this.profileForm.controls[control].setValue(this.profileForm.controls[control].value.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, ''));
    }
  }

}