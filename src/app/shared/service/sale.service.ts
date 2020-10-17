import { Injectable } from '@angular/core';
import { randomInt } from '../utils/utils.module';

export interface ISaleData {
  Yesterday: number;
  Today: number;

  LastSevenDay: number;
  LastMonth: number;

  LastYearSevenDay: number;
  LastYearMonth: number;
}


class SaleData implements ISaleData {
  Yesterday: number = 0;
  Today: number = 0;

  LastSevenDay: number = 0;
  LastMonth: number = 0;

  LastYearSevenDay: number = 0;
  LastYearMonth: number = 0;
}

const singleDayMax = 10000;
@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private saleData: SaleData;

  constructor() {
    this.saleData = new SaleData();

    this.saleData.Today = randomInt(singleDayMax);
    this.saleData.Yesterday = randomInt(singleDayMax);

    this.saleData.LastSevenDay = randomInt(singleDayMax * 7);
    this.saleData.LastMonth = randomInt(singleDayMax * 30);

    this.saleData.LastYearSevenDay = randomInt(singleDayMax * 7);
    this.saleData.LastYearMonth = randomInt(singleDayMax * 30);
  }

  getSaleData(): SaleData {
    return this.saleData;
  }
}
