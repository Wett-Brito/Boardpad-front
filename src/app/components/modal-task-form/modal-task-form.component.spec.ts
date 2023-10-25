import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTaskFormComponent } from './modal-task-form.component';

describe('ModalCreateTaskComponent', () => {
  let component: ModalTaskFormComponent;
  let fixture: ComponentFixture<ModalTaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTaskFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
