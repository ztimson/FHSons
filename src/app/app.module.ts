import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {ConvertFromGPipe, ConvertToGPipe} from './formulaManager/units.pipe';
import {ScalePipe} from './formulaManager/scale.pipe';
import {AngularMaterialModule} from './material.module';
import {HomeComponent} from './home/home.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {FormulaManagerComponent} from './formulaManager/formulaManager.component';
import {NgxElectronModule} from 'ngx-electron';
import {AboutComponent} from './about/about.component';
import {CategoriesComponent} from './store/categories.component';
import {AngularFireStorageModule} from 'angularfire2/storage';
import {BreadcrumbService} from './store/breadcrumb.service';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    ConvertFromGPipe,
    ConvertToGPipe,
    FormulaManagerComponent,
    HomeComponent,
    ScalePipe,
    AboutComponent
  ],
  imports: [
    AngularMaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgxElectronModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: 'about', component: AboutComponent},
      {path: 'formulaManager', component: FormulaManagerComponent},
      {path: 'store/:category', component: CategoriesComponent},
      {path: 'store', component: CategoriesComponent},
      {path: '**', component: HomeComponent}
    ]),
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production})
  ],
  providers: [BreadcrumbService],
  bootstrap: [AppComponent]
})
export class AppModule {}
