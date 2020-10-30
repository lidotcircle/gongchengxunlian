import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
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
  isSelect: boolean = false;

  category: StaticValue.Category;
  constructor(private categoryManagement: MockCategoryService,
              private actionSheetController: ActionSheetController,
              private router: Router,
              private activatedRouter: ActivatedRoute,
              private location: Location) {
    this.categoryManagement.subcribe(() => {
      this.category = this.categoryManagement.getAll();
    });
    this.category = this.categoryManagement.getAll();
    this.activatedRouter.queryParamMap.subscribe(params => {
      this.isSelect = !!params.get('select');
    })
  }

  private selectCategory(sub: StaticValue.Category) {
    console.log(`select ${JSON.stringify(sub)}`);
    if(this.isSelect) {
      this.categoryManagement.selectCategoryId.next({id: sub.id, name: sub.name});
      this.location.back();
    }
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
            this.onEditClick();
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {}
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
    if(n == this.subIndex || this.isSelect) {
      this.selectCategory(cat);
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

  onEditClick() {
    this.router.navigate(['category-edit'], {
      relativeTo: this.activatedRouter,
      queryParams: {
        index: this.mainIndex
      },
    })
  }
}
