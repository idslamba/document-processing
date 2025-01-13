import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { ProgressBarComponent } from '../../shared/components/progress-bar/progress-bar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatTooltipModule,
    MatIconModule, MatSidenavModule, MatFormFieldModule, MatSelectModule, ProgressBarComponent, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav', { static: false }) snav!: any;
  menus: Array<{ title: string, routerLink: string, id: number }> = [
    { title: 'Dashboard', routerLink: 'dashboard', id: 1},
    { title: 'Upload Document', routerLink: 'upload-document', id: 2},
    { title: 'View Submissions', routerLink: 'view-submissions', id: 3},
    { title: 'Reports', routerLink: 'reports', id: 4},
  ];
  selectedMenu: number = 1;
  selectedChildMenu: number = 0;
  subscription: Array<Subscription> = [];
  breadcrumbs: Array<any> = [];
  shortForm: string = "";
  constructor( private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      const url = window.location.pathname;
      const selectedMenu = url.split("/")[1];
      if (selectedMenu?.length) {
        let index = this.menus.findIndex(ele => ele.routerLink == selectedMenu);
        if (index != -1) {
          this.selectedMenu = this.menus[index].id;
        }
      }
    }, 2000);
  }

  /**
   * This method opens and closed the left menu
   */
  openMenu() {
    this.snav.toggle();
  }

  changeMenu(index: number) {
    if (index >= 0) {
      this.selectedMenu = this.menus[index].id;
      this.selectedChildMenu = 0;
      this.snav.toggle();
      this.router.navigate([this.menus[index].routerLink]);

    }
  }

  changeRoute(index: number) {
    if (index != this.breadcrumbs.length) {
      switch (index) {
        case 0: {
          this.router.navigate(["/project-mapping"]);
          break;
        }
        case 1: {
          this.router.navigate([`/project-mapping/${this.breadcrumbs[index].id}`]);
          break;
        }
      }
    }
  }

  navigate(routerLink: string, event: any): void {
    this.router.navigate([routerLink]);
    event.stopPropagation();
  }

  logout() {
  }

  ngOnDestroy(): void {
    this.subscription.forEach(ele => {
      ele.unsubscribe();
    })
  }

}
