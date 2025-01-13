import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { AngularSplitModule } from 'angular-split';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, NgxSkeletonLoaderModule, MatCheckboxModule, FormsModule, MatFormFieldModule, AngularSplitModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideNativeDateAdapter()]

})

export class DashboardComponent implements OnInit, OnDestroy {

  private root1!: am5.Root;
  private root2!: am5.Root;
  private root3!: am5.Root;
  private root4!: am5.Root; dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.getDate();

      // Highlight the 1st and 20th day of each month.
      return date === 100 || date === 200 ? 'example-custom-date-class' : '';
    }

    return '';
  };
  ngOnInit(): void {
    this.createChart("chartdiv1", this.root1);
    this.createChart("chartdiv2", this.root2);
    this.createChart("chartdiv3", this.root3);
    this.createChart("chartdiv4", this.root4);

  }

  private createChart(divId: string, root: am5.Root): void {
    root = am5.Root.new(divId);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      })
    );

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category"
      })
    );

    series.data.setAll([
      { category: "Category 1", value: 40 },
      { category: "Category 2", value: 30 },
      { category: "Category 3", value: 20 },
      { category: "Category 4", value: 10 }
    ]);

    series.slices.template.setAll({
      fillGradient: am5.LinearGradient.new(root, {
        stops: [
          { color: am5.color(0x845EC2), offset: 0 },
          { color: am5.color(0xD65DB1), offset: 0.5 },
          { color: am5.color(0xFF6F91), offset: 1 }
        ]
      })
    });

    series.slices.template.set("strokeOpacity", 0);
  }

  ngOnDestroy(): void {
    if (this.root1) {
      this.root1.dispose();
    }
    if (this.root2) {
      this.root2.dispose();
    }
    if (this.root3) {
      this.root3.dispose();
    }
    if (this.root4) {
      this.root4.dispose();
    }
  }
}

