import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {

  selectA: boolean = true;
  selectB: boolean = false;
  selectC: boolean = false;

  onClickA() {
    this.selectA = true;
    this.selectB = false;
    this.selectB = false;
  }
  onClickB() {
    this.selectA = false;
    this.selectB = true;
    this.selectB = false;
  }
  onClickC() {
    this.selectA = false;
    this.selectB = false;
    this.selectB = true;
  }

  constructor() { }

  ngOnInit() {
  }

  onAddClick(_) {
    console.log("click add button")
  }
}
