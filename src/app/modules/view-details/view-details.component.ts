import { CommonModule, } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { QualityServiceService } from '../../shared/services/quality-service.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { CommonService } from '../../shared/services/common.service';
import { DialogService } from '../../shared/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeNestedDataSource, MatTreeModule } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

interface ParsedData {
  key: string;
  confidence: number;
  value: string;
  children?: ParsedData[];
}

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, MatExpansionModule, MatIconModule, MatTreeModule],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.scss'
})
export class ViewDetailsComponent implements OnInit {
  selectedDocumentId: string = "";
  selectedDocument: any;
  currentExtraction: string = "json";
  parsedData: Array<ParsedData> = [];
  expandedParsedData:Set<string> = new Set<string>();
  constructor(private qualityReviewService: QualityServiceService, private http: HttpClient,
    private snackbarService: SnackbarService, private route: ActivatedRoute, private commonService: CommonService, private dialogService: DialogService) { }

  ngOnInit(): void {
    this.selectedDocumentId = this.route.snapshot.paramMap.get('id') || "";
    this.getDocumentDetails(this.selectedDocumentId);
  }

  getDocumentDetails(documentId: string) {
    this.qualityReviewService.docDetails(documentId).subscribe({
      next: (res: any) => {
        if (res?.length) {
          this.selectedDocument = res[0];
          console.log(this.selectedDocument, this.selectedDocument.result);
          const parsedData =this.selectedDocument.result;
          Object.keys(parsedData).forEach((key: string) => {
            if (parsedData[key]['value']?.length && parsedData[key]['confidence'] >= 0) {
              this.parsedData.push({
                key: key,
                confidence: parsedData[key]['confidence'],
                value: parsedData[key]['value']
              });
            } else if (Object.keys(parsedData[key]).length) {
              const children: any = [];
              Object.keys(parsedData[key]).forEach((childKey: string) => {
                if (parsedData[key][childKey] && parsedData[key][childKey]['value']?.length && parsedData[key][childKey]['confidence'] >= 0) {
                  children.push({
                    key: childKey,
                    confidence: parsedData[key][childKey]['confidence'],
                    value: parsedData[key][childKey]['value']
                  });
                }

              });
              this.parsedData.push({
                key: key,
                confidence: 100,
                value: "",
                children: children
              });

            }

          })
        } 
        console.log(this.parsedData)
      },
      error: (err) => {
        console.log(err);
      }

    });
  }

  viewDocument() {

  }

  extractionChanged() {
    if (this.currentExtraction === "json") {
      this.currentExtraction = 'csv';
    } else {
      this.currentExtraction = 'json';
    }
  }

}