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
        this.global.log(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });

    this.keyboard.onKeyboardShow().subscribe(
      res => {
        this.global.log(`in onKeyboardHide`, res);
        this.removePadding();
      }, err => {
        this.removePadding();
      });
  }

  edit() {
    this.global.log('edit clicked');
    this.isDisabled = !this.isDisabled;
  }

  submit() {
    this.global.log('submit clicked', this.profileForm);

    if (this.profileForm.valid) {
      this.isFormInvalid = false;
      this.global.log('form is valid');
      this.updateProfileData();
    } else {
      this.global.log('form is invalid');
      this.isFormInvalid = true;
    }
  }

  getProfileData() {
    this.loader.present();
    this.global.postRequest(this.global.base_path + 'Login/Profile', { login_user_id: JSON.parse(localStorage.getItem('user')).id })
      .subscribe(
        res => {
          this.global.log(`getProfileData's user data is `, res)
          this.loader.dismiss();
          if (res.success == 'true') {
            this.noData = false;
            this.userProfile = res.userprofile;
            this.setFormData();
          } else {
            this.noData = true;
            this.global.log(`${res.error}`);
          }
        }, err => {
          this.noData = true;
          this.loader.dismiss();
          this.global.log(`some error in getting user data`);
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
      this.global.log('asdfasdfasdfa' + this.userProfile.user_image);
      this.userProfile.user_image = this.global.sanatizeImage(false, 'user/' + this.userProfile.user_image);
    } else {
      this.userProfile.user_image = `'../assets/icon/thumnail-image.png'`
    }
    this.userProfile["mobile_no"] = JSON.parse(localStorage.getItem('user')).mobileno;

    localStorage.setItem('profile-user', JSON.stringify(this.userProfile));
  }

  change() {
    this.global.log('this.ip is ', this.ip);
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
    this.global.log(`in removePadding`);

    let contentNative: HTMLElement = this.content.getNativeElement();
    let foo: any = contentNative.getElementsByClassName('scroll-content');

    this.global.log(`'in keyboard hide res`, contentNative, foo);
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
      user_image: this.base64Image,
      state: "1",
      city: "1",
      country: "1",
      pincode: "301001",
      professional_service_id: this.profileForm.controls['professionalService'].value
    }


    this.global.log(`data to be updated in profile api is`, data);

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
          this.global.log(`getPRofessional data`, res);
          if (res.success == 'true') {
            this.professionalList = res.Profession;
          } else {
            this.global.log(`getPRofessional error`, res);
            this.global.showToast(res.error);
          }
        }, err => {
          this.global.log(`getPRofessional error`, err);
        });
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
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.userProfile.user_image = this.base64Image;
      this.global.log(`got the image`, this.base64Image);
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
}