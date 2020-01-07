import { Injectable } from "@angular/core";

import { AppDomains } from "../models/app.model";
import { StateService } from "./state.service";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { Charts } from "../models/app.enum";

@Injectable({
  providedIn: "root"
})
export class ChartsService {
  constructor(private stateService: StateService) {}

  createChartLabel(type: Charts, numberOfDays?: number, data?: any): string[] {
    const arr = [];
    if (type === Charts.bar) {
      for (let i = numberOfDays; i >= 0; i--) {
        arr.push(
          (
            new Date(
              this.convertDateToString(this.stateService.toDate$.value)
            ).getDate() - i
          ).toString()
        );
      }
    } else if (type === Charts.pie) {
      data.data.forEach(el => {
        arr.push(el.id.osName);
      });
    }
    return arr;
  }

  getDaysAgo(index: number, numberOfDays: number = 0): string {
    let date: any = this.stateService.toDate$.value;
    date = new Date(`${date.month}/${date.day}/${date.year}`);
    date.setDate(date.getDate() - Math.abs(numberOfDays - index));
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  }

  configureChart(
    type: Charts,
    datas: any,
    domains?: AppDomains[],
    numberOfDays?: number
  ): any {
    const chartData = [];
    const chartOptions = [];

    if (type === Charts.bar) {
      // Initializing the Charts Data
      let dataArrAll = [{}];
      for (let i = 0; i < domains.length; i++) {
        dataArrAll.push({});
        for (let j = numberOfDays; j > -1; j--) {
          if (i === 0) {
            dataArrAll[0][this.getDaysAgo(numberOfDays, j)] = 0.1;
          }
          dataArrAll[i + 1][this.getDaysAgo(numberOfDays, j)] = 0.1;
        }
      }

      // Creating Arrays with the real Charts Data Values
      let time = false;
      domains.forEach((domain: AppDomains, i: number) => {
        const data = datas.data.filter(
          (e: AppDomains) => e.id === domain.id
        )[0];
        data.data.forEach((viewData: any) => {
          const fullDate = viewData.id;
          const daysAgo = `${fullDate.month
            .toString()
            .padStart(2, "0")}-${fullDate.day.toString().padStart(2, "0")}-${
            fullDate.year
          }`;
          if (dataArrAll[0][daysAgo]) {
            if (dataArrAll[0][daysAgo] === 0.1) {
              dataArrAll[0][daysAgo] = 0;
            }
            if (dataArrAll[i + 1][daysAgo] === 0.1) {
              dataArrAll[i + 1][daysAgo] = 0;
            }
            if (viewData.count) {
              dataArrAll[0][daysAgo] += viewData.count;
              dataArrAll[i + 1][daysAgo] += viewData.count;
            }
            if (viewData.average) {
              time = true;
              dataArrAll[0][daysAgo] += Math.floor(viewData.average / 1000 / 2);
              dataArrAll[i + 1][daysAgo] += Math.floor(
                viewData.average / 1000 / 2
              );
            }
          }
        });
      });

      // Creating Charts Data
      dataArrAll.forEach((data: any, i: number) => {
        chartOptions[i] = this.setChartOptions(numberOfDays);

        // Converting data to an Chart data (array of numbers)
        const sortedDays = this.sortArrayOfDate(data);
        const tempData = [];
        sortedDays.forEach((day: string) => {
          tempData.push(data[day]);
        });

        chartData.push([
          {
            data: tempData,
            backgroundColor: "#6e7373",
            hoverBackgroundColor: "#73fac8",
            hoverBorderColor: "#73fac8"
          }
        ]);
        chartOptions[i].scales.yAxes[0].ticks.max = Math.max(...tempData);
        if (chartOptions[i].scales.yAxes[0].ticks.max === 0.1) {
          chartOptions[i].scales.yAxes[0].ticks.max = 10;
        }
        if (time) {
          chartOptions[i].scales.yAxes[0].ticks.callback = (time: number) =>
            this.formatSecsAsMins(time);
          chartOptions[i].tooltips.callbacks.title = (tooltipItem: any) =>
            this.formatSecsAsMins(+tooltipItem[0].value);
        }
      });
    } else if (type === Charts.pie) {
      const dataArr = datas.data.map(x => x.count);
      chartData.push([
        {
          data: dataArr,
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      ]);
    }
    return {
      chartData,
      chartOptions
    };
  }

  convertDateToString(date: NgbDate): string {
    return `${date.month}/${date.day}/${date.year}`;
  }

  formatSecsAsMins(time: number): string {
    if (time === 0.1) return `0`;
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  sortArrayOfDate(data: any): any {
    return Object.keys(data).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
  }

  getDiffDays(id: { day: number; month: number; year: number }): number {
    const day = new Date(id.year, id.month, id.day);
    let t: any = this.stateService.toDate$.value;
    t = new Date(`${t.month}/${t.day}/${t.year}`);
    const today = new Date(t.getFullYear(), t.getMonth() + 1, t.getDate());
    return Math.round(Math.abs((+day - +today) / (24 * 60 * 60 * 1000)));
  }

  setChartOptions(numberOfDays: number): any {
    const chartOptions = {
      responsive: true,
      drawBorder: false,
      gridLines: {
        drawBorder: false
      },
      layout: {
        padding: {
          top: 60
        }
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
        titleFontSize: 24,
        titleFontColor: "#333",
        titleAlign: "center",
        bodyFontColor: "#333",
        xPadding: 10,
        cornerRadius: 0,
        titleMarginBottom: 0,
        displayColors: false,
        callbacks: {
          title: (tooltipItem: any) => {
            return +tooltipItem[0].value === 0.1 ? "0" : tooltipItem[0].value;
          },
          label: (tooltipItem: any) => {
            return this.getLabel(numberOfDays, tooltipItem.index);
          }
        }
      }
    };
    return chartOptions;
  }

  getLabel(numberOfDays: number, index: number): string {
    let date: any = this.stateService.toDate$.value;
    date = new Date(`${date.month}/${date.day}/${date.year}`);
    date.setDate(date.getDate() - Math.abs(numberOfDays - index));
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  }
}
