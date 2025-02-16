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
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';


interface ParsedData {
  key: string;
  page: number;
  confidence: number;
  value: string;
  updatedValue?: string;
  children?: ParsedData[];
}

@Component({
  selector: 'app-selected-document',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule, MatIconModule,
    NgxSkeletonLoaderModule, RouterLink, MatPaginatorModule, MatTreeModule, MatDialogModule, AngularSplitModule],
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
  pagesDimensions: Array<{ index: number, dimension: { height: number, width: number }, unit: string }> = [];
  rectangle: { x: number, y: number, width: number, height: number } = { x: 0, y: 0, width: 0, height: 0 };
  selectedConfidenceType: string = "";
  editSet: Set<string> = new Set();
  parsedData: Array<ParsedData> = [];
  displayParsedData: Array<ParsedData> = [];
  treeControl = new NestedTreeControl<ParsedData>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ParsedData>();
  hasChild = (_: number, node: ParsedData) => !!node.children && node.children.length > 0;
  content: any = {};
  updatedContent: any = {};



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
        this.totalPages = [];
        this.pagesDimensions = [];
        this.selectedDocument = data[0];
        this.parsedData = this.processData(this.selectedDocument.result);
        this.displayParsedData = JSON.parse(JSON.stringify(this.parsedData));
        this.dataSource.data = this.displayParsedData;
        console.log(this.displayParsedData);
        this.isFieldChanged = {};
      }
      this.showSkeleton = false;
    })
  }

  processData(parsedData: any): ParsedData[] {
    const result: ParsedData[] = [];
    Object.keys(parsedData).forEach((key: string) => {
      const { value = '', confidence = -1, page = 0, updatedValue = '' } = parsedData[key] || {};
      if (confidence >= 0) {
        result.push({
          key,
          confidence,
          value,
          page,
          updatedValue
        });
        this.content[key] = value;
        this.updatedContent[key] = updatedValue;
      } else if (parsedData[key] && Object.keys(parsedData[key]).length) {
        const children = this.processData(parsedData[key]);
        const averageConfidence = children.reduce((sum, child) => sum + child.confidence, 0) / children.length;
        result.push({
          key,
          confidence: +averageConfidence.toFixed(2),
          value: "",
          children,
          updatedValue: "",
          page: 0
        });
      }
    });
    return result;
  }

  convertArrayToObject(parsedDataArray: ParsedData[]): Record<string, any> {
    const result: Record<string, any> = {};
    parsedDataArray.forEach((item: ParsedData) => {
      if (item.children && item.children.length > 0) {
        result[item.key] = this.convertArrayToObject(item.children);
      } else {
        result[item.key] = {
          value: item.value,
          confidence: item.confidence,
          page: item.page,
          updatedValue: item.updatedValue
        };
      }
    });
    return result;
  }

  async getPDFCode() {
    this.http.get(`https://solventek-document-ai.azurewebsites.net/api/download/${this.selectedDocument.id}`, {
      responseType: 'arraybuffer',
      headers: {
        'x-functions-key': "9lmWqLpl9CH6f8vfhZaG2IoN7Be7GMZTDuj-P75umrh8AzFusnUS8Q=="
      }
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

  confidenceChanged(node: ParsedData) {
    setTimeout(() => {
      if (node.value != node.updatedValue) {
        this.isFieldChanged[node.key] = true;
        this.showUpdateButton = true;
      }
    }, 100);
  }

  resetContent(node: ParsedData) {
    node.updatedValue = node.value;
    this.isFieldChanged[node.key] = false;
    this.showUpdateButton = false;
    this.editSet.delete(node.key);

    Object.values(this.isFieldChanged).forEach(ele => {
      if (ele) {
        this.showUpdateButton = true;
      }
    })
  }

  restoreFieldData(name: string) {
    // let index = this.displayFields.findIndex(ele => ele.name == name);
    // if (index != -1) {
    //   this.displayFields[index].updatedContent = this.displayFields[index].content;
    //   this.isFieldChanged[this.displayFields[index].name] = false;
    //   this.editSet.delete(name);
    //   this.showUpdateButton = false;
    //   Object.values(this.isFieldChanged).forEach(ele => {
    //     if (ele) {
    //       this.showUpdateButton = true;
    //     }
    //   })
    // }
  }

  async highlightField(index: number) {
    // if (this.seletedPage != this.displayFields[index].boundingRegions[0].pageNumber) {
    //   this.seletedPage = this.displayFields[index].boundingRegions[0].pageNumber;
    // }
    // await this.renderPage(this.seletedPage);
    // if (this.displayFields[index]?.boundingRegions[0]?.polygon?.length == 4) {
    //   const canvas = document.getElementById('canvas') as any;
    //   const width = canvas.width;
    //   const height = canvas.height;
    //   const widthRatio = width / this.pagesDimensions[this.seletedPage - 1].dimension.width;
    //   const heightRatio = height / this.pagesDimensions[this.seletedPage - 1].dimension.height;
    //   const contextX = this.displayFields[index].boundingRegions[0].polygon[0].x * widthRatio;
    //   const contextY = this.displayFields[index].boundingRegions[0].polygon[0].y * heightRatio;
    //   this.scrollToPoint(contextX, contextY);
    //   const context = canvas.getContext('2d');
    //   context.beginPath();
    //   context.lineWidth = 2;
    //   context.strokeStyle = "red";
    //   context.moveTo(this.displayFields[index].boundingRegions[0].polygon[0].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[0].y * heightRatio);
    //   context.lineTo(this.displayFields[index].boundingRegions[0].polygon[1].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[1].y * heightRatio);
    //   context.lineTo(this.displayFields[index].boundingRegions[0].polygon[2].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[2].y * heightRatio);
    //   context.lineTo(this.displayFields[index].boundingRegions[0].polygon[3].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[3].y * heightRatio);
    //   context.lineTo(this.displayFields[index].boundingRegions[0].polygon[0].x * widthRatio, this.displayFields[index].boundingRegions[0].polygon[0].y * heightRatio);
    //   context.stroke();
    // }
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
    this.dialogService.openDialog(`Are you sure you want to filter with confidence, tree will be reloaded and unsaved progress will be lost`,).subscribe(result => {
      if (result) {
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
          this.displayParsedData = JSON.parse(JSON.stringify(this.parsedData));
        } else {
          this.selectedConfidenceType = confidenceType;
          let confidenceThreshold: (confidence: number) => boolean;
          switch (confidenceType) {
            case 'low':
              confidenceThreshold = (confidence: number) => confidence < 90;
              break;
            case 'medium':
              confidenceThreshold = (confidence: number) => confidence >= 90 && confidence < 95;
              break;
            case 'high':
              confidenceThreshold = (confidence: number) => confidence >= 95;
              break;
            default:
              confidenceThreshold = () => true;
          }
          this.displayParsedData = this.filterNodesByConfidence(this.parsedData, confidenceThreshold);
        }
        this.dataSource.data = this.displayParsedData;
        console.log(this.displayParsedData)
      }
    })





  }

  filterNodesByConfidence(data: ParsedData[], confidenceThreshold: (confidence: number) => boolean): ParsedData[] {
    return data.reduce((filtered: ParsedData[], node: ParsedData) => {
      if (confidenceThreshold(node.confidence)) {
        if (node.children && node.children.length > 0) {
          const filteredChildren = this.filterNodesByConfidence(node.children, confidenceThreshold);
          if (filteredChildren.length > 0) {
            filtered.push({ ...node, children: filteredChildren });
          }
        } else {
          filtered.push(node);
        }
      }
      return filtered;
    }, []);
  }

  saveContent() {

    let obj = this.convertArrayToObject(this.parsedData);
    console.log(obj);
    if (Object.keys(obj)) {
      this.qualityReviewService.updateDocumentFields(this.selectedDocumentId, obj).subscribe((data: any) => {
        if (data) {
          this.snackbarService.showSnackbar(["Document updated successfully"], undefined, SolventekConstants.MESSAGE_TYPES.SUCCESS);
        }
      })
    }

    // if (this.selectedDocument.assignee && (this.selectedDocument.assignee != this.profile?.username)) {
    //   this.snackbarService.showSnackbar([`This document is locked by ${this.selectedDocument.assignee}`], undefined, SolventekConstants.MESSAGE_TYPES.ERROR);
    //   return;
    // }
    // let assignee = this.selectedDocument.assignee;
    // if (!this.selectedDocument.assignee || (this.selectedDocument.assignee == this.profile?.username)) {
    //   this.selectedDocument.assignee = this.profile?.username;
    //   this.selectedDocument.lastUpdatedDate = new Date().toISOString();
    //   this.selectedDocument.documentStatus = "progress";
    //   this.selectedDocument.completedBy = this.profile?.username;
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
    //   this.selectedDocument.results.documents[0].fields[ele.name]['updatedContent'] = ele.updatedContent;
    // })
    // this.selectedDocument.lastUpdatedDate = new Date().toISOString();
    // this.qualityReviewService.updateFieldsInDocument(this.selectedDocumentId, this.selectedDocument).subscribe((data: any) => {
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
    //       this.selectedDocument.completedBy = this.profile?.username;
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
    //       this.selectedDocument.results.documents[0].fields[ele.name]['updatedContent'] = ele.updatedContent;
    //     })
    //     this.selectedDocument.lastUpdatedDate = new Date().toISOString();
    //     this.selectedDocument.documentStatus = "completed";
    //     this.qualityReviewService.updateFieldsInDocument(this.selectedDocumentId, this.selectedDocument).subscribe(data => {
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


  editField(node: ParsedData) {
    this.editSet.add(node.key);
    node.updatedValue = node.updatedValue || node.value;
  }

  async handlePageEvent(e: PageEvent) {
    this.seletedPage = e.pageIndex + 1;
    await this.renderPage(this.seletedPage);
  }

  async pageSeleted(pageNumber: number) {
    this.seletedPage = pageNumber;
    await this.renderPage(pageNumber);
  }


  ngAfterViewInit() {


  }

}
