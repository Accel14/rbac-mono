import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Login } from './login';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing"

fdescribe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, provideHttpClientTesting()],
    })
      .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
