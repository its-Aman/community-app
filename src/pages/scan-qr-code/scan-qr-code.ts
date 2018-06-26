import { ThemeProvider } from './../../providers/theme/theme';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GlobalProvider } from '../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-scan-qr-code',
  templateUrl: 'scan-qr-code.html',
})
export class ScanQrCodePage {

  noData: boolean;
  result: any;
  scanResult: any //= '1FBEB142-843E-495F-A8E2-E59F0BE3162A';
  @ViewChild('content') content: Content

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private qrScanner: QRScanner,
    private global: GlobalProvider,
    private diagnostic: Diagnostic,
    private theme: ThemeProvider,
    private plt: Platform,
  ) {
  }

  ionViewDidLoad() {
    this.global.log('ionViewDidLoad ScanQrCodePage');
    this.result =
      {
        Entrydetail:
          {
            "id": "61",
            "event_id": "29",
            "user_id": "30",
            "name": "Admin1234",
            "mobile_no": "99500071170",
            "no_of_members": "1",
            "entry_for": "0",
            "total_amount": "5000.00",
            "payment_status": "1",
            "performance_confirmed": "0",
            "event_entry_confirmed": "0",
            "is_cancel": "0",
            "entry_date": "2018-05-22",
            "qrcode_image": "152715411461.png",
            "is_event_attended": "1",
          },
        Membersdetail: [
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
          { name: 'Prashant', amount: 26 },
        ]
      }
    this.noData = false;
    this.scanResult = true;
    this.result.Entrydetail.qrcode_image = `${this.global.image_base_path}barcode/${this.result.Entrydetail.qrcode_image}`;
  }

  ionViewDidEnter() {
    this.global.log('ionViewDidEnter ScanQrCodePage', this.content.getNativeElement());

    if (this.plt.is('android')) {

      // this.diagnostic.isCameraAuthorized().then(res => {
      //   this.global.log(`Got the isCameraAuthorized res `, res);
      //   if (res) {
      //     this.finalScan();
      //   } else {
      //     this.diagnostic.requestCameraAuthorization().then(res => {
      //       this.global.log(`Got the requestCameraAuthorization res `, res);
      //       if (res) {
      //         this.finalScan();
      //       } else {
      //         this.global.log(`App needs Camera Permission.`);
      //       }
      //     }).catch(err => {
      //       this.global.log(`Got the requestCameraAuthorization error `, err);
      //     });
      //   }
      // }).catch(err => {
      //   this.global.log(`Got the isCameraAuthorized error`, err);
      // });
    } else {
      this.finalScan();
    }
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
          if (res.success == 'true' && res.Membersdetail.length > 0) {
            this.result = res;
            this.noData = false;
            this.result.Entrydetail.qrcode_image = `${this.global.image_base_path}barcode/${this.result.Entrydetail.qrcode_image}`;
            this.global.showToast(`${res.message}`);

            // setTimeout(() => {
            //   this.navCtrl.popToRoot();
            // }, 1000);
          } else {
            this.noData = true;
            this.global.showToast(`${res.error}`);
          }
        }, err => {
          this.noData = true;
          this.global.hideLoader();
          this.global.log(`Some error in api`, err);
        }
      )
  }

  close() {
    this.navCtrl.popToRoot();
  }

  ionViewDidLeave() {
    this.qrScanner.destroy()
      .then(res => this.global.log(`ionViewDidLeave's destroy success `, res))
      .catch(err => this.global.log(`ionViewDidLeave's destroy error `, err));

    this.qrScanner.hide()
      .then(res => this.global.log(`ionViewDidLeave's hide success `, res))
      .catch(err => this.global.log(`ionViewDidLeave's hide error `, err));

  }

}
