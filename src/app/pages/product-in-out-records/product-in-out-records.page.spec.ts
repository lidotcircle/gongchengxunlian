import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductInOutRecordsPage } from './product-in-out-records.page';

describe('ProductInOutRecordsPage', () => {
  let component: ProductInOutRecordsPage;
  let fixture: ComponentFixture<ProductInOutRecordsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInOutRecordsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInOutRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
