import { LocalStorageService } from './../../shared/service/local-storage.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';
import { StaticValue } from '../../shared/static-value/static-value.module';

interface AppConfig {
  hasRun: boolean;
  version: string;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomePage implements OnInit {
  showSkip = true;
  @ViewChild('slides', {static: false}) slides: IonSlides;

  /** slides change */
  onSlideWillChange(event) {
    event.target.isEnd().then((end) => {
      this.showSkip = !end;
    });
  }

 constructor(private localstorage: LocalStorageService, private router: Router) {}

  ngOnInit() {}
}
