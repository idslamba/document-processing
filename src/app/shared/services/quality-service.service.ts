import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class QualityServiceService {

  selectedDocument: any;

  selectedProjectId:any;
  selectedWorkflowId:any;

  constructor(private httpService: HttpService) { }

  getDocumentsList() {
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/document_list";
    return this.httpService.get(serviceUrl, {})
  }


  getAllDocumentDetails(documentId: string) {
    let serviceUrl = "https://solventek-document-ai.azurewebsites.net/api/document_results";
    return this.httpService.post(serviceUrl, { documentIds: [documentId] }, undefined)
  }

  docDetails(documentId: any){
    const serviceURL = "https://solventek-document-ai.azurewebsites.net/api/document_results";
    return this.httpService.post(serviceURL, { documentIds: [documentId] }, undefined)
  }

  downloadCode(documentId: any){
    const serviceURL = "https://solventek-document-ai.azurewebsites.net/api/download";
    return this.httpService.get(serviceURL, { documentId: documentId });
  }

}
