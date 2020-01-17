import { Injectable } from "@angular/core";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

import { AppDomains, GraphData, Graph } from "../models/app.model";
import { InsideBackendData, BackendData } from "../models/backend.model";
import { StateService } from "./state.service";
import { State } from "../models/app.enum";

@Injectable({
  providedIn: "root"
})
export class ChartsService {
  constructor(private stateService: StateService) {}

  createChartLabelDate(dateFrom: NgbDate, dateTo: NgbDate): string[] {
    const df = new Date(this.stateService.convertNgbDateToString(dateFrom));
    const dt = new Date(this.stateService.convertNgbDateToString(dateTo));

    const labels = [];
    for (let i = df; i <= dt; df.setDate(df.getDate() + 1)) {
      const newDate = df.toISOString().slice(0, 10);
      labels.push(newDate);
    }

    return labels;
  }

  createChartPieLabel(data: any): string[] {
    const arr = [];
    data.data.forEach((el: any) => {
      if (el.name.osName) arr.push(el.name.osName);
      if (el.name.platform && el.count > 0) arr.push(el.name.platform);
    });

    return arr;
  }

  createChartLabelTime(): string[] {
    return [...Array(24).keys()].map(
      (num: any) => `${num.toString().padStart(2, "0")}:00`
    );
  }

  createChartEventsLabel(data: any): string[] {
    return data.data.map((el: any) => Object.keys(el.events));
  }

  getColorArr(data: any[]): string[] {
    const colorArr = [];
    let counter = 0;
    for (let i = 0; i < data.length; i++) {
      if (counter === 0) colorArr.push("#9AB0A6");
      if (counter === 1) colorArr.push("#A4E5FF");
      if (counter === 2) colorArr.push("#374B42");
      if (counter === 3) {
        colorArr.push("#66AEFF");
        counter = -1;
      }
      counter++;
    }
    return colorArr;
  }

  createChartBarBubbleAll(
    data: any,
    domains: AppDomains[],
    labels: string[]
  ): Graph[] {
    const chartData: Graph[] = [];

    domains.forEach((domain: AppDomains) => {
      const tempData = [];
      for (const label of labels) {
        tempData.push(JSON.parse(JSON.stringify({ x: label, y: 0, r: 0 })));
      }
      const domainId = domain.id;
      const filteredData = data.filter(
        (el: any) => el.data.domainId === domainId
      );

      filteredData.forEach((domainData: BackendData) => {
        const hour = domainData.data.id.hour;
        const index = labels.indexOf(`${hour}:00`);

        tempData[index].x = hour;
        tempData[index].y += domainData.data.time / 1000;
        tempData[index].r += domainData.data.count;
      });
      chartData.push({
        domainId,
        data: {
          data: tempData,
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      });
    });

    return chartData;
  }

  createChartBarLineAll(
    data: any,
    domains: AppDomains[],
    labels: string[]
  ): Graph[] {
    const chartData: Graph[] = [
      {
        domainId: "combined",
        data: {
          data: new Array(labels.length).fill(0),
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      }
    ];

    domains.forEach((domain: AppDomains) => {
      const tempData = new Array(labels.length).fill(0);
      const domainId = domain.id;
      const filteredData = data.filter(
        (el: any) => el.data.domainId === domainId
      );

      filteredData.forEach((domainData: BackendData) => {
        if (domainData.data.id.hour) {
          const hour = domainData.data.id.hour;
          const index = labels.indexOf(`${hour}:00`);
          tempData[index] = domainData.data.count;
          chartData[0].data.data[index] += domainData.data.count;
        }
      });
      chartData.push({
        domainId,
        data: {
          data: tempData,
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      });
    });

    return chartData;
  }

  createChartBarDataAll(
    data: any,
    domains: AppDomains[],
    labels: string[]
  ): Graph[] {
    const chartData: Graph[] = [
      {
        domainId: "combined",
        data: {
          data: new Array(labels.length).fill(0),
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      }
    ];

    domains.forEach((domain: AppDomains) => {
      const tempData = new Array(labels.length).fill(0);
      const domainId = domain.id;
      const filteredData = data.filter(
        (el: any) => el.data.domainId === domainId
      );

      filteredData.forEach((domainData: BackendData) => {
        if (domainData.data.id.day) {
          const date = this.stateService.convertNgbDateToString(
            domainData.data.id as NgbDate
          );
          const index = labels.indexOf(date);
          tempData[index] =
            domainData.data.count || domainData.data.average / 1000;

          chartData[0].data.data[index] +=
            domainData.data.count || domainData.data.average / 1000;
        }
      });
      chartData.push({
        domainId,
        data: {
          data: tempData,
          backgroundColor: "#6e7373",
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      });
    });

    if (this.stateService.state$.value === State.durations) {
      chartData[0].data.data.forEach(
        (value: number, i: number) =>
          (chartData[0].data.data[i] = Math.round(value / domains.length))
      );
    }

    return chartData;
  }

  configureChartEvents(data: any): any {
    const chartData = [];
    const chart = data.data.map((el: any) => Object.values(el.events));

    chart.forEach((el: any) => {
      const colorArr = this.getColorArr(el);

      chartData.push([
        {
          data: el,
          backgroundColor: colorArr,
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      ]);
    });

    return chartData;
  }

  configureChartPie(datas: any): any {
    const chartData = [];
    let dataArr = datas.data.map((x: any) => x.count);
    if (dataArr[0] === undefined) {
      dataArr = datas.data.map((x: any) => Object.values(x));
      dataArr = dataArr.filter((x: any) => x[0] !== 0);
    }
    dataArr = dataArr.filter((num: number) => num > 0);
    const colorArr = this.getColorArr(dataArr);
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
}
