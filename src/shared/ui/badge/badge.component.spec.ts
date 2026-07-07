import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';
import { Component, signal } from '@angular/core';

@Component({
  template: `<app-badge [text]="text()" />`,
  imports: [BadgeComponent]
})
class TestHostComponent {
  text = signal('Test Badge');
}

describe('BadgeComponent', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render text input', () => {
    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent.trim()).toBe('Test Badge');
  });
});
