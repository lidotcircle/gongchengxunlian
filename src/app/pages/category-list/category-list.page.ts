import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.page.html',
  styleUrls: ['./category-list.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryListPage implements OnInit {
  mainIndex: number = 0;
  subIndex: number = -2;

  category: StaticValue.Category;
  constructor(private categoryManagement: MockCategoryService,
              private actionSheetController: ActionSheetController,
              private router: Router,
              private activatedRouter: ActivatedRoute) {
    this.categoryManagement.subcribe(() => {
      this.category = this.categoryManagement.getAll();
    });
    this.category = this.categoryManagement.getAll();
  }

  private selectCategory(sub: StaticValue.Category) {
    console.log(`select ${JSON.stringify(sub)}`);
  }

  getCurrentSummary() {
    const n = this.category.children[this.mainIndex]?.children.length || 0;
    return (n == 0 ? '当前没有商品分类' : `共有${n}种商品分类`);
  }

  async onPresentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '选择您的操作',
      buttons: [
        {
          text: '新增小分类',
          role: 'destructive',
          handler: () => {
            this.onAddSubClick();
          }
        }, {
          text: '编辑分类',
          handler: () => {
            console.log('Archive clicked');
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  onMainClick(n: number) {
    this.mainIndex = n;
    this.subIndex = -2;
  }
  onSubClick(n: number, cat: StaticValue.Category) {
    if(n == this.subIndex) {
      this.selectCategory(cat);
      return;
    }
    this.subIndex = n;
  }

  ngOnInit() {
  }

  onAddClick(_) {
    this.router.navigate(['./add-item'], {relativeTo: this.activatedRouter});
  }
  onAddSubClick() {
    this.router.navigate(['./add-item'], {
      relativeTo: this.activatedRouter, 
      queryParams: {'main-index': this.mainIndex}
    });
  }
}
