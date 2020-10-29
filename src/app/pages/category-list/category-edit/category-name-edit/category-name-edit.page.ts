import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-category-name-edit',
  templateUrl: './category-name-edit.page.html',
  styleUrls: ['./category-name-edit.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryNameEditPage implements OnInit {
  name: string;

  constructor(private modalController: ModalController, 
              private navParams: NavParams) {
    this.name = this.navParams.data['value'];
  }

  dismiss(name: string) {
    this.modalController.dismiss(name);
  }

  onSave() {
    this.dismiss(this.name);
  }

  ngOnInit() {
  }
}
