import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ifError } from 'assert';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { ProductService } from 'src/app/shared/service/product.service';
import { CategoryNameEditPage } from './category-name-edit/category-name-edit.page';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.page.html',
  styleUrls: ['./category-edit.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryEditPage implements OnInit {
  mainIndex: number = -1;
  mainId: number = -1;

  mainName: string = '';
  subNames: [string, number][] = [];

  constructor(private category: MockCategoryService,
              private location: Location,
              private modalController: ModalController,
              private toast: ToastController,
              private activedRouter: ActivatedRoute,
              private products: ProductService,
              private alertController: AlertController) {
    this.activedRouter.queryParams.subscribe(params => {
      this.mainIndex = params['index'] || -1;
      this.update();
    });
    this.category.subcribe(() => this.update());
  }
  ngOnInit() {}

  private update() {
    const cats = this.category.getAll();
    this.mainName = cats.children[this.mainIndex]?.name || '';
    this.mainId = cats.children[this.mainIndex]?.id || -1;
    this.subNames.length = 0;
    for (const s of cats.children[this.mainIndex]?.children || []) {
      this.subNames.push([s.name, s.id]);
    }
  }

  private async presentModal(name: string) {
    const modal = await this.modalController.create({
      component: CategoryNameEditPage,
      componentProps: { value: name }
    });
    await modal.present();
    return modal.onWillDismiss();
  }

  async onEditName(subId: number) {
    let id;
    let oldname;
    if (subId == -1) {
      oldname = this.mainName;
      id = this.mainId;
    } else {
      oldname = this.subNames[subId][0];
      id = this.subNames[subId][1];
    }
    const { data } = await this.presentModal(oldname);
    if(data) {
      this.category.changeCategoryName(id, data);
      await this.category.save();
    }
  }

  async onDelete(subId: number) {
    let header = '你确认要删除吗!';
    let categoryId = (subId == -1) ? this.mainId : this.subNames[subId][1];
    const has_products = ((await this.products.getListByCategoryId(0, 1, categoryId)).products.length > 0);
    let msg = has_products ? '请先删除该类别下的所有商品记录' : '';
    let buttons = [
      {
        text: '取消',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
        }
      },
      {
        text: '确认',
        handler: () => {
          const ans = this.category.deleteCategory(categoryId);
          if (ans) {
            this.category.save().catch(() => { console.log("save error") });
            if (subId == -1) {
              this.location.back();
            }
          } else {
            this.toast.create({
              message: '删除失败',
              duration: 2000
            }).then(m => m.present());
          }
        }
      }
    ]
    if(has_products) {
      header = '删除失败';
      buttons.pop();
    }

    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: buttons
    });

    await alert.present();
  }
}
