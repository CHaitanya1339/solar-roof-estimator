import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { Chart } from 'chart.js/auto';
import {FormBuilder, FormGroup, FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { catchError, Observable, throwError } from 'rxjs';
import { BuildingInsightsResponse } from '../solar';
import { HttpClient } from '@angular/common/http';
import { SolarPanelConfig } from '../solar';



@Component({
  selector: 'app-solar-analysis',
  templateUrl: './solar-analysis.component.html',
  standalone: true,
  styleUrls: ['./solar-analysis.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class SolarAnalysisComponent implements OnInit {
  @Input() solarPanelConfigs!: SolarPanelConfig[];
  buildingInsights!: BuildingInsightsResponse;

  
  updateBuildingInsights(insights: BuildingInsightsResponse) {
    this.buildingInsights = insights;
    this.solarPanelConfigs = insights.solarPotential.solarPanelConfigs

  }


constructor(private http: HttpClient, private fb: FormBuilder) {}  


  ngOnInit() {
}

}