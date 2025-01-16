import { Component } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { SolventekConstants } from '../../shared/utils/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-document',
  standalone: true,
  imports: [],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.scss'
})
export class UploadDocumentComponent {

  constructor(private commonService: CommonService, private snackBar: SnackbarService, private router: Router) { 
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.handleFileUpload(file);
    }
  }

  handleDrop(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.handleFileUpload(file);
    }
  }

  handleFileUpload(file:any){
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if(file.type != 'application/pdf') {
      this.snackBar.showSnackbar(['Only PDFs/Word Files less than 25 Mb can be uploaded'], 5000, SolventekConstants.MESSAGE_TYPES.ERROR);
      return;

    }
    if (file.size > maxSize) {
      this.snackBar.showSnackbar(['File size should be less than 25MB'], 5000, SolventekConstants.MESSAGE_TYPES.ERROR);
      return;
    }
    this.commonService.uploadDocument(file).subscribe((response: any) => {
      if (response.length && response[0]?.id?.length) {
        this.commonService.validateDocuments([response[0].id]).subscribe((res: any) => {
          if(res.success){
            this.snackBar.showSnackbar(['Document uploaded successfully, redirecting to uploaded documents'], 2500, SolventekConstants.MESSAGE_TYPES.SUCCESS);
            setTimeout(() => {
              this.router.navigate(['view-submissions']);
            }, 2500);
          }else{
            this.snackBar.showSnackbar(['Document validation failed'], 5000, SolventekConstants.MESSAGE_TYPES.ERROR);
          }
        })
      }
    })
  }

  handleDragOver(event: any) {
    event.preventDefault();
  }

}
