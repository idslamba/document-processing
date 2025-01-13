import { CommonModule, } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { Subscription } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { QualityServiceService } from '../../shared/services/quality-service.service';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { SolventekConstants } from '../../shared/utils/constants';
import { CommonService } from '../../shared/services/common.service';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogService } from '../../shared/services/dialog.service';
import { AngularSplitModule } from 'angular-split';

@Component({
  selector: 'app-selected-document',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule, MatIconModule,
    NgxSkeletonLoaderModule, RouterLink, RouterLinkActive, RouterOutlet, MatDialogModule, AngularSplitModule],
  templateUrl: './selected-document.component.html',
  styleUrl: './selected-document.component.scss'
})
export class SelectedDocumentComponent implements OnInit, AfterViewInit {

  @ViewChild('pdfContainer') pdfContainer!: ElementRef;
  subscription: Array<Subscription> = [];
  selectedDocumentId: string = "";
  selectedDocument: any;
  showSkeleton: boolean = false;
  pdfArrayBuffer: any;
  pdf: any;
  // contentData: Array<string> = [];
  // contentDataUpdated: Array<string> = [];
  selectedDocumentData: any;
  isFieldChanged: any = {};
  showUpdateButton: boolean = false;
  totalPages: Array<number> = [];
  seletedPage: number = 1;
  viewPort: any;
  page: any;
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  scale: number = 1;
  pdfLoading: boolean = true;
  displayFields: Array<{ content: string, updatedContent?: string, type: string, boundingRegions: any, name: string, confidence: number }> = [];
  fields: Array<{ content: string, updatedContent?: string, type: string, boundingRegions: any, name: string, confidence: number }> = [];
  pagesDimensions: Array<{ index: number, dimension: { height: number, width: number }, unit: string }> = [];
  rectangle: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };
  selectedConfidenceType: string = "";
  editSet: Set<string> = new Set();

  constructor(private qualityReviewService: QualityServiceService, private http: HttpClient,
    private snackbarService: SnackbarService, private route: ActivatedRoute, private commonService: CommonService, private dialogService: DialogService) { }

  async ngOnInit() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.9.155/pdf.worker.min.mjs';
    this.selectedDocumentId = this.route.snapshot.paramMap.get('id') || "";
    this.getDocumentInformation(this.selectedDocumentId);
    this.getDocumentDetails(this.selectedDocumentId);
  }

  async getDocumentInformation(documentId: string) {
    this.showSkeleton = true;
    this.qualityReviewService.getAllDocumentDetails(documentId).subscribe((data: any) => {
      if (data?.length) {
        this.fields = [];
        this.displayFields = [];
        this.totalPages = [];
        this.pagesDimensions = [];
        this.selectedDocumentData = data[0];
        console.log(JSON.parse(this.selectedDocumentData.result));
        if (this.selectedDocumentData?.results?.pages?.length) {
          for (let i = 0; i < this.selectedDocumentData.results.pages.length; i++) {
            // this.totalPages.push(i + 1);
            this.pagesDimensions.push({ index: i + 1, unit: this.selectedDocumentData.results.pages[i].unit, dimension: { height: this.selectedDocumentData.results.pages[i].height, width: this.selectedDocumentData.results.pages[i].width } })
          }
        }
        Object.keys(data[0].results.documents[0].fields).forEach(ele => {
          this.fields.push({
            name: ele,
            type: data[0].results.documents[0].fields[ele].kind,
            content: data[0].results.documents[0].fields[ele].content || "",
            updatedContent: data[0].results.documents[0].fields[ele].updatedContent,
            boundingRegions: data[0].results.documents[0].fields[ele].boundingRegions,
            confidence: data[0].results.documents[0].fields[ele].confidence * 100
          });
          // if (data[0].results.documents[0].fields[ele].content?.length) {
          // }
        })
        this.displayFields = JSON.parse(JSON.stringify(this.fields));
        // this.contentData = this.fields.map(ele => ele.content);
        // this.contentDataUpdated = JSON.parse(JSON.stringify(this.contentData));
        this.isFieldChanged = {};

      }
      this.showSkeleton = false;
    })
  }

  async getPDFCode() {
    this.http.post("https://rpa-services.azurewebsites.net/api/Download?code=qshH5kaD0AVolQZvaObh9upJln8s1prFbpKb_ScAEGWRAzFuWUTsyA%3D%3D",
      { documentUrl: this.selectedDocument.documentUrl }, {
      responseType: 'arraybuffer',
    }).subscribe((response: any) => {
      pdfjsLib.getDocument(response).promise.then(async (pdf: any) => {
        this.pdf = pdf;
        this.totalPages = [];
        for (let i = 0; i < this.pdf.numPages; i++) {
          this.totalPages.push(i + 1);
        }
        await this.renderPage(1);
      }, (error) => {
        console.log("error", error);
      });
    })
  }

  getDocumentDetails(documentId: string) {
    this.qualityReviewService.docDetails(documentId).subscribe({
      next: (res: any) => {
        if (res?.length) {
          this.selectedDocument = res[0];
          this.getPDFCode();
        }
      },
      error: (err) => {
        console.log(err);
      }

    });
  }

  async renderPage(pageNumber: number) {
    return new Promise((resolve, reject) => {
      this.pdfLoading = true;
      this.pdf.getPage(pageNumber).then((page: any) => {
        // Prepare canvas using PDF page dimensions
        this.page = page;
        this.viewPort = page.getViewport({ scale: this.scale });
        const canvas = document.getElementById('canvas') as any;
        const context = canvas.getContext('2d');
        canvas.height = this.viewPort.height;
        canvas.width = this.viewPort.width;
        // Render PDF page into canvas context
        const renderContext = {
          canvasContext: context,
          viewport: this.viewPort
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
          this.pdfLoading = false;
          console.log('Page rendered');
          resolve(true);
        })
      })
    })
  }

  confidenceChanged(name: string) {
    let index = this.displayFields.findIndex(ele => ele.name == name);
    if (index != -1) {
      setTimeout(() => {
        if (this.displayFields[index].content != this.displayFields[index].updatedContent) {
          this.isFieldChanged[this.displayFields[index].name] = true;
          this.showUpdateButton = true;
        }
      }, 100);
    }
  }

  restoreFieldData(name: string) {
    let index = this.displayFields.findIndex(ele => ele.name == name);
    if (index != -1) {
      this.displayFields[index].updatedContent = this.displayFields[index].content;
      this.isFieldChanged[this.displayFields[index].name] = false;
      this.editSet.delete(name);
      this.showUpdateButton = false;
      Object.values(this.isFieldChanged).forEach(ele => {
        if (ele) {
          this.showUpdateButton = true;
        }
      })
    }
  }

  async pageSeleted(pageNumber: number) {
    this.seletedPage = pageNumber;
    await this.renderPage(pageNumber);
  }

  async highlightField(index: number) {
    if (this.seletedPage != this.displayFields[index].boundingRegions[0].pageNumber) {
      this.seletedPage = this.displayFields[index].boundingRegions[0].pageNumber;
    }
    await this.renderPage(this.seletedPage);
    if (this.displayFields[index]?.boundingRegions[0]?.polygon?.length == 4) {
      const canvas = document.getElementById('canvas') as any;
      const width = canvas.width;
      const height = canvas.height;
      const widthRatio = width / this.pagesDimensions[this.seletedPage - 1].dimension.width;
      const heightRatio = height / this.pagesDimensions[this.seletedPage - 1].dimension.height;
      const contextX = this.displayFields[index].boundingRegions[0].polygon[0].x * widthRatio;
      const contextY = this.displayFields[index].boundingRegions[0].polygon[0].y * heightRatio;
      this.scrollToPoint(contextX, contextY);
      const context = canvas.getContext('2d');
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = "red";
      context.moveTo(this.displayFields[index].boundingRegions[0].polygon[0].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[0].y * heightRatio);
      context.lineTo(this.displayFields[index].boundingRegions[0].polygon[1].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[1].y * heightRatio);
      context.lineTo(this.displayFields[index].boundingRegions[0].polygon[2].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[2].y * heightRatio);
      context.lineTo(this.displayFields[index].boundingRegions[0].polygon[3].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[3].y * heightRatio);
      context.lineTo(this.displayFields[index].boundingRegions[0].polygon[0].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[0].y * heightRatio);
      context.stroke();
    }
  }

  scrollToPoint(x: number, y: number) {
    // Get the container's dimensions
    const container = document.getElementById('canvas-container') as any;
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Get the scroll position of the container
    const scrollLeft = container.scrollLeft;
    const scrollTop = container.scrollTop;
    let isScrolledHorizontal = false;
    // The point is not in the visible area of the container horizontally
    if (x < scrollLeft || x > scrollLeft + containerWidth) {
      isScrolledHorizontal = true;
      if (x < scrollLeft) {
        container.scrollLeft = 0;
      } else if (x > scrollLeft + containerWidth) {
        const newScrollLeft = scrollLeft + x - (containerWidth / 2);
        const maxScrollLeft = container.scrollWidth - containerWidth;
        container.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
      }
    }

    // The point is not in the visible area of the container vertically
    if (isScrolledHorizontal) {
      setTimeout(() => {
        if (y < scrollTop || y > scrollTop + containerHeight) {
          const newScrollTop = y - (containerHeight / 2);
          const maxScrollTop = container.scrollHeight - containerHeight;
          container.scrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop));
        }
      }, 1000);
    } else {
      if (y < scrollTop || y > scrollTop + containerHeight) {
        const newScrollTop = y - (containerHeight / 2);
        const maxScrollTop = container.scrollHeight - containerHeight;
        container.scrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop));
      }
    }
  }


  async zoom(type: number) {
    if (type == -1) {
      if (this.scale >= 0.3) {
        this.scale = this.scale - 0.1;
        this.scale = Math.round(this.scale * 10) / 10;
        await this.renderPage(this.seletedPage);
      } else {
        this.snackbarService.showSnackbar(["Minimum zoom level reached"], undefined, SolventekConstants.MESSAGE_TYPES.ERROR);
      }
    } else if (type == 1) {
      if (this.scale < 2) {
        this.scale = this.scale + 0.1;
        this.scale = Math.round(this.scale * 10) / 10;
        await this.renderPage(this.seletedPage);
      } else {
        this.snackbarService.showSnackbar(["Maximum zoom level reached"], undefined, SolventekConstants.MESSAGE_TYPES.ERROR);
      }
    }
  }

  filterConfidence(confidenceType: 'high' | 'medium' | 'low') {
    let isFieldChanged = false;
    Object.values(this.isFieldChanged).forEach(ele => {
      if (ele) {
        isFieldChanged = true;
        this.snackbarService.showSnackbar(["Please save the changes before filtering"], undefined, SolventekConstants.MESSAGE_TYPES.ERROR);
      }
    })
    if (isFieldChanged) return;

    this.editSet = new Set();
    this.isFieldChanged = {};
    if (this.selectedConfidenceType == confidenceType) {
      this.selectedConfidenceType = "";
      this.displayFields = JSON.parse(JSON.stringify(this.fields));
    } else {
      this.selectedConfidenceType = confidenceType
      this.displayFields = this.fields.filter(ele => {
        if (confidenceType == 'high') {
          return ele.confidence >= 95;
        } else if (confidenceType == 'medium') {
          return ele.confidence >= 90 && ele.confidence < 95;
        } else {
          return ele.confidence < 90;
        }
      })
    }
  }

  saveContent() {
    // if (this.selectedDocument.assignee && (this.selectedDocument.assignee != this.profile?.username)) {
    //   this.snackbarService.showSnackbar([`This document is locked by ${this.selectedDocument.assignee}`], undefined, SolventekConstants.MESSAGE_TYPES.ERROR);
    //   return;
    // }
    // let assignee = this.selectedDocument.assignee;
    // if (!this.selectedDocument.assignee || (this.selectedDocument.assignee == this.profile?.username)) {
    //   this.selectedDocument.assignee = this.profile?.username;
    //   this.selectedDocument.lastUpdatedDate = new Date().toISOString();
    //   this.selectedDocument.documentStatus = "progress";
    //   this.selectedDocumentData.completedBy = this.profile?.username;
    //   this.qualityReviewService.updateAssigneeInDocument(this.selectedDocumentId, this.selectedDocument).subscribe((data: any) => {
    //     if (data.id) {
    //       //API is succesfull
    //     }
    //     // this.snackbarService.showSnackbar([`This document is locked by ${this.selectedDocument.assignee}`], undefined, SolventekConstants.MESSAGE_TYPES.SUCCESS);
    //   })
    // }

    // this.displayFields.forEach(ele => {
    //   let index = this.fields.findIndex(field => field.name == ele.name);
    //   if (index != -1) {
    //     this.fields[index].updatedContent = ele.updatedContent;
    //   }
    // })

    // this.fields.forEach(ele => {
    //   this.selectedDocumentData.results.documents[0].fields[ele.name]['updatedContent'] = ele.updatedContent;
    // })
    // this.selectedDocumentData.lastUpdatedDate = new Date().toISOString();
    // this.qualityReviewService.updateFieldsInDocument(this.selectedDocumentId, this.selectedDocumentData).subscribe((data: any) => {
    //   if (data.id) {
    //     this.isFieldChanged = {};
    //     this.editSet = new Set();
    //     this.snackbarService.showSnackbar([`This document is now locked by ${this.selectedDocument.assignee}`, `Fields are now updated`], undefined, SolventekConstants.MESSAGE_TYPES.SUCCESS);
    //     if (!assignee) {
    //       this.updatePendingCount();
    //     }
    //   }
    // })
  }

  async submitContent() {

    // this.dialogService.openDialog(`Are you sure you want to submit this document, it will be marked as completed`,).subscribe(result => {
    //   if (result) {
    //     if (this.selectedDocument.assignee && (this.selectedDocument.assignee != this.profile?.username)) {
    //       this.snackbarService.showSnackbar([`This document is locked by ${this.selectedDocument.assignee}`], undefined, SolventekConstants.MESSAGE_TYPES.ERROR);
    //       return;
    //     }
    //     if (!this.selectedDocument.assignee || (this.selectedDocument.assignee == this.profile?.username)) {
    //       this.selectedDocument.assignee = this.profile?.username;
    //       this.selectedDocument.lastUpdatedDate = new Date().toISOString();
    //       this.selectedDocument.documentStatus = "completed";
    //       this.selectedDocumentData.completedBy = this.profile?.username;
    //       this.qualityReviewService.updateAssigneeInDocument(this.selectedDocumentId, this.selectedDocument).subscribe(data => {

    //       })
    //     }
    //     this.displayFields.forEach(ele => {
    //       let index = this.fields.findIndex(field => field.name == ele.name);
    //       if (index != -1) {
    //         this.fields[index].updatedContent = ele.updatedContent;
    //       }
    //     })

    //     this.fields.forEach(ele => {
    //       this.selectedDocumentData.results.documents[0].fields[ele.name]['updatedContent'] = ele.updatedContent;
    //     })
    //     this.selectedDocumentData.lastUpdatedDate = new Date().toISOString();
    //     this.selectedDocumentData.documentStatus = "completed";
    //     this.qualityReviewService.updateFieldsInDocument(this.selectedDocumentId, this.selectedDocumentData).subscribe(data => {
    //       if (data) {
    //         this.isFieldChanged = {};
    //         this.editSet = new Set();
    //         this.snackbarService.showSnackbar([`This document is completed by ${this.selectedDocument.assignee}`], undefined, SolventekConstants.MESSAGE_TYPES.SUCCESS);
    //       }
    //     })

    //   }
    // })
  }

  goToQualityReview() {
    this.qualityReviewService.selectedWorkflowId = this.selectedDocument.workflowId;
    this.qualityReviewService.selectedProjectId = this.selectedDocument.projectId;
  }


  editField(name: string) {
    this.editSet.add(name);
    let index = this.displayFields.findIndex(ele => ele.name == name);
    if (index != -1) {
      this.displayFields[index].updatedContent = this.displayFields[index].updatedContent ?? this.displayFields[index].content;
    }
  }


  ngAfterViewInit() {


  }

}
