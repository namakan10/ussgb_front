
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { CoreModule, FlexLayoutModule } from '@angular/flex-layout';
import { FullComponent } from './layouts/full/full.component';
import { AppHeaderComponent } from './layouts/full/header/header.component';
import { AppSidebarComponent } from './layouts/full/sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './demo-material-module';

import { SharedModule } from './shared/shared.module';
import { SpinnerComponent } from './shared/spinner.component';
import { PagesModule } from './pages/pages.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DatePipe } from '@angular/common';
import {AichaSpinnerComponent} from "./pages/aicha/Courrier/aicha-spinner/aicha-spinner.component";
import {CropComponent} from "./pages/A_Pages_Utilisateurs/crop/crop.component";
import { SidebarFsapComponent } from './layouts/full/sidebar/sidebar-fsap/sidebar-fsap.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {CKEditorModule} from 'ng2-ckeditor';
import {MatStepperModule} from "@angular/material/stepper";
import {MAT_DATE_LOCALE} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    FullComponent,
    AppHeaderComponent,
    SpinnerComponent,
    AichaSpinnerComponent,
    AppSidebarComponent,
    SidebarFsapComponent,
    //ListDesNotesEcCalculComponent,
  ]
  , entryComponents: [
    CropComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    MatStepperModule,
    FormsModule,
    AngularFontAwesomeModule,
    CommonModule,
    FlexLayoutModule,
    HttpClientModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes, {useHash: true}),
    PagesModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    CKEditorModule,

  ],
  exports: [],
  providers: [DatePipe,{ provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
