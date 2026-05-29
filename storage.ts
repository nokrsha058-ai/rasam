import { Customer, Transaction } from '../types';

// Safe localStorage fallback for double-click running (file:// protocol)
const safeLocalStorage = (() => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    const storageObj: Record<string, string> = {};
    return {
      getItem: (key: string) => (key in storageObj ? storageObj[key] : null),
      setItem: (key: string, value: string) => { storageObj[key] = String(value); },
      removeItem: (key: string) => { delete storageObj[key]; },
      clear: () => { for (const k in storageObj) delete storageObj[k]; },
      key: (i: number) => Object.keys(storageObj)[i] || null,
      get length() { return Object.keys(storageObj).length; }
    };
  }
})();

const localStorage = safeLocalStorage;

const CUSTOMERS_KEY = 'al_rassam_customers_v1';
const TRANSACTIONS_KEY = 'al_rassam_transactions_v1';

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'أحمد الكناني (مكتب الفرات)',
    phone: '07701234567',
    createdAt: '2026-05-10T09:00:00Z',
  },
  {
    id: 'cust-2',
    name: 'شركة النور للمقاولات',
    phone: '07812233445',
    createdAt: '2026-05-12T10:30:00Z',
  },
  {
    id: 'cust-3',
    name: 'مكتبة الرافدين',
    phone: '07509876543',
    createdAt: '2026-05-15T14:15:00Z',
  },
  {
    id: 'cust-4',
    name: 'مصطفى الدراجي',
    phone: '07715566778',
    createdAt: '2026-05-18T11:00:00Z',
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    customerId: 'cust-1',
    type: 'debt',
    amount: 250000,
    note: 'مطبوعات وهدايا دعائية للمكتب الجديد',
    date: '2026-05-10T09:30:00Z',
  },
  {
    id: 'tx-2',
    customerId: 'cust-1',
    type: 'payment',
    amount: 100000,
    note: 'الدفعة الأولى نقداً',
    date: '2026-05-11T16:00:00Z',
  },
  {
    id: 'tx-3',
    customerId: 'cust-2',
    type: 'debt',
    amount: 850000,
    note: 'تصميم وتنصيب لوحة إعلانية خارجية قياس 4×3 م',
    date: '2026-05-12T11:00:00Z',
  },
  {
    id: 'tx-4',
    customerId: 'cust-2',
    type: 'payment',
    amount: 500000,
    note: 'دفعة مستلمة عبر زين كاش',
    date: '2026-05-13T10:00:00Z',
  },
  {
    id: 'tx-5',
    customerId: 'cust-2',
    type: 'debt',
    amount: 300000,
    note: 'طباعة بروشورات وبوسترات دعائية 1000 نسخة',
    date: '2026-05-14T14:00:00Z',
  },
  {
    id: 'tx-6',
    customerId: 'cust-3',
    type: 'debt',
    amount: 120000,
    note: 'تجهيز دفاتر فواتير ومستندات قبض مخصصة',
    date: '2026-05-15T15:00:00Z',
  },
  {
    id: 'tx-7',
    customerId: 'cust-3',
    type: 'payment',
    amount: 120000,
    note: 'تسديد الحساب بالكامل - نقداً',
    date: '2026-05-16T12:00:00Z',
  },
  {
    id: 'tx-8',
    customerId: 'cust-4',
    type: 'debt',
    amount: 450000,
    note: 'تصميم شعار مع تطوير الهوية البصرية المتكاملة',
    date: '2026-05-18T11:30:00Z',
  },
];

export function getCustomers(): Customer[] {
  const data = localStorage.getItem(CUSTOMERS_KEY);
  if (!data) {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CUSTOMERS;
  }
}

export function saveCustomers(customers: Customer[]): void {
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
}

export function getTransactions(): Transaction[] {
  const data = localStorage.getItem(TRANSACTIONS_KEY);
  if (!data) {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} د.ع`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('ar-IQ-u-nu-latn', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch (e) {
    return dateString;
  }
}
