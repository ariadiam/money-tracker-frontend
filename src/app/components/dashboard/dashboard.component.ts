import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transactions/transaction.service';
import { Transaction } from '../../shared/interfaces/transaction';
import { TransactionListComponent } from '../transactions/transaction-list/transaction-list.component';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,                     
  imports: [TransactionListComponent, CommonModule] 
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;

  constructor(
    private transactionService: TransactionService,
    public authService: AuthService
  ) {}

   ngOnInit(): void {
    const userId = this.authService.getUserIdFromToken();
    if (userId) {
      this.transactionService.getTransactions(userId).subscribe({
        next: (data) => {
          this.transactions = data;
          this.calculateSummary();
        },
        error: (err) => {
          console.error('Failed to load transactions', err);
        }
      });
    } else {
      console.error('No user ID found in token');
    }
  }

  calculateSummary(): void {
    this.totalIncome = this.transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    this.totalExpenses = this.transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);

    this.balance = this.totalIncome + this.totalExpenses;
  }
}