export interface Transaction {
  _id?: string;
  userId: string; // link to the user who owns it
  amount: number;
  category: string;
  date: string; // ISO format date
  description?: string; // optional
  type: 'income' | 'expense';
}
