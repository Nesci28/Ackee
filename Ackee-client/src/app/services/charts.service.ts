import { Injectable } from "@angular/core";

import { AppDomains } from "../models/app.model";
import { StateService } from "./state.service";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

@Injectable({
  providedIn: "root"
})
export class ChartsService {
  constructor(private stateService: StateService) {}

  createChartBarLabel(numberOfDays: number): string[] {
    const arr = [];
    for (let i = numberOfDays; i >= 0; i--) {
      arr.push(
        (
          new Date(new Date().toUTCString().substr(0, 25)).getDate() - i
        ).toString()
      );
    }

    return arr;
  }

  createChartPieLabel(data: any): string[] {
    const arr = [];
    data.data.forEach((el: any) => {
      if (el.name.osName) arr.push(el.name.osName);
      if (el.name.platform && el.count > 0) arr.push(el.name.platform);
    });

    return arr;
  }

  createChartBubbleOrLineLabel(): string[] {
    return [...Array(24).keys()].map(
      (num: any) => `${num.toString().padStart(2, "0")}:00`
    );
  }

  configureChartBar(
    datas: any,
    domains: AppDomains[],
    numberOfDays: number
  ): any {
    const chartData = [];
    const chartOptions = [];

    const datesArray = [];
    for (let i = numberOfDays; i >= 0; i--) {
      const date = new Date(new Date().toUTCString().substr(0, 25));
      date.setDate(date.getDate() - i);
      datesArray.push(
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      );
    }
    const tempArr = [];
    domains.forEach((domain: AppDomains, i: number) => {
      if (i === 0) {
        tempArr.push(new Array(numberOfDays + 1).fill(0));
      }
      tempArr.push(new Array(numberOfDays + 1).fill(0));
      const data = datas.data.filter((dt: any) => dt.id === domain.id)[0];
      data.data.forEach((el: any) => {
        const index = datesArray.indexOf(
          `${el.id.year}-${el.id.month}-${el.id.day}`
        );
        if (index > -1) {
          tempArr[0][index] += el.count || el.average / 1000;
          tempArr[i + 1][index] += el.count || el.average / 1000;
        }
      });
    });

    tempArr.forEach((data: any, i: number) => {
      chartOptions[i] = this.setChartOptions(numberOfDays);
      chartData.push([
        {
          data: data,
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      ]);
    });

    return {
      chartData,
      chartOptions
    };
  }

  configureChartPie(datas: any): any {
    const chartData = [];
    let dataArr = datas.data.map((x: any) => x.count);
    if (dataArr[0] === undefined) {
      dataArr = datas.data.map((x: any) => Object.values(x));
      dataArr = dataArr.filter((x: any) => x[0] !== 0);
    }
    dataArr = dataArr.filter((num: number) => num > 0);
    const colorArr = [];
    let counter = 0;
    for (let i = 0; i < dataArr.length; i++) {
      if (counter === 0) colorArr.push("#9AB0A6");
      if (counter === 1) colorArr.push("#A4E5FF");
      if (counter === 2) colorArr.push("#374B42");
      if (counter === 3) {
        colorArr.push("#66AEFF");
        counter = -1;
      }
      counter++;
    }
    chartData.push([
      {
        data: dataArr,
        backgroundColor: colorArr,
        hoverBackgroundColor: "#73fac8",
        hoverBorderColor: "#73fac8"
      }
    ]);

    return {
      chartData
    };
  }

  configureChartBubble(data: any, date: NgbDate): any {
    const chartData = [];
    const chartOptions = [];

    data.data.forEach((domainData: any) => {
      const arr = [];
      domainData.data.forEach((dateData: any) => {
        const sameDate = dateData.created.filter((el: string) =>
          this.compareDate(el, date)
        );
        if (sameDate.length > 0) {
          sameDate.forEach((d: string) => {
            const time = new Date(d).getHours();
            arr.push({
              x: time,
              y: dateData.id / 1000 / 60,
              r: sameDate.length
            });
          });
        }
      });
      chartData.push({
        domainId: domainData.id,
        data: {
          data: arr,
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      });
    });

    return {
      chartData,
      chartOptions
    };
  }

  configureChartLine(data: any, date: NgbDate): any {
    const tempChartData = [];
    const chartData = [];
    const chartOptions = [];

    data.data.forEach((el: any, i: number) => {
      if (i === 0) {
        tempChartData[0] = Array(24).fill(0);
      }
      const selectedDateData = el.data.filter(
        (x: any) =>
          x.id.day === date.day &&
          x.id.month === date.month &&
          x.id.year === date.year
      );
      if (selectedDateData.length === 0) {
        tempChartData[i + 1] = Array(24).fill(0);
      }
      selectedDateData.forEach((e: any, j: number) => {
        if (j === 0) {
          tempChartData[i + 1] = Array(24).fill(0);
        }
        tempChartData[0][+e.id.hour] += e.count;
        tempChartData[i + 1][+e.id.hour] += e.count;
      });
    });

    tempChartData.forEach((data: any, i: number) => {
      chartData.push([
        {
          data: data,
          borderColor: "#73fac8",
          backgroundColor: "rgba(115, 250, 200, 0.3)",
          pointBackgroundColor: "#73fac8"
        }
      ]);
    });

    return {
      chartData,
      chartOptions
    };
  }

  compareDate(date1: string, date2: NgbDate): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(this.stateService.convertNgbDateToString(date2));

    return (
      this.stateService.convertDateToString(d1) ===
      this.stateService.convertDateToString(d2)
    );
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
    date = new Date(this.stateService.convertNgbDateToString(date));
    date.setDate(date.getDate() - Math.abs(numberOfDays - index));
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  }
}
