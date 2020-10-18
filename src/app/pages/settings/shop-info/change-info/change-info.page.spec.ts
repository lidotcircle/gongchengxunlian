import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChangeInfoPage } from './change-info.page';

describe('ChangeInfoPage', () => {
  let component: ChangeInfoPage;
  let fixture: ComponentFixture<ChangeInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
