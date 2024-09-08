import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChartModule } from 'primeng/chart';
import { BuildingInsightsResponse, SolarPanelConfig, findSolarConfig } from '../solar';
import { NgbCollapseModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';


declare var google: any;

@Component({
  selector: 'app-solar-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionModule, ButtonModule, InputNumberModule, ChartModule, NgbCollapseModule, NgbAlertModule],
  templateUrl: './solar-analysis.component.html',
  styleUrls: ['./solar-analysis.component.scss']
})
export class SolarAnalysisComponent implements OnInit, AfterViewInit {
  @Input() buildingInsights!: BuildingInsightsResponse;
  @ViewChild('costChart') costChart!: ElementRef;

  showInsights: boolean = false;
  showAdvancedSettings: boolean = false;
  activeSection: 'building' | 'solar' | null = null;

  toggleSection(section: 'building' | 'solar') {
    if (this.activeSection === section) {
      this.activeSection = null;
    } else {
      this.activeSection = section;
    }
  }
  buildingInsightsData = [
    {
      icon: 'pi pi-sun',
      name: 'Annual sunshine',
      value: () => this.showNumber(this.buildingInsights?.solarPotential?.maxSunshineHoursPerYear),
      units: 'hr',
    },
    {
      icon: 'pi pi-th-large',
      name: 'Roof area',
      value: () => this.showNumber(this.buildingInsights?.solarPotential?.wholeRoofStats?.areaMeters2),
      units: 'm²',
    },
    {
      icon: 'pi pi-bolt',
      name: 'Max panel count',
      value: () => this.showNumber(this.buildingInsights?.solarPotential?.solarPanels?.length),
      units: 'panels',
    },
    {
      icon: 'pi pi-cloud',
      name: 'CO₂ savings',
      value: () => this.showNumber(this.buildingInsights?.solarPotential?.carbonOffsetFactorKgPerMwh),
      units: 'Kg/MWh',
    },
  ];


  panelsCount = 20;
  yearlyEnergyDcKwh = 12000;
  solarPanelConfigs!: SolarPanelConfig[];
  configId: number = 0;

  // Basic settings
  monthlyAverageEnergyBillInput: number = 300;
  energyCostPerKwhInput: number = 0.31;
  panelCapacityWattsInput: number = 400;
  solarIncentives: number = 7000;
  installationCostPerWatt: number = 4.0;
  installationLifeSpan: number = 20;

  // Advanced settings
  dcToAcDerateInput: number = 0.85;
  efficiencyDepreciationFactor: number = 0.995;
  costIncreaseFactor: number = 1.022;
  discountRate: number = 1.04;

  // Calculated values
  defaultPanelCapacityWatts: number = 400;
  panelCapacityRatio: number = 1.0;
  installationSizeKw: number = 0;
  installationCostTotal: number = 0;
  monthlyKwhEnergyConsumption: number = 0;
  yearlyKwhEnergyConsumption: number = 0;
  initialAcKwhPerYear: number = 0;
  yearlyProductionAcKwh: number[] = [];
  yearlyUtilityBillEstimates: number[] = [];
  remainingLifetimeUtilityBill: number = 0;
  totalCostWithSolar: number = 0;
  yearlyCostWithoutSolar: number[] = [];
  totalCostWithoutSolar: number = 0;
  savings: number = 0;
  energyCovered: number = 0;
  breakEvenYear: number = -1;


  solarAnalysis = [
    {
      icon: 'fa fa-envira',
      name: 'Yearly Energy',
      value: () => (this.showNumber(1234)),
      units: 'kWh'
    },
    {
      icon: 'fa fa-fighter-jet',
      name: 'Installation size',
      value: () => (this.showNumber(this.installationSizeKw)),
      units: 'kW',
    },
    {
      icon: 'fa fa-money',
      name: 'Installation cost',
      value: () => (this.showMoney(this.installationCostTotal)),
    },
    {
      icon: 'fa fa-battery-full',
      name: "Energy Covered",
      value: () => (Math.round(this.energyCovered * 100))
    }
  ]

  analysisChart = [
    {
      icon: 'pi pi-wallet',
      name: 'Cost without Solar',
      value: () => (this.showMoney(this.totalCostWithoutSolar))
    },
    {
      icon: 'pi pi-sun',
      name: 'Cost with Solar',
      value: () => (this.showMoney(this.totalCostWithSolar))
    },
    {
      icon: 'fa fa-money',
      name: 'Savings',
      value: () => (this.showMoney(this.savings))
    },
    {
      icon: 'fa fa-balance-scale',
      name: 'Break even',
      value: 
      () => (this.breakEvenYear >= 0 ? `${this.breakEvenYear + new Date().getFullYear() + 1} in ${this.breakEvenYear + 1}` : '--'),
      units: 'years'
    }

  ]

  ngOnInit() {
    this.updateCalculations();
  }

  ngAfterViewInit() {
    this.loadGoogleCharts();
  }

  updateCalculations() {
    this.panelCapacityRatio = this.panelCapacityWattsInput / this.defaultPanelCapacityWatts;
    this.installationCostTotal = this.installationCostPerWatt * this.installationSizeKw * 1000;

    if (this.solarPanelConfigs && this.solarPanelConfigs[this.configId]) {
      this.installationSizeKw = (this.solarPanelConfigs[this.configId].panelsCount * this.panelCapacityWattsInput) / 1000;
    }

    this.monthlyKwhEnergyConsumption = this.monthlyAverageEnergyBillInput / this.energyCostPerKwhInput;
    this.yearlyKwhEnergyConsumption = this.monthlyKwhEnergyConsumption * 12;

    if (this.solarPanelConfigs && this.solarPanelConfigs[this.configId]) {
      this.initialAcKwhPerYear = this.solarPanelConfigs[this.configId].yearlyEnergyDcKwh * this.panelCapacityRatio * this.dcToAcDerateInput;
    }

    this.yearlyProductionAcKwh = [...Array(this.installationLifeSpan).keys()].map(
      (year) => this.initialAcKwhPerYear * this.efficiencyDepreciationFactor ** year
    );

    this.yearlyUtilityBillEstimates = this.yearlyProductionAcKwh.map((yearlyKwhEnergyProduced, year) => {
      const billEnergyKwh = this.yearlyKwhEnergyConsumption - yearlyKwhEnergyProduced;
      const billEstimate = (billEnergyKwh * this.energyCostPerKwhInput * this.costIncreaseFactor ** year) / this.discountRate ** year;
      return Math.max(billEstimate, 0);
    });

    this.remainingLifetimeUtilityBill = this.yearlyUtilityBillEstimates.reduce((x, y) => x + y, 0);
    this.totalCostWithSolar = this.installationCostTotal + this.remainingLifetimeUtilityBill - this.solarIncentives;

    this.yearlyCostWithoutSolar = [...Array(this.installationLifeSpan).keys()].map(
      (year) => (this.monthlyAverageEnergyBillInput * 12 * this.costIncreaseFactor ** year) / this.discountRate ** year
    );

    this.totalCostWithoutSolar = this.yearlyCostWithoutSolar.reduce((x, y) => x + y, 0);
    this.savings = this.totalCostWithoutSolar - this.totalCostWithSolar;

    this.energyCovered = this.yearlyProductionAcKwh[0] / this.yearlyKwhEnergyConsumption;

    this.calculateBreakEvenYear();
    this.updateChart();
  }

  calculateBreakEvenYear() {
    let costWithSolar = 0;
    const cumulativeCostsWithSolar = this.yearlyUtilityBillEstimates.map(
      (billEstimate, i) => (costWithSolar += i == 0 ? billEstimate + this.installationCostTotal - this.solarIncentives : billEstimate)
    );
    let costWithoutSolar = 0;
    const cumulativeCostsWithoutSolar = this.yearlyCostWithoutSolar.map(
      (cost) => (costWithoutSolar += cost)
    );
    this.breakEvenYear = cumulativeCostsWithSolar.findIndex(
      (costWithSolar, i) => costWithSolar <= cumulativeCostsWithoutSolar[i]
    );
  }

  updateConfig() {
    this.monthlyKwhEnergyConsumption = this.monthlyAverageEnergyBillInput / this.energyCostPerKwhInput;
    this.yearlyKwhEnergyConsumption = this.monthlyKwhEnergyConsumption * 12;
    this.panelCapacityRatio = this.panelCapacityWattsInput / this.defaultPanelCapacityWatts;
    this.configId = findSolarConfig(
      this.solarPanelConfigs,
      this.yearlyKwhEnergyConsumption,
      this.panelCapacityRatio,
      this.dcToAcDerateInput
    );
  }

  loadGoogleCharts() {
    google.charts.load('current', { packages: ['corechart', 'line'] });
    google.charts.setOnLoadCallback(this.updateChart.bind(this));
  }

  updateChart() {
    if (!this.costChart || !google.visualization) return;

    const year = new Date().getFullYear();
    let costWithSolar = 0;
    const cumulativeCostsWithSolar = this.yearlyUtilityBillEstimates.map(
      (billEstimate, i) => (costWithSolar += i == 0 ? billEstimate + this.installationCostTotal - this.solarIncentives : billEstimate)
    );
    let costWithoutSolar = 0;
    const cumulativeCostsWithoutSolar = this.yearlyCostWithoutSolar.map(
      (cost) => (costWithoutSolar += cost)
    );

    const data = google.visualization.arrayToDataTable([
      ['Year', 'Solar', 'No solar'],
      [year.toString(), 0, 0],
      ...cumulativeCostsWithSolar.map((_, i) => [
        (year + i + 1).toString(),
        cumulativeCostsWithSolar[i],
        cumulativeCostsWithoutSolar[i],
      ]),
    ]);

    const options = {
      title: `Cost analysis for ${this.installationLifeSpan} years`,
      width: 350,
      height: 200,
    };

    const chart = new google.visualization.LineChart(this.costChart.nativeElement);
    chart.draw(data, options);
  }

  showNumber(value: number | undefined): string {
    return value?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? 'N/A';
  }

  showMoney(value: number): string {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }

  toggleAdvancedSettings() {
    this.showAdvancedSettings = !this.showAdvancedSettings;
  }

  updateBuildingInsights(insights: BuildingInsightsResponse) {
    this.buildingInsights = insights;
    this.showInsights = true;
    this.solarPanelConfigs = this.buildingInsights.solarPotential.solarPanelConfigs;
    this.updateCalculations();
  }

  getBreakEvenText(): string {
    return this.breakEvenYear >= 0
      ? `${this.breakEvenYear + new Date().getFullYear() + 1} in ${this.breakEvenYear + 1}`
      : '--';
  }
}