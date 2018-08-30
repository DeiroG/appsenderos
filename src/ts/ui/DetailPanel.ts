
import * as Point from "esri/geometry/Point";
import * as dom from "dojo/dom";
import * as on from "dojo/on";
import * as domConstruct from "dojo/dom-construct";
import * as domClass from "dojo/dom-class";
import config from "../config";

declare const AmCharts: any;

import "amcharts3";
import "amcharts3/amcharts/serial";

import "../../style/detail-panel.scss";

import "font-awesome/scss/font-awesome.scss";

import { State, Trail } from "../types";

export default class SelectionPanel {

  trails: Array<Trail>;
  state: State;
  container: any;
  detailTitle: any;
  detailInfograph: any;
  detailElevationProfile: any;
  detailDescription: any;

  constructor(trails, state: State) {
    this.state = state;
    this.trails = trails;
    this.container = dom.byId("detailPanel");
    this.detailTitle = dom.byId("detailTitle");
    this.detailInfograph = dom.byId("detailInfograph");
    this.detailDescription = dom.byId("detailDescription");
    this.detailElevationProfile = dom.byId("detailElevationProfile");

    this.emptyDetails();

    state.watch("selectedTrailId", (id) => {
      this.emptyDetails();
      if (id) {
        const selectedTrail = this.trails.filter((trail) => { return trail.id === id; })[0];
        this.displayInfo(selectedTrail);
      }
    });

    state.watch("device", () => {
      if (!this.state.selectedTrailId) {
        this.displayAppInfo();
      }
    });
  }

  emptyDetails() {
    domConstruct.empty(this.detailTitle);
    domConstruct.empty(this.detailDescription);
    domConstruct.empty(this.detailInfograph);
    domConstruct.empty(this.detailElevationProfile);

    this.displayAppInfo();
  }

  displayAppInfo() {
    if (this.state.device === "mobilePortrait") {
      this.detailInfograph.innerHTML = "Esta aplicación muestra los senderos en el Parque Nacional el Cocuy. Seleccione un sendero en el mapa para obtener más información al respecto.";
    } else {
      this.detailInfograph.innerHTML = "Seleccione un sendero en el mapa o en el panel de senderos para ver más detalles al respecto.";
    }
  }

  displayInfo(trail: Trail): void {

    this.detailTitle.innerHTML = trail.name;
    this.createInfograph(trail);
    this.detailDescription.innerHTML = `<b>Particularidades: </b> ${ trail.description }`;

    // create the elevation profile
    if (trail.profileData) {
      this.createChart(trail.profileData);
    } else {
      if (this.state.online) {
        trail.setElevationValuesFromService()
          .then(() => {
            this.createChart(trail.profileData);
          });
      }
    }
  }

  createInfograph(trail) {

    const status = {
      Cerrado: {
        icon: "fa fa-calendar-times-o",
        text: "Cerrado"
      },
      Abierto: {
        icon: "fa fa-calendar-check-o",
        text: "Abierto"
      }
    };

    this.detailInfograph.innerHTML = `
      ${trail.ascent ? `<span class="infograph"><span class="fa fa-line-chart" aria-hidden="true"></span> ${trail.ascent} m</span>` : ""}
      ${trail.difficulty ? `<span class="infograph"><span class="fa fa-wrench" aria-hidden="true"></span> ${trail.difficulty}</span>` : ""}
      ${trail.walktime ? `<span class="infograph"><span class="fa fa-clock-o" aria-hidden="true"></span> ${trail.walktime} hr</span>` : ""}
      ${trail.status ? `<span class="infograph"><span class="${status[trail.status].icon}" aria-hidden="true"></span> ${status[trail.status].text}</span>` : ""}
    `;

  }

  createChart(data) {

    const chart = AmCharts.makeChart(this.detailElevationProfile, {
      type: "serial",
      theme: "light",
      dataProvider: data,
      color: "#4b4b4b",
      fontFamily: "Open Sans Condensed",
      balloon: {
        borderAlpha: 0,
        fillAlpha: 0.8,
        fillColor: config.colors.selectedTrail,
        shadowAlpha: 0
      },
      graphs: [{
        id: "g1",
        balloonText: "Distancia: <b>[[category]] km</b><br>}Elevación:<b>[[value]] m</b>",
        fillAlphas: 0.2,
        bulletAlpha: 0,
        lineColor: config.colors.selectedTrail,
        lineThickness: 1,
        valueField: "value"
      }],
      chartCursor: {
        limitToGraph: "g1",
        categoryBalloonEnabled: false,
        zoomable: false
      },
      categoryField: "length",
      categoryAxis: {
        gridThickness: 0,
        axisThickness: 0.1
      },
      valueAxes: [{
        strictMinMax: true,
        autoGridCount: false,
        minimum: 3000,
        maximum: 6000,
        axisThickness: 0,
        tickLength: 0
      }]
    });

    const popup = this.state.view.popup;

    chart.addListener("changed", (e) => {
      if (e.index) {
        const data = e.chart.dataProvider[ e.index ];
        popup.dockEnabled = false;
        popup.open({
          title: data.value + " m",
          location: new Point({
            spatialReference: { wkid: 4326 },
            longitude: data.point[0],
            latitude: data.point[1],
            z: data.point[2]
          })
        });
      } else {
        popup.close();
      }
    });
  }

}

