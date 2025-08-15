import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TransactionService } from '../../services/transactions/transaction.service';
import { Transaction } from '../../shared/interfaces/transaction';
import Chart, { ChartData, ChartOptions } from 'chart.js/auto';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, NavbarComponent, FooterComponent],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit, OnDestroy {
  @ViewChild('expensesCanvas') expensesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('shareCanvas') shareCanvas!: ElementRef<HTMLCanvasElement>;

  transactions: Transaction[] = [];
  totalIncome = 0;
  totalExpenses = 0;

  private expensesChart?: Chart;
  private shareChart?: Chart;

  constructor(private txService: TransactionService) {}

  ngOnInit(): void {
    this.txService.getTransactions().subscribe({
      next: (txs) => {
        this.transactions = txs || [];
        this.computeTotals();
        // ensure canvases exist in DOM before building charts
        setTimeout(() => this.buildCharts(), 0);
      },
      error: (err) => console.error('Failed to load transactions for stats', err)
    });
  }

  ngOnDestroy(): void {
    this.expensesChart?.destroy();
    this.shareChart?.destroy();
  }

  get hasExpenses(): boolean {
    return this.transactions.some(t => t.type === 'expense');
  }

  private computeTotals(): void {
    const norm = (n: any) => Math.abs(Number(n) || 0);
    this.totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + norm(t.amount), 0);
    this.totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + norm(t.amount), 0);
  }

  private buildCharts(): void {
    this.buildExpensesByCategory();
    this.buildIncomeVsExpense();
  }

  private buildExpensesByCategory(): void {
    const byCat = new Map<string, number>();
    for (const t of this.transactions) {
      if (t.type !== 'expense') continue;
      const key = (t.category || 'Uncategorized').trim().toLowerCase();
      byCat.set(key, (byCat.get(key) || 0) + Math.abs(Number(t.amount) || 0));
    }

    const labels = Array.from(byCat.keys()).map(k => this.prettyLabel(k));
    const values = Array.from(byCat.values());

    this.expensesChart?.destroy();
    const ctx = this.expensesCanvas?.nativeElement.getContext('2d');
    if (!ctx) return;

    const data: ChartData<'doughnut'> = {
      labels,
      datasets: [{ data: values }]
    };

    this.expensesChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
        plugins: {
          legend: { labels: { color: '#e5e7eb' } },
          tooltip: { enabled: true }
        }
      }
    });
  }

  private buildIncomeVsExpense(): void {
    const data: ChartData<'doughnut'> = {
      labels: ['Income', 'Expenses'],
      datasets: [{ data: [this.totalIncome, this.totalExpenses] }]
    };

    this.shareChart?.destroy();
    const ctx = this.shareCanvas?.nativeElement.getContext('2d');
    if (!ctx) return;

    this.shareChart = new Chart(ctx, {
      type: 'doughnut',
      data,
      options: {
      cutout: '55%',
      plugins: {
        legend: { labels: { color: '#e5e7eb' } },
        tooltip: { enabled: true }
      }
    } as ChartOptions<'doughnut'>
});

  }

  private prettyLabel(k: string): string {
    return k.replace(/\b\w/g, c => c.toUpperCase());
  }
}
