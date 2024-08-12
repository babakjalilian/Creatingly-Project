import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignAreaComponent } from './design-area.component';

describe('DesignAreaComponent', () => {
  let component: DesignAreaComponent;
  let fixture: ComponentFixture<DesignAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
