import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListPage implements OnInit {
  queryTerm: string = '';
  remainCount: number = 0;
  totalInPrice: number = 0;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  onInput() {
  }

  onGotoAddingProduct() {
    this.router.navigate(['/product-add']);
  }
}
