/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Doctor-Appointment - 1 This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Injectable, NgZone } from '@angular/core';
import { LoadingController, AlertController, ToastController, NavController, MenuController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  isLoading = false;

  welcomeSlider: any[] = [
    {
      "title": "Find Your Doctor Online",
      "sub": "Nam bonum ex quo appellatum sit, nescio, praepositum credo, quod praeponatur aliis posset inveniri voluptas.",
      "image": "assets/images/sliders/1.png"
    },
    {
      "title": "Find Trusted Doctor",
      "sub": "Nam bonum ex quo appellatum sit, nescio, praepositum credo, quod praeponatur aliis posset inveniri voluptas.",
      "image": "assets/images/sliders/2.png"
    },
    {
      "title": "Smart Booking System",
      "sub": "Nam bonum ex quo appellatum sit, nescio, praepositum credo, quod praeponatur aliis posset inveniri voluptas.",
      "image": "assets/images/sliders/3.png"
    },
  ];

  homeSlider: any[] = [
    {
      "name": "Stephan N. Harris",
      "type": "General Practitioner, London",
      "image": "assets/images/home-slider/slide1.jpg",
      "date": "July 15, 04:30 PM"
    },
    {
      "name": "Jeffrey M. Shaw",
      "type": "Pediatrician, Rome",
      "image": "assets/images/home-slider/slide2.jpg",
      "date": "July 15, 05:30 PM"
    },
    {
      "name": "Christine R. Bentley",
      "type": "Oncologist, Istanbul",
      "image": "assets/images/home-slider/slide3.jpg",
      "date": "July 15, 06:30 PM"
    },
    {
      "name": "Denise M. Kimbrough",
      "type": "Neurologist, Beijing",
      "image": "assets/images/home-slider/slide4.jpg",
      "date": "July 15, 07:30 PM"
    },
    {
      "name": "John S. Deese",
      "type": "Psychiatrist, Sydney",
      "image": "assets/images/home-slider/slide5.jpg",
      "date": "July 16, 04:30 PM"
    },
    {
      "name": "Cindy J. Therrien",
      "type": "Ophthalmologist, Mumbai",
      "image": "assets/images/home-slider/slide6.jpg",
      "date": "July 17, 05:30 PM"
    },
  ];

  diseasesList: any[] = [
    {
      "image": "assets/images/more/skin-care.png",
      "name": "Skin care"
    },
    {
      "image": "assets/images/more/stomach.png",
      "name": "Digestion"
    },
    {
      "image": "assets/images/more/hair.png",
      "name": "Hair care"
    },
    {
      "image": "assets/images/more/shared-vision.png",
      "name": "Eye and Vision"
    },
    {
      "image": "assets/images/more/uterus.png",
      "name": "Gynecological related issues"
    },
    {
      "image": "assets/images/more/diabetes.png",
      "name": "Diabetes"
    },
    {
      "image": "assets/images/more/heart.png",
      "name": "Heart related issues"
    },
    {
      "image": "assets/images/more/liver.png",
      "name": "Liver issues"
    },
    {
      "image": "assets/images/more/neurology.png",
      "name": "Neuro & Nerves"
    },
    {
      "image": "assets/images/more/obesity.png",
      "name": "Obesity & Cholestrol"
    },
    {
      "image": "assets/images/more/lungs.png",
      "name": "Respiratory & Asthma"
    },
    {
      "image": "assets/images/more/tape.png",
      "name": "External Wounds"
    },
    {
      "image": "assets/images/more/skin-care.png",
      "name": "Skin care"
    },
    {
      "image": "assets/images/more/stomach.png",
      "name": "Digestion"
    },
    {
      "image": "assets/images/more/hair.png",
      "name": "Hair care"
    },
    {
      "image": "assets/images/more/shared-vision.png",
      "name": "Eye and Vision"
    },
    {
      "image": "assets/images/more/uterus.png",
      "name": "Gynecological related issues"
    },
    {
      "image": "assets/images/more/diabetes.png",
      "name": "Diabetes"
    },
    {
      "image": "assets/images/more/heart.png",
      "name": "Heart related issues"
    },
    {
      "image": "assets/images/more/liver.png",
      "name": "Liver issues"
    },
    {
      "image": "assets/images/more/neurology.png",
      "name": "Neuro & Nerves"
    },
    {
      "image": "assets/images/more/obesity.png",
      "name": "Obesity & Cholestrol"
    },
    {
      "image": "assets/images/more/lungs.png",
      "name": "Respiratory & Asthma"
    },
    {
      "image": "assets/images/more/tape.png",
      "name": "External Wounds"
    },
  ];

  doctorsList: any[] = [
    {
      "image": "assets/images/doctors/1.jpg",
      "name": "Dr. Elaine D. Smith",
      "cate_name": "Orthopedics"
    },
    {
      "image": "assets/images/doctors/2.jpg",
      "name": "Dr. Jonathan A. Cave",
      "cate_name": "Dermatology"
    },
    {
      "image": "assets/images/doctors/3.jpg",
      "name": "Dr. Earl M. Wayman",
      "cate_name": "Radiology"
    },
    {
      "image": "assets/images/doctors/4.jpg",
      "name": "Dr. Joann B. Davidson",
      "cate_name": "Ophthalmology"
    },
    {
      "image": "assets/images/doctors/5.jpg",
      "name": "Dr. Cary J. Coleman",
      "cate_name": "Pediatrics"
    },
    {
      "image": "assets/images/doctors/6.jpg",
      "name": "Dr. Janelle C. Morin",
      "cate_name": "General Surgery"
    },
    {
      "image": "assets/images/doctors/7.jpg",
      "name": "Dr. Terrence M. Macedo",
      "cate_name": "Internal Medicine"
    },
    {
      "image": "assets/images/doctors/8.jpg",
      "name": "Dr. Eric V. Saldivar",
      "cate_name": "Orthopedics"
    },
    {
      "image": "assets/images/doctors/9.jpg",
      "name": "Dr. Joyce B. Francois",
      "cate_name": "Dermatology"
    },
    {
      "image": "assets/images/doctors/10.jpg",
      "name": "Dr. Mary W. Martin",
      "cate_name": "Radiology"
    },
    {
      "image": "assets/images/doctors/11.jpg",
      "name": "Dr. James J. Brooks",
      "cate_name": "Ophthalmology"
    },
    {
      "image": "assets/images/doctors/12.jpg",
      "name": "Dr. Faye G. Phipps",
      "cate_name": "Pediatrics"
    },
    {
      "image": "assets/images/doctors/13.jpg",
      "name": "Dr. Kristopher N. Harrison",
      "cate_name": "General Surgery"
    },
    {
      "image": "assets/images/doctors/14.jpg",
      "name": "Dr. Frank B. Holden",
      "cate_name": "Internal Medicine"
    },
  ];

  languagesList: any[] = [
    "English (US)",
    "English (UK)",
    "हिंदी",
    "日本",
    "తెలుగు",
    "Turkish",
    "Tagalog",
    "Burmese",
    "Lingala",
    "Yoruba",
    "Bhojpuri",
  ];

  chatList: any[] = [
    {
      "from": "a",
      "message": "Hello there. Thanks for the follow. Did you notice, that I am an egg? A talking egg? Damn!😄😄"
    },
    {
      "from": "b",
      "message": "	😃	😃	😃Yeah that is crazy, but people can change their own picture and build their own Twitter conversation with this generator, so it does not matter that you are an egg",
    },
    {
      "from": "a",
      "message": "Thanks mate! Feel way better now. Oh, and guys, these messages will be removed once your add your own :-)"
    },
    {
      "from": "b",
      "message": "You can then edit a message by clicking on it. This way you can change the text, status (check marks) and time. You can also determine whether the message was sent by the sender (right) or receiver (left)."
    },
    {
      "from": "a",
      "message": "😀😀You can change the order of messages by dragging and dropping them."
    },
    {
      "from": "b",
      "message": "Finally, click  (top right) to download your fake chat as an image."
    },
    {
      "from": "a",
      "message": "😀😀Thanks mate! Feel way better now. Oh, and guys, these messages will be removed once your add your own :-)"
    },
    {
      "from": "b",
      "message": "You also have the facility to hide the header and footer if needed."
    },
    {
      "from": "a",
      "message": "😀😀😀Customize the clock time and battery percentage as per your satisfaction."
    },
    {
      "from": "b",
      "message": "Now, make all the required changes for Person 2 also."
    },
    {
      "from": "a",
      "message": "If satisfied, download the chat and share with all your close friends and relatives, and note their reactions."
    },
    {
      "from": "b",
      "message": "😀😀Privacy comes first. Our tool does not store any data or chats by keeping in mind the privacy of our users"
    },
    {
      "from": "a",
      "message": "😀😀😀😀Our android text generator tool has an easy-to-use interface for the ease of the users. Also, the results generated by our tool are fast and realistic"
    },
    {
      "from": "b",
      "message": "Message privately. End-to-end encryption and privacy controls. Stay connected. Message and call for free* around the world. Build community. Group conversations made simple. Express yourself. Say it with stickers, voice, GIFs and more. WhatsApp business. Reach your customers from anywhere."
    },
    {
      "from": "a",
      "message": "Send a single message to multiple people at once"
    },
    {
      "from": "b",
      "message": "You can now send messages in bold, italics or strikethrough too. Simply use the special characters before and after the words to get the formatting of your choice"
    },
    {
      "from": "a",
      "message": "If you want to know who you are chatting too much with on WhatsApp, you can find out by simply scrolling through the chat screen"
    }
  ];

  userList: any[] = [
    {
      "image": "assets/images/avatar/1.jpg",
      "name": "Richard G. Oneal"
    },
    {
      "image": "assets/images/avatar/2.jpg",
      "name": "Floyd M. Helton"
    },
    {
      "image": "assets/images/avatar/3.jpg",
      "name": "Matthew M. Hernandez"
    },
    {
      "image": "assets/images/avatar/4.jpg",
      "name": "Candice M. Coffey"
    },
    {
      "image": "assets/images/avatar/5.jpg",
      "name": "Terrie R. Cobb"
    },
    {
      "image": "assets/images/avatar/6.jpg",
      "name": "Clarissa C. Wentz"
    },
    {
      "image": "assets/images/avatar/7.jpg",
      "name": "Shirley J. Arnold"
    },
    {
      "image": "assets/images/avatar/8.jpg",
      "name": "Jack R. Applegate"
    },
    {
      "image": "assets/images/avatar/9.jpg",
      "name": "Anita T. Ross"
    },
    {
      "image": "assets/images/avatar/10.jpg",
      "name": "Dianna K. Wadley"
    },
    {
      "image": "assets/images/avatar/11.jpg",
      "name": "Rodney R. Ruddy"
    },
    {
      "image": "assets/images/avatar/12.jpg",
      "name": "Deanna B. Mull"
    },
    {
      "image": "assets/images/avatar/13.jpg",
      "name": "Michael C. Phelan"
    },
    {
      "image": "assets/images/avatar/14.jpg",
      "name": "Lorraine S. Jones"
    },
    {
      "image": "assets/images/avatar/15.jpg",
      "name": "Philip J. Watson"
    },
    {
      "image": "assets/images/avatar/16.jpg",
      "name": "Patricia R. James"
    },
    {
      "image": "assets/images/avatar/17.jpg",
      "name": "Dena C. Fernandez"
    },
    {
      "image": "assets/images/avatar/18.jpg",
      "name": "Troy S. Gaines"
    },
    {
      "image": "assets/images/avatar/19.jpg",
      "name": "Robin K. Miller"
    },
    {
      "image": "assets/images/avatar/20.jpg",
      "name": "Willie K. Rothermel"
    },
  ];
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private router: Router,
    private zone: NgZone,
  ) {
  }

  navigateToPage(routes: any, param?: NavigationExtras | undefined) {
    this.zone.run(() => {
      console.log(routes, param);
      this.router.navigate([routes], param);
    });
  }

  navigateToProduct(id: number, name: string) {
    this.zone.run(() => {
      this.router.navigate(['product-details', id, name]);
    });
  }

  navigateRoot(routes: any | string) {
    this.zone.run(() => {
      this.navCtrl.navigateRoot([routes]);
    });
  }

  getKeys(key: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(localStorage.getItem(key))
    });
  }

  clearKeys(key: string) {
    localStorage.removeItem(key);
  }

  setKeys(key: string, value: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(localStorage.setItem(key, value));
    });
  }

  async show(msg?: string | null) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: msg && msg != '' && msg != null ? msg : '',
      spinner: 'bubbles',
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async hide() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  /*
  Show Warning Alert Message
  param : msg = message to display
  Call this method to show Warning Alert,
  */
  async showWarningAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: 'Warning',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showSimpleAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: '',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  /*
   Show Error Alert Message
   param : msg = message to display
   Call this method to show Error Alert,
   */
  async showErrorAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }

  /*
    param : email = email to verify
    Call this method to get verify email
  */
  async getEmailFilter(email: string) {
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(email))) {
      const alert = await this.alertCtrl.create({
        header: 'Warning',
        message: 'Please enter valid email',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    } else {
      return true;
    }
  }

  /*
    Show Toast Message on Screen
    param : msg = message to display, color= background
    color of toast example dark,danger,light. position  = position of message example top,bottom
    Call this method to show toast message
  */
  async showToast(msg: any, colors: any, positon: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: colors,
      position: positon
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async shoNotification(msg: any, colors: any, positon: any) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 4000,
      color: colors,
      position: positon,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async errorToast(msg: any, color?: string | (string & Record<never, never>) | undefined) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color ? color : 'dark'
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  onBack() {
    this.navCtrl.back();
  }

  makeid(length: any) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
