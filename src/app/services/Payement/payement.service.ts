import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {HEADERS, REST_URL} from "../../pages/REST_URL";

const baseUrl = REST_URL+"/paiements";
const SamaBaseUrl = 'https://smarchandama.sama.money/V1';

@Injectable({
  providedIn: 'root'
})
export class PayementService {

  constructor(private httpClient: HttpClient) { }

    Pay(num, payementData){
        return this.httpClient.post(`${baseUrl}`+'?num='+ num,payementData);
    }

    SamaAuth(){

      const Body = {
        'cmd':'m150',
        'cle_publique':'MZs3aqE6gFt5KrT323hz34TW'
      };
      return this.httpClient.post<any>(
        `https://smarchandama.sama.money/V1/marchand/auth`,
        Body,
        {headers: new HttpHeaders({
          'TRANSAC': 'e76b8eda497d8cc37c506bd6a5b70c6a54c91a49428a6adfae484fe7334b639c',
      }) });

    }

    SamaPay(payementBody, num_Commande, iD_candidant,phoneClient,token){
      let type = null;
      if (payementBody.motif === 'Frais de traitement de dossiers'){
        type = 'Dossier';
      } else {
        type = 'Inscription';
      }
      const iD_command = num_Commande+'__'+type;

      if (phoneClient.startsWith("+")) {
          phoneClient = phoneClient.substring(1);
        } else if (phoneClient.startsWith("00")) {
          phoneClient = phoneClient.substring(2);
        }

        if (!phoneClient.startsWith("223")) {
          phoneClient = "223" + phoneClient;
        }


      let head = {
        'TRANSAC': 'e76b8eda497d8cc37c506bd6a5b70c6a54c91a49428a6adfae484fe7334b639c',
        'auth':''+token,
        };

        const mont = payementBody.montantPaye;

      const Body = {
         'cmd':'m150',
         'cle_publique':'MZs3aqE6gFt5KrT323hz34TW',
         'idCommande':''+iD_command,
         'phoneClient':+phoneClient.replace(/\s/g, ""),
         'montant': +mont,
         'description':'Payement '+payementBody.motif,
         'url': 'https://vps77465.serveur-vps.net:8443/ussgb/paiements/sama',
         // 'url': 'https://ussgb.online/paiements/sama',
        //  'url': 'https://31.207.37.165:9090/ussgb/paiements/sama', // REST_URL+'/'
      }

      return this.httpClient.post<any>(`https://smarchandama.sama.money/V1/marchand/pay`,Body, {headers: new HttpHeaders (head)});
    }

    CheckSamaPay(num, type) {
      return this.httpClient.get(baseUrl+'/check?num='+ num +'&typePaiement='+type);
    }
}
