import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from '../../../shared/interfaces/transaction';
import { TransactionService } from '../../../services/transactions/transaction.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
  @Output() transactionsChanged = new EventEmitter<Transaction[]>(); 

  editingTransactionId: string | null = null;
  editedTransaction: Partial<Transaction> = {};

  constructor(private transactionService: TransactionService) {}

  startEditing(tx: Transaction) {
    this.editingTransactionId = tx._id!;
    this.editedTransaction = { ...tx };
  }

  cancelEditing() {
    this.editingTransactionId = null;
    this.editedTransaction = {};
  }

  saveTransaction() {
    if (!this.editingTransactionId) return;

    this.transactionService
      .updateTransaction(this.editingTransactionId, this.editedTransaction)
      .subscribe({
        next: (res: any) => {
          const updatedTx = res.data;
          const index = this.transactions.findIndex(t => t._id === updatedTx._id);
          if (index !== -1) {
          const nextArray = [...this.transactions];
          nextArray[index] = { ...updatedTx };
          this.transactions = nextArray;
        }

          this.transactionsChanged.emit(this.transactions); 

          this.cancelEditing();
        },
        error: (err) => {
          console.error('Failed to update transaction', err);
        }
      });
  }

  deleteTransaction(transactionId: string) {
  this.transactionService.deleteTransaction(transactionId)
    .subscribe({
      next: () => {
        this.transactions = this.transactions.filter(t => t._id !== transactionId);
        this.transactionsChanged.emit(this.transactions); 
      },
      error: (err) => {
        console.error('Failed to delete transaction', err);
      }
    });
  }
}
