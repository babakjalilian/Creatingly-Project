import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondElementComponent } from './top-bar.component';

describe('SecondElementComponent', () => {
  let component: SecondElementComponent;
  let fixture: ComponentFixture<SecondElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondElementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SecondElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
