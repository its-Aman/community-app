import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GlobalProvider } from '../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-scan-qr-code',
  templateUrl: 'scan-qr-code.html',
})
export class ScanQrCodePage {

  scanResult: any; //1FBEB142-843E-495F-A8E2-E59F0BE3162A
  @ViewChild('content') content: Content

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    private global: GlobalProvider,
    private diagnostic: Diagnostic,
  ) {
  }

  ionViewDidLoad() {
    this.global.log('ionViewDidEnter ScanQrCodePage');
  }

  ionViewDidEnter() {
    this.global.log('ionViewDidLoad ScanQrCodePage', this.content.getNativeElement());
    this.diagnostic.isCameraAuthorized().then(res => {
      this.global.log(`Got the isCameraAuthorized res `, res);
      if (res) {
        this.finalScan();
      } else {
        this.diagnostic.requestCameraAuthorization().then(res => {
          this.global.log(`Got the requestCameraAuthorization res `, res);
          if (res) {
            this.finalScan();
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

  finalScan() {
    this.qrScanner.prepare().then((res: QRScannerStatus) => {
      this.global.log('prepare status is ', res);
      this.scanQR_Code().then(res => {
        this.global.log('scanQR_Code in finalScan', res);
        //API hit
        if (res) {
          this.verifyQRCode(res);
        } else {
          this.global.showToast(`QR-Code not scanned`);
        }
      });
    }).catch(err => {
      this.global.log("some error in prepare", err);
      if (err.code == 1) {
        this.global.showToast(`The app needs the camera to scan QR codes`);
      }
    });
  }

  async scanQR_Code(): Promise<string> {
    try {
      this.global.log('in scanPatient try');
      this.scanResult = await this._startScanner();
      this.global.log('scanResult is ', this.scanResult);
    }
    catch (err) {
      this.global.log('in scanPatient catch', err);
      throw err;
    }
    return this.scanResult;
  }

  private _startScanner(): Promise<any> {
    this.global.log('in _startScanner');
    // Optionally request the permission early
    return this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        this.global.log('in _startScanner prepare', status);

        let nowTimeHours = new Date().getHours();
        if (nowTimeHours > 18 && nowTimeHours < 5) {
          try {
            status.lightEnabled
              ?
              this.qrScanner.enableLight()
              :
              this.qrScanner.disableLight();
          } catch (e) { }
        }

        return new Promise((resolve, reject) => {
          if (status.authorized) {
            // camera permission was granted

            const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];
            const _content = this.content.getNativeElement();
            // start scanning
            let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              this.global.log('in _startScanner prepare->promise->scan', status);
              this.qrScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning

              // hack to hide the app and show the preview
              ionApp.style.display = "block";
              _content.style.display = "block";

              resolve(text);
            });

            // show camera preview
            _content.style.display = "contents";
            ionApp.style.display = "contents";
            this.qrScanner.show();
          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            this.qrScanner.openSettings();
            reject(new Error('MESSAGES.QRSCANNER.CHANGE_SETTINGS_ERROR'));
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            reject(new Error('MESSAGES.QRSCANNER.PERMISSION_DENIED_ERROR'));
          }
        });
      });
  }

  submit(i: number) {
    this.global.log(`submit clicked`, i);
  }

  verifyQRCode(id: any) {
    this.global.showLoader();
    this.global.postRequest(this.global.base_path + 'Login/Qrcoderead', { id: id })
      .subscribe(
        res => {
          this.global.hideLoader();
          this.global.log(`verify qrcode response`, res);
          if (res.success == 'true') {
            this.global.showToast(`${res.message}`);
            setTimeout(() => {
              this.navCtrl.popToRoot();
            }, 500);
          } else {
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.global.hideLoader();
          this.global.log(`Some error in api`, err);
        }
      )
  }
}
