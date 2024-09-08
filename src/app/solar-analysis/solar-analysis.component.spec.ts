import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolarAnalysisComponent } from './solar-analysis.component';

describe('SolarAnalysisComponent', () => {
  let component: SolarAnalysisComponent;
  let fixture: ComponentFixture<SolarAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolarAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolarAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
