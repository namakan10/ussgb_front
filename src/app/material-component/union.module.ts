import 'hammerjs';
import { NgModule } from '@angular/core';
import { ProfilComponent } from '../pages/A_Pages_Utilisateurs/profil/profil.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
// tslint:disable-next-line:max-line-length
import { MatSelectModule, MatCardModule, MatToolbarModule, MatSidenavModule, MatDividerModule, MatExpansionModule, MatDialogModule, MatStepperModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatSortModule, MatTableModule, MatPaginatorModule, MatMenuModule, MatInputModule } from '@angular/material';
import { HomeComponent } from '../pages/A_Pages_Utilisateurs/home/home.component';
import {MatTabsModule} from "@angular/material/tabs";

@NgModule({
    imports: [
        MatSelectModule,
        CommonModule,
        MatCardModule,
        MatToolbarModule,
        MatSidenavModule,
        ScrollingModule,
        MatDividerModule,
        MatExpansionModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatDialogModule,
        MatStepperModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatInputModule,
        MatTabsModule,
    ],
  declarations: [
    ProfilComponent,
    HomeComponent,
  ]
})
export class UnionModule {}
