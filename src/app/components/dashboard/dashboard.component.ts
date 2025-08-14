import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transactions/transaction.service';
import { Transaction } from '../../shared/interfaces/transaction';
import { TransactionListComponent } from '../transactions/transaction-list/transaction-list.component';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from 'src/app/shared/interfaces/api-response'; 
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [TransactionListComponent, CommonModule, CurrencyPipe, FormsModule, NavbarComponent]
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  totalIncome = 0;
  totalExpenses = 0;
  balance = 0;

  newTransaction: Partial<Transaction> = {
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: undefined,
    category: ''
  };

  constructor(
    private transactionService: TransactionService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        this.calculateSummary();
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      }
    });
  }

//   calculateSummary(): void {
//   const norm = (n: any) => Math.abs(Number(n) || 0);

//   this.totalIncome = this.transactions.reduce((sum, t) => {
//     if (t.type === 'income') return sum + norm(t.amount);
//     if (!t.type && Number(t.amount) > 0) return sum + Number(t.amount);
//     return sum;
//   }, 0);

//   this.totalExpenses = this.transactions.reduce((sum, t) => {
//     if (t.type === 'expense') return sum + norm(t.amount);
//     if (!t.type && Number(t.amount) < 0) return sum + Math.abs(Number(t.amount));
//     return sum;
//   }, 0);

//   this.balance = this.totalIncome - this.totalExpenses;
// }

calculateSummary(): void {
  this.totalIncome = this.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  this.totalExpenses = this.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  this.balance = this.totalIncome - this.totalExpenses;
}

  addTransaction(): void {
    this.transactionService.addTransaction(this.newTransaction).subscribe({
      next: (res: ApiResponse<Transaction>) => {
        const savedTx = res.data;
        this.transactions = [savedTx, ...(this.transactions || [])]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.calculateSummary();

        this.newTransaction = {
          description: '',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          type: undefined,
          category: ''
        };
      },
      error: (err) => {
        console.error('Failed to add transaction', err);
      }
    });
  }

  onTransactionsChanged(updatedTransactions: Transaction[]): void {
    this.transactions = updatedTransactions;
    this.calculateSummary();
  }
}
