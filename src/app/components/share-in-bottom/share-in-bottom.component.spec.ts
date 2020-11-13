import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShareInBottomComponent } from './share-in-bottom.component';

describe('ShareInBottomComponent', () => {
  let component: ShareInBottomComponent;
  let fixture: ComponentFixture<ShareInBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareInBottomComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShareInBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
