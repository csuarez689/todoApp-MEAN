import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//angular material
import { MaterialModule } from './material.module';

//components
import { AppComponent } from './app.component';
import { HomePageLayoutComponent } from './components/home-page-layout/home-page-layout.component';
import { ListFormComponent } from './components/list-form/list-form.component';
import { TasksTableComponent } from './components/tasks-table/tasks-table.component';
import { ListDetailComponent } from './components/list-detail/list-detail.component';
import { GenericDeleteModalComponent } from './components/generic-delete-modal/generic-delete-modal.component';
import { LoginComponent } from './components/login/login.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskImageUploadFormComponent } from './components/task-image-upload-form/task-image-upload-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { ErrorSnackBarComponent } from './components/error-snack-bar/error-snack-bar.component';

//Seteo para fechas
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-AR';
registerLocaleData(localeEs, 'es-AR');

//interceptors
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './helpers';

//services
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    HomePageLayoutComponent,
    ListFormComponent,
    TasksTableComponent,
    ListDetailComponent,
    GenericDeleteModalComponent,
    TaskFormComponent,
    TaskImageUploadFormComponent,
    LoginComponent,
    RegisterFormComponent,
    ErrorSnackBarComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
  ],
  providers: [
    ErrorSnackBarComponent,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    { provide: LOCALE_ID, useValue: 'es-AR' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
