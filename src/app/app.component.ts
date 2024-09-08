import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { ButtonModule } from 'primeng/button';
import { PrimeNGConfig } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SolarAnalysisComponent } from "./solar-analysis/solar-analysis.component";
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMap, ButtonModule, CommonModule, MapMarker, HttpClientModule, SolarAnalysisComponent, InputTextModule, ProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [HttpClientModule]
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'solar-roof-estimator';
  center!: google.maps.LatLngLiteral | undefined;
  display!: google.maps.LatLngLiteral | undefined;
  showProgressBar: boolean = false;
  options: google.maps.MapOptions = {
    center: { lat: 40, lng: -100 },
    zoom: 4,
    mapTypeId: 'satellite'
   };
  buildingTitle: string = '';
  buildingInsights!: any;
  markerPosition!: google.maps.LatLngLiteral | undefined;

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild(SolarAnalysisComponent) solarAnalysisComponent!: SolarAnalysisComponent;

  constructor(private primengConfig: PrimeNGConfig, private http: HttpClient) { }

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng?.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng?.toJSON();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.searchInput.nativeElement, {
      types: ['geocode']
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        this.center = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        this.markerPosition = this.center;
        this.options = {
          ...this.options,
          center: this.center,
          zoom: 45,
          tilt: 0,
          mapTypeId: 'satellite'
        };
        this.buildingTitle = place.name || 'No title available';
        this.getBuildingInsights(this.center.lat, this.center.lng);
      }
    });
  }

  onAddressEntered(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement?.value || '';
    // Trigger the getBuildingInsights method when an address is entered
    if (this.center) {
      this.getBuildingInsights(this.center.lat, this.center.lng);
    }
  }

  getBuildingInsights(lat: number, lng: number) {
    const apiKey = 'AIzaSyBgBzxUb1STGGRI4gMGooODJYRVG_yUK9o';
    const solarApiUrl = `https://solar.googleapis.com/v1/buildingInsights:findClosest?location.latitude=${lat}&location.longitude=${lng}&requiredQuality=HIGH&key=${apiKey}`;

    this.http.get(solarApiUrl).subscribe(
      (data: any) => {
        this.showProgressBar = true;
        console.log('Solar API Response:', data);
        this.buildingInsights = data;
        // Pass the building insights to the SolarAnalysisComponent
        if (this.solarAnalysisComponent) {
          this.solarAnalysisComponent.updateBuildingInsights(this.buildingInsights);
          this.showProgressBar = false;
        }
      },
      (error) => {
        console.error('Error fetching solar data:', error);
      }
    );
  }
}