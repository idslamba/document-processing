import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private readonly httpService: HttpService) { }

  getProjects() {
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/document_list";
    return this.httpService.get(serviceUrl, {})
  }


  uploadDocument(file: any) {
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/upload_document";
    return this.httpService.uploadDocument(serviceUrl, file);
  }

  validateDocuments(documentIds: Array<string>) {
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/validate_documents";
    return this.httpService.post(serviceUrl, {
      documentIds: documentIds
    }, undefined)
  }

  getDocumentsList() {
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/document_list";
    return this.httpService.get(serviceUrl, {})
  }

  getDocumentDetails(documentId: string) {
    let serviceUrl = "https://rpa-services.azurewebsites.net/api/Document?code=UqV2cyTX_cIFt5Ns-mbw57wl8yaCZGdkNEQStqjlARHDAzFuGoPZjw%3D%3D";
    return this.httpService.get(serviceUrl, { id: documentId })
  }

  getAllDocumentDetails(documentId: string) {
    let serviceUrl = "https://rpa-services.azurewebsites.net/api/DocumentResult?code=S6tkM48f3m46ye6GblpWtTWFUcwefLEyEbAoCPVPrLAdAzFur4umBQ%3D%3D";
    return this.httpService.get(serviceUrl, { documentId: documentId })
  }
}
