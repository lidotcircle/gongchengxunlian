import { Injectable } from '@angular/core';
import { callCordovaPlugin } from '@ionic-native/core/decorators/common';
import { Observable, Subject } from 'rxjs';
import { StaticValue } from '../static-value/static-value.module';
import { ClientAccountManagerService, HookType } from './client-account-manager.service';

const default_x = [
  {
    id: 1,
    name: '电脑整机',
    children: [
      {
        id: 11,
        name: '笔记本',
        children: []
      },
      {
        id: 12,
        name: '台式机',
        children: []
      },
      {
        id: 13,
        name: '平板电脑',
        children: []
      }
    ]
  },
  {
    id: 2,
    name: '电脑配件',
    children: [
      {
        id: 21,
        name: 'CPU',
        children: []
      },
      {
        id: 22,
        name: '内存',
        children: []
      }
    ]
  },
  {
    id: 3,
    name: '外设产品',
    children: [
      {
        id: 31,
        name: '鼠标',
        children: []
      },
      {
        id: 32,
        name: '键盘',
        children: []
      },
      {
        id: 33,
        name: 'U盘',
        children: []
      }
    ]
  },
  {
    id: 4,
    name: '网络产品',
    children: [
      {
        id: 41,
        name: '路由器',
        children: []
      },
      {
        id: 42,
        name: '交换机',
        children: []
      },
      {
        id: 43,
        name: '网卡',
        children: []
      },
      {
        id: 44,
        name: '网络配件',
        children: []
      }
    ]
  },
  {
    id: 0,
    name: '默认分类',
    children: []
  }
];

export interface ActiveCategory {
  id: number,
  name: string,
  requestor: string
}

@Injectable({
  providedIn: 'root'
})
export class MockCategoryService {
  private category: StaticValue.Category = new StaticValue.Category();
  private hooks: {():void}[] = [];
  selectCategoryId = new Subject<ActiveCategory>();

  constructor(private accountManager: ClientAccountManagerService) {
    const updateCategory = () => {
      this.accountManager.getCategories().then(cat => {
        this.category = cat;
        if(this.category.children.length == 0) {
          this.category.children = JSON.parse(JSON.stringify(default_x));
        }
        this.invokeHooks();
      });
    }

    this.accountManager.subscribe(HookType.CategoriesChange, updateCategory);
    updateCategory();
  }

  watchSelectCategory(): Observable<ActiveCategory> {
    return this.selectCategoryId.asObservable();
  }

  private invokeHooks() {
    for(let h of this.hooks) {
      try {
        h();
      } catch (err) {
      }
    }
  }
  subcribe(func: ()=>void) {
    this.hooks.push(func);
  }

  getAll(): StaticValue.Category {
    return this.category;
  }

  addCategory(parentId: number, cat: StaticValue.Category): boolean {
    if (cat.children.length > 0) return false;

    let new_id = 0;
    const dfs_id = (p: StaticValue.Category) => {
      if(p.id >= new_id) new_id = p.id+1;
      for(let c of p.children) dfs_id(c);
    }
    dfs_id(this.category);

    cat.id = new_id;
    const dfs_add = (parent: StaticValue.Category) => {
      if(parent.id == parentId) {
        for(let cc of parent.children) {
          if(cc.name == cat.name)
            return false;
        }
        parent.children.push(cat);
        return true;
      }
      for(let c of parent.children) {
        const ans = dfs_add(c);
        if(ans) return true;
      }
      return false;
    }
    if (dfs_add(this.category)) {
      if(this.category.children[this.category.children.length-1].id != 0) {
        const v1 = this.category.children.pop();
        const v2 = this.category.children.pop();
        this.category.children.push(v1);
        this.category.children.push(v2);
      }
      setTimeout(() => this.invokeHooks(), 0);
      return true;
    } else {
      return false;
    }
  }

  deleteCategory(id: number): boolean {
    if(id == 0) return false;

    const dfs_del = (parent: StaticValue.Category) => {
      for(let i=0;i<parent.children.length;i++) {
        const c = parent.children[i];
        if(c.id == id) {
          parent.children.splice(i, 1);
          return true;
        } else {
          if (dfs_del(c)) {
            return true;
          };
        }
      }
      return false;
    }

    if(dfs_del(this.category)) {
      setTimeout(() => this.invokeHooks(), 0);
      return true;
    } else {
      return false;
    };
  }

  changeCategoryName(id: number, name: string): boolean {
    if(id == 0) return false;

    const dfs_changeName = (parent: StaticValue.Category) => {
      if(parent.id == id) {
        parent.name = name;
        return true;
      } else {
        for (let c of parent.children) {
          const ans = dfs_changeName(c);
          if(ans) return ans;
        }
      }
      return false;
    }

    if(dfs_changeName(this.category)) {
      setTimeout(() => this.invokeHooks(), 0);
      return true;
    } else {
      return false;
    };
  }

  getCategoryNameById(id: number): string {
    let name: string;

    const dfs_getName = (parent: StaticValue.Category) => {
      if(parent.id == id) {
        name = parent.name;
        return true;
      } else {
        for (let c of parent.children) {
          const ans = dfs_getName(c);
          if(ans) return ans;
        }
      }
      return false;
    }
    dfs_getName(this.category)
    return name;
  }

  async save(): Promise<void> {
    await this.accountManager.setCategories(this.category);
  }
}
