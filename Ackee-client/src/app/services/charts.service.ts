import { Injectable } from "@angular/core";
import { ViewsData } from "../models/backend.model";

@Injectable({
  providedIn: "root"
})
export class ChartsService {
  constructor() {}

  createChartLabel(numberOfDays: number): string[] {
    const arr = [];
    for (let i = numberOfDays; i >= 0; i--) {
      arr.push((new Date().getDate() - i).toString());
    }
    return arr;
  }

  configureChart(
    data: any,
    domainsLength: number,
    numberOfDays: number,
    label: any
  ): any {
    // Initializing the Charts Data
    const dataArrAll = [];
    for (let i = 0; i < domainsLength + 1; i++) {
      dataArrAll.push(new Array(numberOfDays).fill(0.1));
    }

    // Creating Arrays with the real Charts Data Values
    data.data.forEach((viewsData: any, i: number) => {
      viewsData.forEach((viewData: ViewsData) => {
        const diffDays = 13 - this.getDiffDays(viewData.id);
        if (dataArrAll[0][diffDays] === 0.1) {
          dataArrAll[0][diffDays] = 0;
          "";
        }
        if (dataArrAll[i + 1][diffDays] === 0.1) {
          dataArrAll[i + 1][diffDays] = 0;
        }
        if (viewData.count) {
          dataArrAll[0][diffDays] += viewData.count;
          dataArrAll[i + 1][diffDays] += viewData.count;
        } else if (viewData.average) {
          dataArrAll[0][diffDays] += Math.floor(viewData.average / 1000 / 2);
          dataArrAll[i + 1][diffDays] += Math.floor(viewData.average / 1000 / 2);
        }
      });
    });

    // Creating Charts Data
    const chartData = [];
    const chartOptions = [];
    dataArrAll.forEach((data: number[], i: number) => {
      chartOptions[i] = this.setChartOptions(label);
      chartData.push([
        {
          data: data,
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      ]);
      chartOptions[i].scales.yAxes[0].ticks.max = Math.max(...data);
      if (chartOptions[i].scales.yAxes[0].ticks.max === 0.1) {``
        chartOptions[i].scales.yAxes[0].ticks.max = 10;
      } else {
        if ((chartOptions[i].scales.yAxes[0].ticks.max & 1) !== 0) {
          chartOptions[i].scales.yAxes[0].ticks.max +=
            Math.round(chartOptions[i].scales.yAxes[0].ticks.max * 0.1) + 1;
        } else {
          chartOptions[i].scales.yAxes[0].ticks.max += Math.round(
            chartOptions[i].scales.yAxes[0].ticks.max * 0.1
          );
        }
      }
    });
    return {
      chartData,
      chartOptions
    };
  }

  getDiffDays(id: { day: number; month: number; year: number }): number {
    const day = new Date(id.year, id.month, id.day);
    const t = new Date();
    const today = new Date(t.getFullYear(), t.getMonth() + 1, t.getDate());
    return Math.round(Math.abs((+day - +today) / (24 * 60 * 60 * 1000)));
  }

  setChartOptions(label: any): any {
    const chartOptions = {
      responsive: true,
      drawBorder: false,
      gridLines: {
        drawBorder: false
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              padding: 10,
              fontSize: 16
            },
            gridLines: {
              display: true,
              drawBorder: false
            }
          }
        ]
      },
      tooltips: {
        enabled: true,
        mode: "x-axis",
        yAlign: "bottom",
        backgroundColor: "#fff",
        titleFontSize: 20,
        titleFontColor: "#333",
        xPadding: 10,
        cornerRadius: 0,
        titleMarginBottom: 0,
        callbacks: {
          title: (tooltipItem: any) => {
            return +tooltipItem[0].value === 0.1 ? "0" : tooltipItem[0].value;
          },
          label: (tooltipItem: any) => {
            label.id = tooltipItem.index;
            label.xLabel = tooltipItem.xLabel;
            return;
          }
        }
      }
      // hover: {
      //   onHover: () => {
      //     this.chartSubTitle[i] = label.xLabel;
      //     // TODO: Update Color on hover
      //     // this.chartData[i][0].backgroundColor.forEach((_, j: number) => {
      //     //   this.chartData[i][0].backgroundColor[j] = "#6e7373";
      //     // });
      //     // this.chartData[i][0].backgroundColor[this.label.id] = "#73fac8";
      //   }
      // }
    };
    return chartOptions;
  }
}
