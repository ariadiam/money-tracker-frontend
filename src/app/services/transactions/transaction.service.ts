import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../../shared/interfaces/transaction';
import { ApiResponse } from 'src/app/shared/interfaces/api-response';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:3000/api/transactions';

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(this.baseUrl, this.getAuthHeaders());
  }

  addTransaction(transaction: Partial<Transaction>): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(this.baseUrl, transaction, this.getAuthHeaders());
  }

  updateTransaction(transactionId: string, transaction: Partial<Transaction>): Observable<{ status: boolean; data: Transaction; message: string }> {
  return this.http.patch<{ status: boolean; data: Transaction; message: string }>(`${this.baseUrl}/${transactionId}`, transaction, this.getAuthHeaders());
}


  deleteTransaction(transactionId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${transactionId}`, this.getAuthHeaders());
  }

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/summary`, this.getAuthHeaders());
  }
}
