import { Component, Input } from '@angular/core';
import { Transaction } from '../../../shared/interfaces/transaction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  standalone: true,
  imports: [CommonModule] // <-- add this
})
export class TransactionListComponent {
  @Input() transactions: Transaction[] = [];
}
