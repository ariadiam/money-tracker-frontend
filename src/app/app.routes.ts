import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransactionListComponent } from './components/transactions/transaction-list/transaction-list.component';
import { AddTransactionComponent } from './components/transactions/add-transaction/add-transaction.component';
import { StatisticsComponent } from './components/statistics/statistics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  // { path: 'transactions', component: TransactionListComponent },
  // { path: 'transactions/add', component: AddTransactionComponent },
  { path: 'statistics', component: StatisticsComponent },
];
