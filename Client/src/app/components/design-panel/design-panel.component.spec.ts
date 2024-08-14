import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPanelComponent } from './design-panel.component';

describe('DesignPanelComponent', () => {
  let component: DesignPanelComponent;
  let fixture: ComponentFixture<DesignPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignPanelComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DesignPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
