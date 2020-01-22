import { Injectable } from "@angular/core";
import { NgbDate } from "@ng-bootstrap/ng-bootstrap";

import { State } from "../models/app.enum";
import { AppDomains, Graph } from "../models/app.model";
import { BackendData } from "../models/backend.model";
import { StateService } from "./state.service";
import { languageList } from "../../assets/list";

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

  createChartPieLabel(data: any): string[][] {
    const chartLabels = [];
    this.stateService.domains.forEach((domain: AppDomains) => {
      chartLabels.push(
        data
          .filter((el: any) => el.domainId === domain.id)
          .map((el: any) => el.id)
      );
    });

    return chartLabels;
  }

  createChartLabelTime(): string[] {
    return [...Array(24).keys()].map(
      (num: any) => `${num.toString().padStart(2, "0")}:00`
    );
  }

  createChartEventsLabel(data: any): string[] {
    return data.map((el: any) => Object.keys(el.events));
  }

  createChartEventSingle(data: any): any {
    const chartData = [];
    const chart = data.map((el: any) => Object.values(el.events));

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

  createChartPieAll(data: any, labels: string[][]): any {
    const chartData: any = [];

    this.stateService.domains.forEach((domain: AppDomains, i: number) => {
      const domainEntries = data.filter((el: any) => el.domainId === domain.id);
      const label = labels[i];
      const tempArr = [];
      label.forEach((l: string) => {
        tempArr.push(domainEntries.filter((el: any) => el.id === l)[0].count);
      });

      const colorArr = this.getColorArr(tempArr);

      chartData.push([
        {
          data: tempArr,
          backgroundColor: colorArr,
          hoverBackgroundColor: "#73fac8",
          hoverBorderColor: "#73fac8"
        }
      ]);
    });

    return chartData;
  }

  createChartTableAll(data: any): any {
    const chartData: any = [];
    let siteLocation = "";

    this.stateService.domains.forEach((domain: AppDomains) => {
      const tempData = [];
      if (this.stateService.state$.value === State.pages) {
        const filteredArr = data.filter((el: any) => el.domainId === domain.id);
        if (filteredArr.length > 0) siteLocation = filteredArr[0].siteLocation;
        filteredArr.forEach((el: any) => {
          el.data.forEach((domainData: any) => {
            tempData.push({
              page: domainData.page,
              count: domainData.count
            });
          });
        });
        chartData.push({
          domainId: domain.id,
          siteLocation,
          data: tempData
        });
      } else if (this.stateService.state$.value === State.languages) {
        const filteredArr = data.filter(
          (el: any) => el.data.domainId === domain.id
        );
        filteredArr.forEach((el: any) => {
          tempData.push({
            language: languageList[el.data.id].nativeName.split(",")[0],
            count: el.data.count
          });
        });
        chartData.push({
          domainId: domain.id,
          data: tempData
        });
      }
    });

    return chartData;
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

    const weightedAvg = {};

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
          if (this.stateService.state$.value === State.views) {
            tempData[index] = domainData.data.count;
            chartData[0].data.data[index] += domainData.data.count;
          }

          if (this.stateService.state$.value === State.durations) {
            tempData[index] = (domainData.data.average / 1000 / 60).toFixed(2);
            if (!weightedAvg[index]) {
              weightedAvg[index] = [];
            }
            weightedAvg[index].push({
              count: domainData.data.count,
              average: Number((domainData.data.average / 1000).toFixed(2))
            });
          }
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

    for (const index in weightedAvg) {
      let formula = "";
      let counter = 0;
      weightedAvg[index].forEach(
        (avg: { count: number; average: number }, i: number) => {
          if (i === 0) formula += `(`;
          formula += `${avg.average} * ${avg.count}`;
          if (i !== weightedAvg[index].length - 1) formula += ` + `;
          counter += avg.count;
        }
      );
      formula += `) / ${counter}`;
      chartData[0].data.data[index] = (eval(formula) / 60).toFixed(2);
    }

    console.log("chartData :", chartData);
    return chartData;
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
}
