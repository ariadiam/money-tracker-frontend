import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../shared/interfaces/transaction';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:3000/api'; 

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getTransactions(): Observable<Transaction[]> {
    const userId = this.authService.getUserIdFromToken();
    return this.http.get<Transaction[]>(`${this.baseUrl}/${userId}/transactions`);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    const userId = this.authService.getUserIdFromToken();
    return this.http.post<Transaction>(`${this.baseUrl}/${userId}/transactions`, transaction);
  }

  updateTransaction(transactionId: string, transaction: Transaction): Observable<Transaction> {
    const userId = this.authService.getUserIdFromToken();
    return this.http.patch<Transaction>(`${this.baseUrl}/${userId}/transactions/${transactionId}`, transaction);
  }

  deleteTransaction(transactionId: string): Observable<{ message: string }> {
    const userId = this.authService.getUserIdFromToken();
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${userId}/transactions/${transactionId}`);
  }

  getSummary(): Observable<any> {
    const userId = this.authService.getUserIdFromToken();
    return this.http.get<any>(`${this.baseUrl}/${userId}/transactions/summary`);
  }
}
