import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import { AngularSplitModule } from 'angular-split';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import * as am5index from "@amcharts/amcharts5/index";
import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5radar from "@amcharts/amcharts5/radar";
import  am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, NgxSkeletonLoaderModule, MatCheckboxModule, FormsModule, MatFormFieldModule, AngularSplitModule, MatDatepickerModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [provideNativeDateAdapter()]

})

export class DashboardComponent implements OnInit, OnDestroy {

  private readonly root1!: am5.Root;
  private readonly root2!: am5.Root;
  private readonly root3!: am5.Root;
  private readonly root4!: am5.Root;
  dateRange = new FormGroup({
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
    this.createRaisedProcessedChart("chartdiv1", this.root1);
    this.createGranyGradientPieChart("chartdiv2", this.root2);
    this.createLineColumnsMix("chartdiv3", this.root3);
    this.createSolidGaugeChart("chartdiv4", this.root4);

  }

  createSolidGaugeChart(divId: string, root: am5.Root) {
    root = am5.Root.new(divId);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/radar-chart/
    let chart = root.container.children.push(am5radar.RadarChart.new(root, {
      panX: false,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      innerRadius: am5.percent(20),
      startAngle: -90,
      endAngle: 180
    }));


    // Data
    let data = [{
      category: "Research",
      value: 80,
      full: 100,
      columnSettings: {
        fill: chart?.get("colors")?.getIndex(0)
      }
    }, {
      category: "Marketing",
      value: 35,
      full: 100,
      columnSettings: {
        fill: chart?.get("colors")?.getIndex(1)
      }
    }, {
      category: "Distribution",
      value: 92,
      full: 100,
      columnSettings: {
        fill: chart?.get("colors")?.getIndex(2)
      }
    }, {
      category: "Human Resources",
      value: 68,
      full: 100,
      columnSettings: {
        fill: chart?.get("colors")?.getIndex(3)
      }
    }];

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
    let cursor = chart.set("cursor", am5radar.RadarCursor.new(root, {
      behavior: "zoomX"
    }));

    cursor.lineY.set("visible", false);

    // Create axes and their renderers
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
    let xRenderer = am5radar.AxisRendererCircular.new(root, {
      //minGridDistance: 50
    });

    xRenderer.labels.template.setAll({
      radius: 10
    });

    xRenderer.grid.template.setAll({
      forceHidden: true
    });

    let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
      renderer: xRenderer,
      min: 0,
      max: 100,
      strictMinMax: true,
      numberFormat: "#'%'",
      tooltip: am5.Tooltip.new(root, {})
    }));


    let yRenderer = am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: "500",
      fontSize: 18,
      templateField: "columnSettings"
    });

    yRenderer.grid.template.setAll({
      forceHidden: true
    });

    let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "category",
      renderer: yRenderer
    }));

    yAxis.data.setAll(data);


    // Create series
    // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
    let series1 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "full",
      categoryYField: "category",
      fill: root.interfaceColors.get("alternativeBackground")
    }));

    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.08,
      strokeOpacity: 0,
      cornerRadius: 20
    });

    series1.data.setAll(data);


    let series2 = chart.series.push(am5radar.RadarColumnSeries.new(root, {
      xAxis: xAxis,
      yAxis: yAxis,
      clustered: false,
      valueXField: "value",
      categoryYField: "category"
    }));

    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: "{category}: {valueX}%",
      cornerRadius: 20,
      templateField: "columnSettings"
    });

    series2.data.setAll(data);

    // Animate chart and series in
    // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
  }

  createLineColumnsMix(divId: string, root: am5.Root) {
    root = am5.Root.new(divId);

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        layout: root.verticalLayout
      })
    );

    // Add scrollbar
    // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
    chart.set(
      "scrollbarX",
      am5.Scrollbar.new(root, {
        orientation: "horizontal"
      })
    );

    let data = [
      {
        year: "2016",
        income: 23.5,
        expenses: 21.1
      },
      {
        year: "2017",
        income: 26.2,
        expenses: 30.5
      },
      {
        year: "2018",
        income: 30.1,
        expenses: 34.9
      },
      {
        year: "2019",
        income: 29.5,
        expenses: 31.1
      },
      {
        year: "2020",
        income: 30.6,
        expenses: 28.2,
        strokeSettings: {
          stroke: chart?.get("colors")?.getIndex(1),
          strokeWidth: 3,
          strokeDasharray: [5, 5]
        }
      }
    ];

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xRenderer = am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      minGridDistance: 60
    });
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(data);

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        extraMax: 0.1,
        renderer: am5xy.AxisRendererY.new(root, {
          strokeOpacity: 0.1
        })
      })
    );


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/

    let series1 = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Income",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "income",
        categoryXField: "year",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name} in {categoryX}: {valueY} {info}"
        })
      })
    );

    series1.columns.template.setAll({
      tooltipY: am5.percent(10),
      templateField: "columnSettings"
    });

    series1.data.setAll(data);

    let series2 = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: "Expenses",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "expenses",
        categoryXField: "year",
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "horizontal",
          labelText: "{name} in {categoryX}: {valueY} {info}"
        })
      })
    );

    series2.strokes.template.setAll({
      strokeWidth: 3,
      templateField: "strokeSettings"
    });


    series2.data.setAll(data);

    series2.bullets.push(function () {
      return am5.Bullet.new(root, {
        sprite: am5.Circle.new(root, {
          strokeWidth: 3,
          stroke: series2.get("stroke"),
          radius: 5,
          fill: root.interfaceColors.get("background")
        })
      });
    });

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    // Add legend
    // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
    let legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );
    legend.data.setAll(chart.series.values);

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
    series1.appear();
  }

  createGranyGradientPieChart(divId: string, root: am5.Root) {
    root = am5.Root.new(divId);
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        endAngle: 270,
        layout: root.verticalLayout,
        innerRadius: am5.percent(60)
      })
    );
    /*
    var bg = root.container.set("background", am5.Rectangle.new(root, {
      fillPattern: am5.GrainPattern.new(root, {
        density: 0.1,
        maxOpacity: 0.2
      })
    }))
    
    */

    // Create series
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        endAngle: 270
      })
    );

    series.set("colors", am5.ColorSet.new(root, {
      colors: [
        am5.color(0x73556E),
        am5.color(0x9FA1A6),
        am5.color(0xF2AA6B),
        am5.color(0xF28F6B),
        am5.color(0xA95A52),
        am5.color(0xE35B5D),
        am5.color(0xFFA446)
      ]
    }))

    var gradient = am5.RadialGradient.new(root, {
      stops: [
        { color: am5.color(0x000000) },
        { color: am5.color(0x000000) },
        {}
      ]
    })

    series.slices.template.setAll({
      fillGradient: gradient,
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
      cornerRadius: 10,
      shadowOpacity: 0.1,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      shadowColor: am5.color(0x000000),
      fillPattern: am5.GrainPattern.new(root, {
        maxOpacity: 0.2,
        density: 0.5,
        colors: [am5.color(0x000000)]
      })
    })

    series.slices.template.states.create("hover", {
      shadowOpacity: 1,
      shadowBlur: 10
    })

    series.ticks.template.setAll({
      strokeOpacity: 0.4,
      strokeDasharray: [2, 2]
    })

    series.states.create("hidden", {
      endAngle: -90
    });

    // Set data
    // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
    series.data.setAll([{
      category: "Lithuania",
      value: 500
    }, {
      category: "Czechia",
      value: 300
    }, {
      category: "Ireland",
      value: 200
    }, {
      category: "Germany",
      value: 100
    }]);

    var legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15,
    }));
    legend.markerRectangles.template.adapters.add("fillGradient", function () {
      return undefined;
    })
    legend.data.setAll(series.dataItems);

    series.appear(1000, 100);
  }

  createRaisedProcessedChart(divId: string, root: am5.Root) {
    root = am5.Root.new(divId);
    root.setThemes([am5themes_Animated.new(root)]);
    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    let chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX",
      pinchZoomX: true
    }));
    chart?.get("colors")?.set("step", 3);
    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);


    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
    let xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
      maxDeviation: 0.3,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, { minorGridEnabled: true }),
      tooltip: am5.Tooltip.new(root, {})
    }));

    let yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      maxDeviation: 0.3,
      renderer: am5xy.AxisRendererY.new(root, {})
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    let series = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series 1",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value1",
      valueXField: "date",
      tooltip: am5.Tooltip.new(root, {
        labelText: "{valueX}: {valueY}\n{previousDate}: {value2}"
      })
    }));

    series.strokes.template.setAll({
      strokeWidth: 2
    });

    series?.get("tooltip")?.get("background")?.set("fillOpacity", 0.5);

    let series2 = chart.series.push(am5xy.LineSeries.new(root, {
      name: "Series 2",
      xAxis: xAxis,
      yAxis: yAxis,
      valueYField: "value2",
      valueXField: "date"
    }));
    series2.strokes.template.setAll({
      strokeDasharray: [2, 2],
      strokeWidth: 2
    });

    // Set date fields
    // https://www.amcharts.com/docs/v5/concepts/data/#Parsing_dates
    root.dateFormatter.setAll({
      dateFormat: "yyyy-MM-dd",
      dateFields: ["valueX"]
    });


    // Set data
    let data = [{
      date: new Date(2019, 5, 12).getTime(),
      value1: 50,
      value2: 48,
      previousDate: new Date(2019, 5, 5)
    }, {
      date: new Date(2019, 5, 13).getTime(),
      value1: 53,
      value2: 51,
      previousDate: "2019-05-06"
    }, {
      date: new Date(2019, 5, 14).getTime(),
      value1: 56,
      value2: 58,
      previousDate: "2019-05-07"
    }, {
      date: new Date(2019, 5, 15).getTime(),
      value1: 52,
      value2: 53,
      previousDate: "2019-05-08"
    }, {
      date: new Date(2019, 5, 16).getTime(),
      value1: 48,
      value2: 44,
      previousDate: "2019-05-09"
    }, {
      date: new Date(2019, 5, 17).getTime(),
      value1: 47,
      value2: 42,
      previousDate: "2019-05-10"
    }, {
      date: new Date(2019, 5, 18).getTime(),
      value1: 59,
      value2: 55,
      previousDate: "2019-05-11"
    }]

    series.data.setAll(data);
    series2.data.setAll(data);


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
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

