import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoopComponent } from './loop/loop.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';

import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import {LogviewerComponent} from './logviewer/logviewer.component';

const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'loops', component: LoopComponent,  canActivate: [AuthGuardLogin] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: 'logs', component: LogviewerComponent, canActivate: [AuthGuardAdmin] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class RoutingModule {}
