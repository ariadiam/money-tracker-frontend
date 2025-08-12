import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transactions/transaction.service';
import { Transaction } from '../../shared/interfaces/transaction';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] 
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  private loadTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        console.log('Transactions loaded:', data);
      },
      error: (err) => {
        console.error('Failed to load transactions', err);
      }
    });
  }
}
