import {NgxImageCompressService} from "ngx-image-compress";
import Swal from "sweetalert2";
import jspdf from "jspdf";
import html2canvas from "html2canvas";
import {exists} from "fs";
import {CustomPDFs} from "./CustomPDFs";
// import {isNumber} from "@swimlane/ngx-charts/lib/utils/types";

export class Util_fonction{

  localCompressedURl:any;
  sizeOfOriginalImage:number;
  sizeOFCompressedImage:number;

  resulOfCompress: any;
  private _saveData: any;
  static userData: any;

  constructor(private imageCompress?: NgxImageCompressService){
  }

  /**
   * VERIFICATION DE RTOLE
   */
  static checkIfAsRole (userData, role?:any, RoleArr?:any){
    let result = false;
    if (this.checkIfNoTEmpty(role)){
      for (let rl of userData.users.roles){
          if (rl.nom === role){
            result = true;
          }
        }
    }

    if (this.checkIfNoTEmpty(RoleArr)){
      for (let rll of userData.users.roles){
        if (RoleArr.includes(rll.nom)){
          return true;
        }
      }
    }
    return result;
  }

  /**
   * VERIFICATION DE RTOLE
   */
  static checkIfAsRole2 (userData:any, RoleArr?:any){
    let result = false;
    let MyRoles =[];

    for (let rll of userData.users.roles){
      MyRoles.push(rll.nom.toString());
    }

    for (let reqRole of RoleArr){
      if (MyRoles.includes(reqRole)){
        result = true;
      }
    }
    return result;
  }


  get saveData(): any {
    return this._saveData;
  }

  set saveData(value: any) {
    this._saveData = value;
  }

  /**
   * date [xxxx, x, x]
   * @param date
   * @constructor
   */
   DateConvert(date){
    if (date[1].toString().length <= 1){
      date[1] = '0'+date[1];
    }
    if (date[2].toString().length <= 1){
      date[2] = '0'+date[2];
    }

    return date[0]+'-'+date[1]+'-'+date[2];
  }

  // tslint:disable-next-line:member-ordering
  public static DateConvert2(date){
    let result = date;
    console.log(typeof date);

    if (typeof date !== 'string') {
      // tslint:disable-next-line:max-line-length
      result = date[0] + ((date[1].toString().length <= 1) ? '-0' : '-') + date[1] + ((date[2].toString().length <= 1) ? '-0' : '-') + date[2];
    }

    console.log(result);

    return result;
  }

  public static HeureConvert(heure){
     let hr = heure.toString().split(':');
    if (hr[0].toString().length <= 1){
      hr[0] = '0'+hr[0];
    }

    if (hr[1].toString().length <= 1){
      hr[1] = '0'+hr[1];
    }

    return hr[0]+':'+hr[1];
  }

  public static convertDate(date) {
    let yyyy = date.getFullYear().toString();
    let mm = (date.getMonth()+1).toString();
    let dd  = date.getDate().toString();

    let mmChars = mm.split('');
    let ddChars = dd.split('');

    return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
  }


  static checkIfEventIsCurrent(dateDebut,dateFin){
    let dateD = new Date(this.DateConvert2(dateDebut));
    let dateF = new Date(this.DateConvert2(dateFin));
    let todyDate = new Date();
    return dateD <= todyDate && todyDate <= dateF;
  }


  /***
   * **************************************************************************
   *                                    ALERT
   * @param status
   * @param message
   * @constructor
   * **************************************************************************
   */

  static AlertMessage(status, message, error = undefined){
    let type = null;
    if (this.checkIfNoTEmpty(error) && typeof error === 'string'){
      console.log("error 700...", error);
      const realError = JSON.parse(error);
      status = realError.status;
      message = realError.message;
      if (status === 400 && this.checkIfNoTEmpty(message) && message.includes('ERROR')){
        return Swal.fire({
          icon: 'warning',
          title: "",
          html: message,
          allowOutsideClick: false
        });
      }
    }
    console.log(status, message);

    if (this.checkIfNoTEmpty(status) && this.checkIfNoTEmpty(message)){
      if (typeof status == 'number'){
        //
        if (status === 200 || status === 201){
          type = 'success';
        } else {
          type = 'error';
        }
        if (status === 400  || status === 500) {
          type = 'error';
          if (status === 500){
            message = "Un problème interne est survenu veuillez réessayer plus tard ! <br>" +
              "<strong>-</strong> Contactez l'administrateur en cas de persistance";
          }
        }

        if (status === 403){
          message = message === 'Forbidden' ? "Désolé, vous n'avez pas ce droit" : message;
        }
      } else {
        //
        if (status === "warning"){
          type = 'warning';
        }
        if (status === "info"){
          type = 'info';
        }
        if (status === "question"){
          type = 'question';
        }
      }

      return Swal.fire({
        icon: type,
        title: "",
        html: message,
        allowOutsideClick: false
      });

    } else {
      // if (!Util_fonction.checkIfNoTEmpty(status)){
      //   return Swal.fire({
      //     icon: "warning",
      //     title: "",
      //     html: message,
      //     allowOutsideClick: false
      //   });
      // }

      return Swal.fire({
        icon: "warning",
        title: "Un problème est survenu !",
        html: "Aucune réponse du serveur <br>" +
          "<strong>1-</strong> Veuillez vous assurer que votre connexion est disponible! <br>" +
          "<strong>2-</strong> Contactez l'administrateur en cas de persistance",
        allowOutsideClick: false
      });
    }

  }

  static AlertMessage2(status, message){
    console.log("status : ", status);
    console.log("message : ", message);
    let type = null;
    if (this.checkIfNoTEmpty(status) && this.checkIfNoTEmpty(message)){
      if (typeof status == 'number'){
        //
        if (status === 200 || status === 201){
          type = 'success';
        } else {
          type = 'error';
        }
        if (status === 400  || status === 500) {
          type = 'error';
          if (status === 500){
            message = "Un problème interne est survenu veuillez réessayer plus tard ! <br>" +
              "<strong>-</strong> Contactez l'administrateur en cas de persistance";
          }
        }

        if (status === 403){
          message = message+"! vous navez pas ce droit";
        }
      } else {
        //
        if (status === "warning"){
          type = 'warning';
        }
        if (status === "info"){
          type = 'info';
        }
        if (status === "question"){
          type = 'question';
        }
      }

      return Swal.fire({
        icon: type,
        title: "",
        html: message,
        allowOutsideClick: false
      });

    } else {
      if (!Util_fonction.checkIfNoTEmpty(status)){
        return Swal.fire({
          icon: "warning",
          title: "",
          html: message.error,
          allowOutsideClick: false
        });
      }

      return Swal.fire({
        icon: "warning",
        title: "Un problème est survenu !",
        html: "Aucune réponse du serveur <br>" +
          "<strong>1-</strong> Veuillez vous assurer que votre connexion est disponible! <br>" +
          "<strong>2-</strong> Contactez l'administrateur en cas de persistance",
        allowOutsideClick: false
      });
    }

  }

  static SuccessMessage(message){
    return Swal.fire({
      icon: 'success',
      title: "",
      html: message,
      allowOutsideClick: false
    });
  }
  static AlertEmptyMessage(response){
    if (!this.checkIfNoTEmpty(response)){
      return Swal.fire({
        icon: 'info',
        title: "",
        html: "Liste vide !",
        allowOutsideClick: false
      });
    }
  }


  /***
   * VERIFICATION DE NULL OU UNDEFINED VALEUR
   */

  static checkIfNoTEmpty(element){
    return element !== null && element !== undefined && element !== "";
  }

  static checkIfArrayNoTEmpty(element){
    return element !== [];
  }

  static paginatSequence(minSize, data){
    let arr = [minSize];
    let lengt = Object.keys(data).length;

    let first = 0;
    for (let i=1; i<= lengt; i++) {
      minSize = minSize*2;
      if (minSize >=lengt && first === 0){
        arr.push(lengt);
        first = 1;
      }
      if (minSize < lengt) {
        arr.push(minSize);
      }
    }
    return arr;
  }
  static paginatSequence2(minSize, data){
    let arr = [minSize];
    let lengt = data;
    console.log(data)

    let first = 0;
    for (let i=1; i<= lengt; i++) {
      minSize = minSize*2;
      if (minSize >=lengt && first === 0){
        arr.push(lengt);
        first = 1;
      }
      if (minSize <= lengt) {
        arr.push(minSize);
      }
    }
    return arr;
  }

  static separeAnnee(interval){
    let ans = interval.split("-");
    ans[0] = ans[0].replace(/\s/g, "");
    ans[1] = ans[1].replace(/\s/g, "");

    console.log("---Ans ---");
    console.log(ans);
    return ans;
  }

  static PrintCarteEtudiant(){
    const data = document.getElementById('face');
    const dos = document.getElementById('dos');
    const pdf = new jspdf('l', 'mm', [86, 54]);
    html2canvas(data).then(canvas => {
      const imgWidth = 86;
      const pageHeight = 210;
      const imgHeight = 54;
      const heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/jpeg');
      const position = 0;
      pdf.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      // pdf.save('test.pdf');
      pdf.addPage();
      html2canvas(dos).then(canvas2 => {
        const imgWidth2 = 86;
        const pageHeight2 = 210;
        const imgHeight2 = 54;
        const heightLeft2 = imgHeight2;
        const contentDataURL2 = canvas2.toDataURL('image/jpeg');
        const position2 = 0;
        pdf.addImage(contentDataURL2, 'JPEG', 0, position2, imgWidth2, imgHeight2);
        pdf.save('Carte.pdf');

      });
    });
  }



  /***
   * SYTEME DE COMPRESSION D'UNE IMAGE
   */

  imgResultBeforeCompress:string;
  imgResultAfterCompress:string;
  compressFile(image,fileName): any {
    let orientation = -1;
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
    console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);
    return this.imageCompress.compressFile(image, orientation, 50, 50).then(
      result => {
        this.imgResultAfterCompress = result;
        this.localCompressedURl = result;
        this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
        console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
// create file from byte
        const imageName = fileName;
// call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
//imageFile created below is the new compressed file which can be send to API in form data
//         const imageFile = new File([result], imageName, { type: 'image/jpeg' });
        this.resulOfCompress = new File([result], imageName, { type: 'image/jpeg' });
        console.log("rrr");
        console.log(this.resulOfCompress);
        return this.resulOfCompress;
      }, errorOfCompress =>{
        console.log("erreur de compression+++");
        console.log(errorOfCompress);
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }

  static formatMoneyNumeric(montant) {
    let rever = montant.toString().split('').reverse();//join('');
    let j = 1;
    let i =0;
    let t = '';
    for (i=0 ; i < rever.length; i++){
      t = t+''+rever[i];
      if (j === 3){
        t = t+' ';
        j = 0;
      }
      j++;
    }
    return t.split('').reverse().join('');
  }


  static MultiplePagePDF(fileName){
    const data = document.getElementById('export-part');
    html2canvas(data).then((canvas:any) => {
      console.log("canvas data", canvas);
      //Port
      const imgWidth = 208;
      const pageHeight = 297;

      //Land
      // const imgWidth = 297;//295
      // const pageHeight = 21;//204.9215686275;//210;//208
      // console.log("round 1", Math.round(((canvas.height * imgWidth) / canvas.width)));
      console.log("round 2", (canvas.height * imgWidth) / canvas.width);
      console.log("floor ", Math.floor(((canvas.height * imgWidth) / canvas.width)));
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0 ;//0 | 15
      heightLeft -= pageHeight;

      const contentDataURL = canvas.toDataURL('image/jpeg');
      // "l","mm",[210, 297]
      const doc = new jspdf('portrait', 'mm','a4');
      doc.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(contentDataURL, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save(fileName);
    });

  }

  public static Print(titre){
    let printContents, popupWin;
    printContents = document.getElementById("print").innerHTML.toString();
    printContents = (<string>printContents + "").replace("col-sm", "col-xs");
    // console.log(printContents);
    popupWin = window.open("", "_blank", "top=0,left=0,height=100%,width=auto");
    // popupWin.document.open();
    popupWin.document.write(CustomPDFs.transferStockPDF(printContents, titre));
    /* window.close(); */
    popupWin.document.close();
  }

}
