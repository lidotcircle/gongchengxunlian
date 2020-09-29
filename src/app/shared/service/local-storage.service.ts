import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private mStorage = window.localStorage;

  constructor() {}

  public get(key: string, defaultValue: any): any {
    let value = this.mStorage.getItem(key);
    try {
      value = JSON.parse(value);
    } catch {
      value = null;
    }
    if (value === null && defaultValue) {
      value = defaultValue;
    }
    return value;
  }

  public set(key: string, value: any) {
    this.mStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string) {
    this.mStorage.removeItem(key);
  }
}

