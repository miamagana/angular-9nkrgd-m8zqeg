import { Component } from "@angular/core";
import { Chart, Highcharts } from "angular-highcharts";
import { data } from "./data";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  chart: Chart;
  combinedChart: Chart;

  constructor() {
    Highcharts.setOptions({
      lang: {
        shortMonths: [
          "Jan",
          "Fév",
          "Mas",
          "Av",
          "Mai",
          "Juin",
          "Jui",
          "Aoû",
          "Sep",
          "Oct",
          "Nov",
          "Déc"
        ]
      }
    });
  }

  ngOnInit() {
    this.initChart();
    this.initCombinedChart();
  }

  getData() {
    return data.map(entry => {
      const res = [];
      res.push(Date.parse(entry.datetime));
      res.push(!!entry.usage ? entry.usage / 60 : entry.usage);
      return res;
    });
  }

  getCombinedData(key: string) {
    return data.map(entry => {
      const res = [];
      res.push(Date.parse(entry.datetime));
      res.push(entry[key]);
      return res;
    });
  }

  initChart() {
    this.chart = new Chart({
      chart: {
        type: "column"
      },
      title: {
        text: "Usage"
      },
      xAxis: {
        type: "datetime"
      },
      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: "h"
      },
      yAxis: {
        opposite: true,
        title: {
          text: ""
        },
        tickPositions: [0, 4, 8, 12, 16, 20, 24],
        max: 24,
        plotBands: [
          {
            className: "red-region",
            color: "#FF0000",
            from: 4,
            to: 24
          }
        ],
        plotLines: [
          {
            color: "#FF0000",
            value: 4,
            width: 1,
            zIndex: 5
          }
        ]
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          minPointLength: 4,
          pointPadding: 0.2,
          groupPadding: 0,
          borderWidth: 0,
          shadow: false
        },
        series: {
          events: {
            legendItemClick: function(e: any) {
              e.preventDefault();
            }
          }
        }
      },
      series: [
        {
          name: "Usage (h)",
          data: this.getData()
        },
        {
          name: "No data",
          data: null,
          visible: false
        }
      ]
    });
  }

  initCombinedChart() {
    this.combinedChart = new Chart({
      chart: {
        type: "column"
      },
      title: {
        text: "Leaks"
      },
      xAxis: {
        type: "datetime"
      },
      tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: " L/min"
      },
      yAxis: {
        opposite: true,
        title: {
          text: ""
        },
        tickPositions: [0, 20, 40, 60, 80, 100],
        max: 24,
        plotBands: [
          {
            className: "red-region",
            color: "#FF0000",
            from: 24,
            to: 100
          }
        ],
        plotLines: [
          {
            color: "#FF0000",
            value: 24,
            width: 1,
            zIndex: 5
          }
        ]
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        column: {
          minPointLength: 4,
          pointPadding: 0.2,
          groupPadding: 0,
          borderWidth: 0,
          shadow: false,
          grouping: false
        },
        series: {
          events: {
            legendItemClick: function(e: any) {
              e.preventDefault();
            }
          }
        }
      },
      series: [
        {
          name: "LK_95 (L/min)",
          data: this.getCombinedData("nonIntentionalLeaks95"),
          color: "#ADD8FF"
        },
        {
          name: "LK_50 (L/min)",
          data: this.getCombinedData("nonIntentionalLeaks50")
        },
        {
          name: "No data",
          data: null,
          visible: false
        }
      ]
    });
  }
}
