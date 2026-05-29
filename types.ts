export interface Customer {
  id: string;
  name: string;
  phone: string;
  goodsType?: string;
  notes?: string;
  createdAt: string;
}

export interface DebtItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
}

export interface Transaction {
  id: string;
  customerId: string;
  type: 'debt' | 'payment';
  amount: number;
  note: string;
  details?: string;
  date: string;
  items?: DebtItem[];
}

export interface SummaryStats {
  totalDebts: number;
  totalPayments: number;
  totalRemaining: number;
}
