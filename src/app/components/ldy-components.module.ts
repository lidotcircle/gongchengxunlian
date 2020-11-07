import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyrightComponent } from './copyright/copyright.component';
import { LogoComponent } from './logo/logo.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';


@NgModule({
  declarations: [CopyrightComponent, LogoComponent, HeaderComponent, InfiniteScrollComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    CopyrightComponent, LogoComponent, HeaderComponent,
    InfiniteScrollComponent
  ]
})
export class LdyComponentsModule { }
