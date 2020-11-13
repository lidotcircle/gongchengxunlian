import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProductInOutOfStockPage } from './product-in-out-of-stock.page';

describe('ProductInOutOfStockPage', () => {
  let component: ProductInOutOfStockPage;
  let fixture: ComponentFixture<ProductInOutOfStockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductInOutOfStockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInOutOfStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
