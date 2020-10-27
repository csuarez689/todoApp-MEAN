import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageLayoutComponent } from './components/home-page-layout/home-page-layout.component';
import { AuthGuard } from './helpers/auth.guard';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'listas',
    component: HomePageLayoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listas/:idLista',
    component: HomePageLayoutComponent,
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: 'listas' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
