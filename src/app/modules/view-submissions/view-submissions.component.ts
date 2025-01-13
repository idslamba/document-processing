import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonService } from '../../shared/services/common.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QualityServiceService } from '../../shared/services/quality-service.service';


@Component({
  selector: 'app-view-submissions',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatIconModule, MatInputModule,MatPaginator ,MatPaginatorModule, CommonModule, RouterLink, RouterLinkActive, RouterOutlet, NgxSkeletonLoaderModule
    , MatTooltipModule],
  templateUrl: './view-submissions.component.html',
  styleUrl: './view-submissions.component.scss'
})

export class ViewSubmissionsComponent implements OnInit, OnDestroy {
  isOpen = false;
  projectName = new FormControl('', [Validators.required]);
  projectDescription = new FormControl('', [Validators.required]);
  search = new FormControl('');
  editIndex: number = -1;
  subscription: Array<Subscription> = [];
  length: number = 0;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15];
  pageEvent!: PageEvent;
  dataSource: Array<any> = [];
  showSkeleton: boolean = true;
  filteredDataList: Array<any> = [];
  noFilteredData: boolean = false;
  dataSourceTable: Array<any> = [];
  sortingData: any = { 1: { sort: '' }, 2: { sort: '' } };

  constructor(private snackbarService: SnackbarService, private commonService: CommonService,private qualityService: QualityServiceService) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.commonService.getDocumentsList().subscribe({
      next: (res: any) => {
        if (res?.length) {
          this.dataSource = res.filter((ele: any) => ele.active);
          this.length = this.dataSource.length;
          this.dataSourceTable = this.dataSource.slice(this.pageSize * this.pageIndex, this.pageSize * (this.pageIndex + 1))

        }
        this.showSkeleton = false;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }





  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    // this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.dataSourceTable = this.dataSource.slice(this.pageSize * this.pageIndex, this.pageSize * (this.pageIndex + 1))
  }

  normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  setProject(index: number) {
    if (index >= 0) {
    }
  }

  selectProject(index: number) {
    if (index >= 0) {
    }
  }

  sortDoucment(fieldType: number) {

    // if (this.sortingData[fieldType]?.sort == 'asc') {
    //   this.sortingData[fieldType]['sort'] = 'desc';
    // } else {
    //   this.sortingData[fieldType]['sort'] = 'asc';
    // }

    // switch (fieldType) {
    //   case 1: {
    //     if (this.sortingData[fieldType].sort == 'asc') {
    //       this.dataSource = this.dataSource.sort((a, b) => {
    //         return a.name > b.name ? 1 : -1;
    //       })
    //     }
    //     if (this.sortingData[fieldType].sort == 'desc') {
    //       this.dataSource = this.dataSource.sort((a, b) => {
    //         return a.name > b.name ? -1 : -1;
    //       })
    //     }
    //     this.sortingData[2].sort = "";
    //     break;
    //   }
    //   case 2: {
    //     if (this.sortingData[fieldType].sort == 'asc') {
    //       this.dataSource = this.dataSource.sort((a, b) => {
    //         return new Date(a.createdDate).getTime() > new Date(b.createdDate).getTime() ? 1 : -1;
    //       })
    //     }
    //     if (this.sortingData[fieldType].sort == 'desc') {
    //       this.dataSource = this.dataSource.sort((a, b) => {
    //         return new Date(a.createdDate).getTime() > new Date(b.createdDate).getTime() ? -1 : -1;
    //       })
    //     }
    //     this.sortingData[1].sort = "";
    //     break;
    //   }
    // }
    this.handlePageEvent({
      length: this.length,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  selectDocument(index: number) {
    this.qualityService.selectedDocument = this.dataSourceTable[index];
  }

  ngOnDestroy(): void {
    this.subscription.forEach(ele => {
      ele.unsubscribe();
    })
  }

}