import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetrievePasswordPage } from './retrieve-password.page';

describe('RetrievePasswordPage', () => {
  let component: RetrievePasswordPage;
  let fixture: ComponentFixture<RetrievePasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrievePasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetrievePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
