import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

describe('Component: App', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));


});
