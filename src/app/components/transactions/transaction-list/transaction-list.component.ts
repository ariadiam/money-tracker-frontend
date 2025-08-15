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
  @Input() pageSize = 6;
  currentPage = 1;
  @Output() transactionsChanged = new EventEmitter<Transaction[]>(); 

  editingTransactionId: string | null = null;
  editedTransaction: Partial<Transaction> = {};

  constructor(private transactionService: TransactionService) {}

  get totalItems(): number {
  return this.transactions?.length || 0;
}
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }
  get pagedTransactions(): Transaction[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.transactions.slice(start, start + this.pageSize);
  }

   get startItemIndex(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }
  get endItemIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }
  prevPage() { this.goToPage(this.currentPage - 1); }
  nextPage() { this.goToPage(this.currentPage + 1); }

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

        // keep current page valid
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

        this.transactionsChanged.emit(this.transactions);
        this.cancelEditing();
      },
      error: (err) => console.error('Failed to update transaction', err)
    });
}

deleteTransaction(transactionId: string) {
  this.transactionService.deleteTransaction(transactionId)
    .subscribe({
      next: () => {
        this.transactions = this.transactions.filter(t => t._id !== transactionId);

        // if we deleted the last item on the page, move back a page
        const start = (this.currentPage - 1) * this.pageSize;
        if (this.currentPage > 1 && start >= this.transactions.length) {
          this.currentPage = this.currentPage - 1;
        }

        this.transactionsChanged.emit(this.transactions);
      },
      error: (err) => console.error('Failed to delete transaction', err)
    });
  }
}
