import { Location } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MockCategoryService } from 'src/app/shared/service/mock-category.service';
import { StaticValue } from 'src/app/shared/static-value/static-value.module';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddItemPage implements OnInit {
  mainIndex: number = -1;
  title: string = '新增分类';
  mainName: string = '';
  subNames: string [] = [''];
  subNames_DUP: string [] = [''];

  constructor(private router: ActivatedRoute,
              private category: MockCategoryService,
              private location: Location,
              private toast: ToastController) {
    this.router.queryParams.subscribe(params => {
      this.mainIndex = params["main-index"] || -1;
      if(this.mainIndex >= 0) {
        this.title = "新增小分类";
        this.mainName = this.category.getAll().children[this.mainIndex]?.name || '';
        this.category.subcribe(() => {
          this.mainName = this.category.getAll().children[this.mainIndex]?.name || '';
        });
      }
    });
  }

  addSubCat() {
    this.subNames.push('');
    this.subNames_DUP.push('');
  }

  async onConfirm(): Promise<boolean> {
    let par: StaticValue.Category = null;
    if(this.mainIndex < 0) {
      par = new StaticValue.Category();
      par.name = this.mainName;
      const ans = this.category.addCategory(this.category.getAll().id, par);
      if(!ans) {
        this.toast.create({
          message: `保存失败，${par.name}已经存在，请修改重试`,
          duration: 2000
        }).then(t => t.present());
        return false;
      }
    } else {
      par = this.category.getAll().children[this.mainIndex];
    }

    for(let n of this.subNames_DUP) {
      if(n.length == 0) continue;
      let c = new StaticValue.Category();
      c.name = n;
      if (!this.category.addCategory(par.id, c)) {
        this.toast.create({
          message: `保存失败，${n}已经存在，请修改重试`,
          duration: 2000
        }).then(t => t.present());
        if(this.mainIndex < 0) {
          this.mainIndex = this.category.getAll().children.length - 2;
          this.mainName = this.category.getAll().children[this.mainIndex].name;
          this.title = '新增分类';
        }
        return false;
      }
    }

    await this.category.save();
    setTimeout(() => this.location.back(), 0);
    return true;
  }

  ngOnInit() {
  }
}
