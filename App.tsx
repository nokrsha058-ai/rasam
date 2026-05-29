import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  LayoutGrid, 
  Search, 
  UserPlus, 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeftRight, 
  Calendar, 
  Phone, 
  User, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  Trash2,
  Printer,
  Settings,
  RefreshCw,
  LogOut,
  Sparkles,
  Info,
  DollarSign,
  Share2,
  Lock,
  Wallet,
  Paintbrush,
  Sun,
  Moon,
  Edit,
  Copy,
  MessageCircle,
  Shield,
  X
} from 'lucide-react';

import { Customer, Transaction, DebtItem } from './types';
import { 
  getCustomers, 
  saveCustomers, 
  getTransactions, 
  saveTransactions, 
  formatCurrency, 
  formatDate 
} from './utils/storage';
import { translateNumberToArabicWords } from './utils/arabicWords';
import SearchableDropdown from './components/SearchableDropdown';

// Safe Storage fallbacks for offline/double-click execution (file:// protocol)
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

const safeSessionStorage = (() => {
  try {
    const testKey = '__session_test__';
    window.sessionStorage.setItem(testKey, testKey);
    window.sessionStorage.removeItem(testKey);
    return window.sessionStorage;
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
const sessionStorage = safeSessionStorage;

export const themeColors: Record<string, {
  name: string;
  hex: string;
  primary: string;
  primaryHover: string;
  textColor: string;
  textColorDark: string;
  borderColor: string;
  borderColorMuted: string;
  badgeBg: string;
  bgGradient: string;
  lightGradient: string;
  focusRing: string;
  glowColor: string;
}> = {
  blue: {
    name: 'أزرق كلاسيكي',
    hex: '#2563EB',
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    textColor: 'text-blue-600',
    textColorDark: 'text-blue-400',
    borderColor: 'border-blue-500',
    borderColorMuted: 'border-blue-500/20',
    badgeBg: 'bg-blue-500/10 text-blue-400',
    bgGradient: 'from-[#2552fc] to-[#0d164d]',
    lightGradient: 'from-blue-500 to-indigo-900',
    focusRing: 'focus:ring-blue-500',
    glowColor: 'shadow-blue-500/20'
  },
  orange: {
    name: 'برتقالي الرسام',
    hex: '#EA580C',
    primary: 'bg-orange-600',
    primaryHover: 'hover:bg-orange-700',
    textColor: 'text-orange-600',
    textColorDark: 'text-orange-400',
    borderColor: 'border-orange-500',
    borderColorMuted: 'border-orange-500/25',
    badgeBg: 'bg-orange-500/10 text-orange-400',
    bgGradient: 'from-[#EA580C] to-[#5a1c00]',
    lightGradient: 'from-orange-500 to-red-900',
    focusRing: 'focus:ring-orange-500',
    glowColor: 'shadow-orange-500/20'
  },
  green: {
    name: 'أخضر زمردي',
    hex: '#16A34A',
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    textColor: 'text-emerald-500',
    textColorDark: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    borderColorMuted: 'border-emerald-500/20',
    badgeBg: 'bg-emerald-500/10 text-emerald-400',
    bgGradient: 'from-[#059669] to-[#022c22]',
    lightGradient: 'from-emerald-500 to-teal-900',
    focusRing: 'focus:ring-emerald-500',
    glowColor: 'shadow-emerald-500/20'
  },
  red: {
    name: 'أحمر قرمزي',
    hex: '#DC2626',
    primary: 'bg-red-600',
    primaryHover: 'hover:bg-red-700',
    textColor: 'text-red-500',
    textColorDark: 'text-red-400',
    borderColor: 'border-red-500',
    borderColorMuted: 'border-red-500/20',
    badgeBg: 'bg-red-500/10 text-red-400',
    bgGradient: 'from-[#DC2626] to-[#4c0519]',
    lightGradient: 'from-red-500 to-rose-950',
    focusRing: 'focus:ring-red-500',
    glowColor: 'shadow-red-500/20'
  },
  purple: {
    name: 'بنفسجي ملكي',
    hex: '#9333EA',
    primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    textColor: 'text-purple-600',
    textColorDark: 'text-purple-400',
    borderColor: 'border-purple-500',
    borderColorMuted: 'border-purple-500/20',
    badgeBg: 'bg-purple-500/10 text-purple-400',
    bgGradient: 'from-[#9333EA] to-[#3b0764]',
    lightGradient: 'from-purple-500 to-indigo-950',
    focusRing: 'focus:ring-purple-500',
    glowColor: 'shadow-purple-500/20'
  },
  teal: {
    name: 'فيروزي ساحر',
    hex: '#0D9488',
    primary: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-700',
    textColor: 'text-teal-500',
    textColorDark: 'text-teal-400',
    borderColor: 'border-teal-500',
    borderColorMuted: 'border-teal-500/20',
    badgeBg: 'bg-teal-500/10 text-teal-450',
    bgGradient: 'from-[#0D9488] to-[#115e59]',
    lightGradient: 'from-teal-500 to-emerald-900',
    focusRing: 'focus:ring-teal-500',
    glowColor: 'shadow-teal-500/20'
  },
  amber: {
    name: 'ذهبي أصيل',
    hex: '#D97706',
    primary: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-700',
    textColor: 'text-amber-500',
    textColorDark: 'text-amber-400',
    borderColor: 'border-amber-500',
    borderColorMuted: 'border-amber-500/20',
    badgeBg: 'bg-amber-500/10 text-amber-400',
    bgGradient: 'from-[#D97706] to-[#451a03]',
    lightGradient: 'from-amber-500 to-orange-950',
    focusRing: 'focus:ring-amber-500',
    glowColor: 'shadow-amber-500/20'
  },
  sky: {
    name: 'سماوي كوني',
    hex: '#0EA5E9',
    primary: 'bg-sky-600',
    primaryHover: 'hover:bg-sky-700',
    textColor: 'text-sky-500',
    textColorDark: 'text-sky-450',
    borderColor: 'border-sky-500',
    borderColorMuted: 'border-sky-500/20',
    badgeBg: 'bg-sky-500/10 text-sky-400',
    bgGradient: 'from-[#0EA5E9] to-[#0c4a6e]',
    lightGradient: 'from-sky-500 to-blue-900',
    focusRing: 'focus:ring-sky-500',
    glowColor: 'shadow-sky-500/20'
  },
  rose: {
    name: 'وردي دافئ',
    hex: '#E11D48',
    primary: 'bg-rose-500',
    primaryHover: 'hover:bg-rose-600',
    textColor: 'text-rose-500',
    textColorDark: 'text-rose-400',
    borderColor: 'border-rose-500',
    borderColorMuted: 'border-rose-500/20',
    badgeBg: 'bg-rose-500/10 text-rose-400',
    bgGradient: 'from-[#E11D48] to-[#4c0519]',
    lightGradient: 'from-rose-500 to-red-950',
    focusRing: 'focus:ring-rose-500',
    glowColor: 'shadow-rose-500/20'
  },
  slate: {
    name: 'رمادي فولاذي',
    hex: '#475569',
    primary: 'bg-slate-600',
    primaryHover: 'hover:bg-slate-700',
    textColor: 'text-slate-600',
    textColorDark: 'text-slate-400',
    borderColor: 'border-slate-500',
    borderColorMuted: 'border-slate-500/20',
    badgeBg: 'bg-slate-500/10 text-slate-400',
    bgGradient: 'from-[#475569] to-[#1e293b]',
    lightGradient: 'from-slate-500 to-zinc-800',
    focusRing: 'focus:ring-slate-500',
    glowColor: 'shadow-slate-500/20'
  }
};

export default function App() {
  // ---- Core States ----
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'customers' | 'add-debt' | 'add-payment' | 'statements' | 'settings'>('dashboard');
  
  // Theme States
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('al_rassam_dark_mode_v2');
    return saved !== 'false';
  });
  
  const [activeThemeColor, setActiveThemeColor] = useState<string>(() => {
    const saved = localStorage.getItem('al_rassam_theme_color_v2');
    return saved || 'blue';
  });

  // Editing Customer States
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [editingCustName, setEditingCustName] = useState('');
  const [editingCustPhone, setEditingCustPhone] = useState('');
  const [editingCustGoodsType, setEditingCustGoodsType] = useState('');
  const [editingCustNotes, setEditingCustNotes] = useState('');

  // Custom Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
  } | null>(null);

  // Dynamic Admin Configuration / Settings
  const [shopName, setShopName] = useState<string>(() => localStorage.getItem('al_rassam_shop_name_v2') || 'مكتب الرسام');
  const [shopSlogan, setShopSlogan] = useState<string>(() => localStorage.getItem('al_rassam_shop_slogan_v2') || 'نظام الديون الفوري والفواتير المحاسبية');
  const [whatsappTemplate, setWhatsappTemplate] = useState<string>(() => {
    return localStorage.getItem('al_rassam_whatsapp_template_v2') || 'السلام عليكم اخي الكريم، يرجى تسديد المبلغ المتبقي بذمتك وقدره {المبلغ} دينار مع كل الود والاحترام ❤️';
  });

  // Global App Site Login States (يقوم بطلب يوزر وباسورد عند فتح الموقع)
  const [siteUsername, setSiteUsername] = useState<string>(() => {
    return localStorage.getItem('al_rassam_site_username_v2') || 'admin';
  });
  const [sitePassword, setSitePassword] = useState<string>(() => {
    return localStorage.getItem('al_rassam_site_password_v2') || '1234';
  });
  const [isSiteLoggedIn, setIsSiteLoggedIn] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('al_rassam_site_logged_in_v2');
    return saved === 'true';
  });
  const [enteredSiteUsername, setEnteredSiteUsername] = useState<string>('');
  const [enteredSitePassword, setEnteredSitePassword] = useState<string>('');
  const [siteLoginError, setSiteLoginError] = useState<string>('');

  // Admin Access and Passcode states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('al_rassam_admin_unlocked_session_v2');
    return saved === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('al_rassam_admin_passcode_v2') || '1234';
  });
  const [enteredPasscode, setEnteredPasscode] = useState<string>('');
  const [showPasscodeError, setShowPasscodeError] = useState<boolean>(false);
  const [adminSearchTerm, setAdminSearchTerm] = useState<string>('');

  // Transaction direct edit states for Admin Panel
  const [adminEditingTx, setAdminEditingTx] = useState<Transaction | null>(null);
  const [adminEditAmount, setAdminEditAmount] = useState<string>('');
  const [adminEditNote, setAdminEditNote] = useState<string>('');
  const [adminEditDetails, setAdminEditDetails] = useState<string>('');
  const [adminEditDate, setAdminEditDate] = useState<string>('');

  // Custom Settings
  const [maxDebtLimit, setMaxDebtLimit] = useState<number>(() => {
    const saved = localStorage.getItem('al_rassam_max_limit_v1');
    return saved ? parseFloat(saved) : 500000;
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // ---- Form Input States ----
  // Customer Form
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custInitialCommitment, setCustInitialCommitment] = useState('');
  const [custGoodsType, setCustGoodsType] = useState('');
  const [custNotes, setCustNotes] = useState('');

  // Debt Form
  const [debtCustomerId, setDebtCustomerId] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtPurchaseDetails, setDebtPurchaseDetails] = useState('');
  const [debtNote, setDebtNote] = useState('');
  const [debtDate, setDebtDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Materials/Items in Debt State
  const [debtItems, setDebtItems] = useState<DebtItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Helper function to format input values on Change with automatic commas
  const handleCommaFormattedChange = (val: string, setter: (newVal: string) => void) => {
    // Keep numbers and periods only
    let cleanVal = val.replace(/,/g, '').replace(/[^\d.]/g, '');
    // Handle multiple decimal points if typed
    const parts = cleanVal.split('.');
    if (parts.length > 2) {
      cleanVal = parts[0] + '.' + parts.slice(1).join('');
    }
    
    if (!cleanVal) {
      setter('');
      return;
    }

    const [integerPart, decimalPart] = cleanVal.split('.');
    const formattedInteger = parseFloat(integerPart || '0').toLocaleString('en-US');
    const formatted = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;
    
    setter(formatted);
  };

  // Helper function to parse dynamic comma-formatted strings back to absolute float numbers
  const parseCommaValue = (val: string): number => {
    if (!val) return 0;
    const clean = val.replace(/,/g, '');
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : num;
  };

  const getWhatsAppLink = (phoneNum: string, text?: string): string => {
    if (!phoneNum || phoneNum === 'بدون رقم هاتف') return '';
    let clean = phoneNum.replace(/[^\d]/g, '');
    if (clean.startsWith('0')) {
      clean = '964' + clean.slice(1);
    } else if (clean.startsWith('7') && clean.length === 9) {
      clean = '964' + clean;
    }
    const query = text ? `?text=${encodeURIComponent(text)}` : '';
    return `https://wa.me/${clean}${query}`;
  };

  // Payment Form
  const [paymentCustomerId, setPaymentCustomerId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Ledger Select Filter
  const [selectedCustomerIdForStatement, setSelectedCustomerIdForStatement] = useState<string>('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [statementFilterType, setStatementFilterType] = useState<'all' | 'debt' | 'payment'>('all');

  // Load datasets on mount
  useEffect(() => {
    setCustomers(getCustomers());
    setTransactions(getTransactions());
  }, []);

  // Save changes to localStorage on state updates
  const updateCustomersStateAndStorage = (newCustomers: Customer[]) => {
    setCustomers(newCustomers);
    saveCustomers(newCustomers);
  };

  const updateTransactionsStateAndStorage = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };

  // Helper notification toast
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    localStorage.setItem('al_rassam_dark_mode_v2', next.toString());
    showNotification(next ? 'تم تفعيل الوضع الداكن المريح للعين' : 'تم تفعيل الوضع الفاتح العالي الوضوح', 'info');
  };

  const updateThemeColor = (colorId: string) => {
    setActiveThemeColor(colorId);
    localStorage.setItem('al_rassam_theme_color_v2', colorId);
    showNotification(`تم تحديث ألوان وطابع ${shopName} بنجاح`, 'success');
  };

  const handleEditCustomerSave = (id: string) => {
    if (!editingCustName.trim()) {
      showNotification('يرجى تحديد اسم صالح لتعديل الزبون', 'error');
      return;
    }

    const isDuplicate = customers.some(c => c.id !== id && c.name.trim() === editingCustName.trim());
    if (isDuplicate) {
      showNotification('اسم هذا الزبون مسجل مسبقاً لشخص آخر بالدفاتر', 'error');
      return;
    }

    const updated = customers.map(c => {
      if (c.id === id) {
        return {
          ...c,
          name: editingCustName.trim(),
          phone: editingCustPhone.trim() || 'بدون رقم هاتف',
          goodsType: editingCustGoodsType.trim(),
          notes: editingCustNotes.trim()
        };
      }
      return c;
    });

    updateCustomersStateAndStorage(updated);
    showNotification('تم حفظ وتحديث بيانات العميل بنجاح', 'success');
    setEditingCustomerId(null);
  };

  // ---- Handlers ----
  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      showNotification('يرجى إدخال اسم زبون صالح', 'error');
      return;
    }

    const isDuplicate = customers.some(c => c.name.trim() === custName.trim());
    if (isDuplicate) {
      showNotification('اسم هذا الزبون مسجل مسبقاً في الدفتر', 'error');
      return;
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: custName.trim(),
      phone: custPhone.trim() || 'بدون رقم هاتف',
      goodsType: custGoodsType.trim(),
      notes: custNotes.trim(),
      createdAt: new Date().toISOString()
    };

    const initialAmountVal = parseCommaValue(custInitialCommitment);
    if (initialAmountVal > 0) {
      const initTx: Transaction = {
        id: `tx-init-${Date.now()}`,
        customerId: newCust.id,
        type: 'debt',
        amount: initialAmountVal,
        note: 'رصيد ودين أولي مستحق عند تسجيل الزبون',
        date: new Date().toISOString()
      };
      const updatedTxs = [initTx, ...transactions];
      updateTransactionsStateAndStorage(updatedTxs);
    }

    const updated = [newCust, ...customers];
    updateCustomersStateAndStorage(updated);
    showNotification(`تم تسجيل الزبون "${newCust.name}" بنجاح`, 'success');
    
    // Clear Customer Inputs
    setCustName('');
    setCustPhone('');
    setCustInitialCommitment('');
    setCustGoodsType('');
    setCustNotes('');
  };

  const handleAddMaterialToDebt = () => {
    if (!newItemName.trim()) {
      showNotification('يرجى تحديد غرض أو اسم المادة أولاً', 'error');
      return;
    }
    const priceVal = parseCommaValue(newItemPrice);
    if (priceVal <= 0) {
      showNotification('يرجى كتابة سعر مفرد صالح لهذه المادة', 'error');
      return;
    }
    const qtyVal = parseInt(newItemQty, 10);
    if (isNaN(qtyVal) || qtyVal <= 0) {
      showNotification('يرجى كتابة كمية صالحة تزيد عن الصفر', 'error');
      return;
    }

    const newItem: DebtItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: newItemName.trim(),
      qty: qtyVal,
      unitPrice: priceVal
    };

    const nextItems = [...debtItems, newItem];
    setDebtItems(nextItems);

    // Automatically calculate and update the total amount of debt!
    const totalSum = nextItems.reduce((acc, curr) => acc + (curr.qty * curr.unitPrice), 0);
    // Format the number back with commas for the interactive input
    setDebtAmount(totalSum.toLocaleString('en-US'));

    // Clear item addition inputs
    setNewItemName('');
    setNewItemQty('1');
    setNewItemPrice('');
    showNotification('تمت إضافة الصنف وحساب التكلفة المجمّعة تلقائياً', 'success');
  };

  const handleRemoveMaterialFromDebt = (itemId: string) => {
    const nextItems = debtItems.filter(item => item.id !== itemId);
    setDebtItems(nextItems);

    // Recalculate total
    const totalSum = nextItems.reduce((acc, curr) => acc + (curr.qty * curr.unitPrice), 0);
    if (totalSum > 0) {
      setDebtAmount(totalSum.toLocaleString('en-US'));
    } else {
      setDebtAmount('');
    }
    showNotification('تم إزالة الصنف من قائمة المواد', 'info');
  };

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!debtCustomerId) {
      showNotification('يرجى اختيار الزبون من القائمة المنسدلة للديون', 'error');
      return;
    }
    const amountVal = parseCommaValue(debtAmount);
    if (amountVal <= 0) {
      showNotification('يرجى كتابة مبلغ دين صحيح', 'error');
      return;
    }

    // Verify limit warning
    const summary = getCustomerLedgerSummary(debtCustomerId);
    const projectedBalance = summary.balance + amountVal;
    if (projectedBalance > maxDebtLimit) {
      showNotification(`تنبيه: هذا الدين يتجاوز الحد الأقصى المسموح به للديون لهذا العميل (${formatCurrency(maxDebtLimit)})`, 'info');
    }

    // Append purchase details and items summary to the note if present
    let finalNote = '';
    const details = debtPurchaseDetails.trim();
    const noteExtra = debtNote.trim();

    if (details) {
      finalNote = `بضاعة: ${details}`;
      if (noteExtra) {
        finalNote += ` - (${noteExtra})`;
      }
    } else {
      finalNote = noteExtra || 'ديون ومسحوبات عامة';
    }

    if (debtItems.length > 0) {
      const itemsBrief = debtItems.map(item => `${item.name} (${item.qty} × ${item.unitPrice.toLocaleString('en-US')})`).join('، ');
      finalNote = `${finalNote} [المواد: ${itemsBrief}]`.trim();
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerId: debtCustomerId,
      type: 'debt',
      amount: amountVal,
      note: finalNote,
      date: new Date(debtDate).toISOString(),
      items: debtItems.length > 0 ? debtItems : undefined
    };

    const updated = [newTx, ...transactions];
    updateTransactionsStateAndStorage(updated);
    showNotification(`تم تسجيل دين بقيمة ${formatCurrency(amountVal)} بنجاح`, 'success');

    // Reset Form inputs
    setDebtAmount('');
    setDebtPurchaseDetails('');
    setDebtNote('');
    setDebtItems([]);
  };

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentCustomerId) {
      showNotification('يرجى اختيار الزبون من القائمة المنسدلة للدفعة', 'error');
      return;
    }
    const amountVal = parseCommaValue(paymentAmount);
    if (amountVal <= 0) {
      showNotification('يرجى كتابة قيم الدفعة المسددة بدقة', 'error');
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      customerId: paymentCustomerId,
      type: 'payment',
      amount: amountVal,
      note: paymentNote.trim() || 'واصل مقبوض نقداً للدفتر',
      date: new Date(paymentDate).toISOString()
    };

    const updated = [newTx, ...transactions];
    updateTransactionsStateAndStorage(updated);
    showNotification(`تم تدوين دفعة بقيمة ${formatCurrency(amountVal)} من الزبون`, 'success');

    // Reset Form inputs
    setPaymentAmount('');
    setPaymentNote('');
  };

  const handleDeleteTransaction = (txId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'إلغاء العملية المحاسبية',
      message: 'هل تود حقاً إلغاء هذه العملية نهائياً من كشف الحساب والديون؟',
      confirmText: 'نعم، إلغاء وحذف',
      cancelText: 'تراجع',
      isDanger: true,
      onConfirm: () => {
        const filtered = transactions.filter(t => t.id !== txId);
        updateTransactionsStateAndStorage(filtered);
        showNotification('تم حذف العملية وإعادة ضبط توازن الحساب', 'info');
        setConfirmModal(null);
      }
    });
  };

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'شطب وحذف العميل نهائياً',
      message: `تحذير هام: هل أنت متأكد من مسح العميل "${customerName}"؟ سيؤدي ذلك كلياً إلى إزالة جميع عملياته وقيده المالي من كافة الدفاتر وبلا رجعة!`,
      confirmText: 'نعم، شطب العميل وكل سجلاته',
      cancelText: 'إلغاء الأمر',
      isDanger: true,
      onConfirm: () => {
        const filteredCusts = customers.filter(c => c.id !== customerId);
        const filteredTxs = transactions.filter(t => t.customerId !== customerId);
        
        updateCustomersStateAndStorage(filteredCusts);
        updateTransactionsStateAndStorage(filteredTxs);
        
        if (selectedCustomerIdForStatement === customerId) {
          setSelectedCustomerIdForStatement('');
        }
        showNotification(`تم شطب العميل "${customerName}" ومحو سجلاته بالكامل`, 'info');
        setConfirmModal(null);
      }
    });
  };

  const handleResetAppDB = () => {
    setConfirmModal({
      isOpen: true,
      title: 'تصفير كافة السجلات والدفاتر',
      message: 'تحذير نهائي وخطير: هل تريد مسح كافة السجلات، الزبائن، والديون والبدء من جديد؟ سيتم تصفير وحذف جميع بيانات التطبيق تماماً!',
      confirmText: 'نعم، تصفير الدفاتر بالكامل',
      cancelText: 'تراجع وإلغاء',
      isDanger: true,
      onConfirm: () => {
        localStorage.removeItem('al_rassam_customers_v1');
        localStorage.removeItem('al_rassam_transactions_v1');
        setCustomers([]);
        setTransactions([]);
        setSelectedCustomerIdForStatement('');
        showNotification('تم تصفير وإفراغ قاعدة البيانات المحاسبية للمكتب', 'error');
        setConfirmModal(null);
      }
    });
  };

  const handleLoadDemoData = () => {
    localStorage.removeItem('al_rassam_customers_v1');
    localStorage.removeItem('al_rassam_transactions_v1');
    
    // Refresh page state by reading the utility defaults again
    setCustomers(getCustomers());
    setTransactions(getTransactions());
    showNotification('تم تحميل البيانات التجريبية وهيكل الدفاتر لمكتب الرسام', 'info');
  };

  const handleUpdateMaxLimit = (val: string) => {
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed >= 0) {
      setMaxDebtLimit(parsed);
      localStorage.setItem('al_rassam_max_limit_v1', parsed.toString());
      showNotification('تم تحديث وتثبيت سقف الديون الأقصى للزبائن', 'success');
    }
  };

  const handleUpdateShopName = (val: string) => {
    setShopName(val);
    localStorage.setItem('al_rassam_shop_name_v2', val);
    showNotification('تم تحديث اسم المحل/المكتب بنجاح!', 'success');
  };

  const handleUpdateShopSlogan = (val: string) => {
    setShopSlogan(val);
    localStorage.setItem('al_rassam_shop_slogan_v2', val);
    showNotification('تم تحديث العبارة الترويجية بنجاح!', 'success');
  };

  const handleUpdateWhatsappTemplate = (val: string) => {
    setWhatsappTemplate(val);
    localStorage.setItem('al_rassam_whatsapp_template_v2', val);
    showNotification('تم حفظ قالب الواتساب الجديد بنجاح!', 'success');
  };

  // Global site login submit handler
  const handleSiteLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredSiteUsername.trim() === siteUsername && enteredSitePassword === sitePassword) {
      sessionStorage.setItem('al_rassam_site_logged_in_v2', 'true');
      setIsSiteLoggedIn(true);
      setSiteLoginError('');
      showNotification('أهلاً بك! تم التحقق من الهوية والدخول بنجاح', 'success');
    } else {
      setSiteLoginError('اسم المستخدم أو كلمة المرور غير صحيحة، يرجى إعادة المحاولة.');
      showNotification('خطأ في بيانات الدخول للملفات', 'error');
    }
  };

  // Admin UI Lock/Unlock & Direct Editing actions
  const handleVerifyPasscode = (pass: string) => {
    if (pass === adminPasscode) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('al_rassam_admin_unlocked_session_v2', 'true');
      setShowPasscodeError(false);
      showNotification('مرحبا بك! تم فك قفل الواجهة المحاسبية للإدارة بنجاح', 'success');
    } else {
      setShowPasscodeError(true);
      showNotification('الرمز السري غير صحيح! يقتصر هذا القسم على الإدارة', 'error');
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem('al_rassam_admin_unlocked_session_v2');
    setEnteredPasscode('');
    showNotification('تم قفل لوحة الإدارة المحاسبية بنجاح وتأمين الرسوم', 'info');
  };

  const handleUpdatePasscode = (newPass: string) => {
    if (!newPass.trim()) {
      showNotification('يرجى إدخال رمز سري صالح غير فارغ', 'error');
      return;
    }
    setAdminPasscode(newPass);
    localStorage.setItem('al_rassam_admin_passcode_v2', newPass);
    showNotification('تم تغيير كود المرور للوحة الإدارة بنجاح!', 'success');
  };

  const handleAdminDeleteTx = (txId: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'تأكيد حذف الحركة المالية',
      message: 'هل أنت متأكد من حذف هذه الحركة المالية نهائياً؟ سيغير هذا في صافي مديونية الزبون.',
      confirmText: 'نعم، حذف نهائي',
      cancelText: 'تراجع',
      isDanger: true,
      onConfirm: () => {
        const filtered = transactions.filter(t => t.id !== txId);
        updateTransactionsStateAndStorage(filtered);
        showNotification('تم حذف الحركة المالية وإعادة احتساب الرصيد', 'success');
        setConfirmModal(null);
      }
    });
  };

  const startAdminEditTx = (tx: Transaction) => {
    setAdminEditingTx(tx);
    setAdminEditAmount(tx.amount.toString());
    setAdminEditNote(tx.note || '');
    setAdminEditDetails(tx.details || '');
    setAdminEditDate(tx.date);
  };

  const handleAdminEditTxSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEditingTx) return;
    const amountNum = parseFloat(adminEditAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showNotification('يرجى تحديد قيمة مالية صالحة', 'error');
      return;
    }
    const updated = transactions.map(t => {
      if (t.id === adminEditingTx.id) {
        return {
          ...t,
          amount: amountNum,
          note: adminEditNote.trim(),
          details: adminEditDetails.trim(),
          date: adminEditDate || t.date
        };
      }
      return t;
    });
    updateTransactionsStateAndStorage(updated);
    showNotification('تم تعديل وحفظ بيانات الحركة المالية بنجاح', 'success');
    setAdminEditingTx(null);
  };

  // ---- Accounting Metrics & Computations ----
  const getCustomerLedgerSummary = (custId: string) => {
    const custTxs = transactions.filter(t => t.customerId === custId);
    const debts = custTxs.filter(t => t.type === 'debt').reduce((sum, t) => sum + t.amount, 0);
    const payments = custTxs.filter(t => t.type === 'payment').reduce((sum, t) => sum + t.amount, 0);
    return {
      debts,
      payments,
      balance: debts - payments,
      txCount: custTxs.length
    };
  };

  const totalDebts = transactions
    .filter(t => t.type === 'debt')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPayments = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRemaining = totalDebts - totalPayments;

  // Helper to get number of days since the oldest active debt was recorded (if balance > 0)
  const getOverdueDays = (customerId: string): number => {
    const summary = getCustomerLedgerSummary(customerId);
    if (summary.balance <= 0) return 0;
    
    const clientDebts = transactions.filter(t => t.customerId === customerId && t.type === 'debt');
    if (clientDebts.length === 0) return 0;
    
    const oldestDebtTime = Math.min(...clientDebts.map(d => new Date(d.date).getTime()));
    const timeDiffMs = new Date().getTime() - oldestDebtTime;
    return Math.max(0, Math.floor(timeDiffMs / (1000 * 60 * 60 * 24)));
  };

  // Image Specific Indicators
  // 1. تنبيهات التأخير المتوسط (> 15 يوم): Debts recorded >= 15 days ago for customers who still have a positive balance
  const overdue15DaysCount = customers.filter(c => getOverdueDays(c.id) >= 15).length;

  // 1b. تنبيهات التأخير المتأخرة المستندة لشهر (> 30 يوم / شهر):
  const overdueAlertsCount = customers.filter(c => getOverdueDays(c.id) >= 30).length;

  // 2. تجاوز الديون للحد الأقصى: Customers whose active balance is greater than computed limit
  const exceededLimitsCount = customers.filter(c => {
    const bal = getCustomerLedgerSummary(c.id).balance;
    return bal > maxDebtLimit;
  }).length;

  // Trigger Print utilities gracefully inside react
  const printStatement = () => {
    window.print();
  };

  const copyStatementToClipboard = () => {
    if (!activeCustomerRecord) return;
    
    let text = `📋 *كشف حساب مالي - ${shopName}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *الزبون:* ${activeCustomerRecord.name}\n`;
    text += `📱 *الهاتف:* ${activeCustomerRecord.phone || 'بدون رقم هاتف'}\n`;
    text += `📅 *تاريخ الاستخراج:* ${formatDate(new Date().toISOString())}\n`;
    text += `━━━━━━━━━━━━━━━━━━━\n\n`;
    
    text += `📊 *ملخص الحساب المالي:*\n`;
    text += `🔺 إجمالي الديون: ${formatCurrency(activeStatementSummary.debts)}\n`;
    text += `🟢 الواصل والمسدد: ${formatCurrency(activeStatementSummary.payments)}\n`;
    text += `🔹 الرصيد النهائي المطلوب: *${formatCurrency(activeStatementSummary.balance)}*\n\n`;
    
    if (activeCustBalance > 0) {
      text += `✍️ *التفقيط المالي للذمة:*\n(${translateNumberToArabicWords(activeCustBalance)} دينار عراقي لا غير)\n\n`;
    }
    
    if (activeCustomerLedger.length > 0) {
      text += `📝 *حركة الحساب والتفاصيل:*\n`;
      activeCustomerLedger.forEach((tx, idx) => {
        const typeStr = tx.type === 'debt' ? '❌ دين صادرات' : '✅ تسديد واصل';
        text += `${idx + 1}. [${formatDate(tx.date)}] | ${typeStr}\n`;
        text += `   المبلغ: ${formatCurrency(tx.amount)}\n`;
        text += `   الملاحظة: ${tx.note}\n`;
        if (tx.items && tx.items.length > 0) {
          text += `   📦 المواد:\n`;
          tx.items.forEach(item => {
            text += `     - ${item.name} (${item.qty} × ${formatCurrency(item.unitPrice)})\n`;
          });
        }
        text += `-----------------\n`;
      });
    } else {
      text += `لا توجد حركات محاسبية مسجلة لهذا العميل.\n`;
    }
    
    text += `━━━━━━━━━━━━━━━━━━━\n`;
    text += `🙏 شكراً لتعاملكم معنا - ${shopName} وبإشراف الإدارة الموقرة.`;

    navigator.clipboard.writeText(text)
      .then(() => {
        showNotification('تم نسخ كشف الحساب والفاتورة كاملة إلى الحافظة!', 'success');
      })
      .catch(() => {
        showNotification('حدث خطأ أثناء النسخ للحافظة', 'error');
      });
  };

  const shareStatementViaWhatsApp = () => {
    if (!activeCustomerRecord) return;
    
    let text = whatsappTemplate
      .replace('{المبلغ}', formatCurrency(activeStatementSummary.balance))
      .replace('{amount}', formatCurrency(activeStatementSummary.balance)) + '\n\n';
    text += `📋 *كشف حساب مالي - ${shopName}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━\n`;
    text += `👤 *الزبون:* ${activeCustomerRecord.name}\n`;
    text += `📱 *الهاتف:* ${activeCustomerRecord.phone || 'بدون رقم هاتف'}\n`;
    text += `📅 *تاريخ الاستخراج:* ${formatDate(new Date().toISOString())}\n`;
    text += `━━━━━━━━━━━━━━━━━━━\n\n`;
    
    text += `📊 *ملخص الحساب المالي:*\n`;
    text += `🔺 إجمالي الديون: ${formatCurrency(activeStatementSummary.debts)}\n`;
    text += `🟢 الواصل والمسدد: ${formatCurrency(activeStatementSummary.payments)}\n`;
    text += `🔹 الرصيد النهائي المطلوب: *${formatCurrency(activeStatementSummary.balance)}*\n\n`;
    
    if (activeCustBalance > 0) {
      text += `✍️ *التفقيط المالي للذمة:*\n(${translateNumberToArabicWords(activeCustBalance)} دينار عراقي لا غير)\n\n`;
    }
    
    if (activeCustomerLedger.length > 0) {
      text += `📝 *آخر الحركات المحاسبية من الدفتر:*\n`;
      // take last 10 to keep the WhatsApp message concise
      const recentTxs = activeCustomerLedger.slice(0, 10);
      recentTxs.forEach((tx, idx) => {
        const typeStr = tx.type === 'debt' ? '🔺 دين' : '🟢 واصل سداد';
        text += `${idx + 1}. [${typeStr}] بمبلغ *${formatCurrency(tx.amount)}* في تاريخ ${formatDate(tx.date)} (${tx.note})\n`;
      });
      if (activeCustomerLedger.length > 10) {
        text += `... ولديه حركات إضافية دفترياً.\n`;
      }
    }
    
    text += `\n━━━━━━━━━━━━━━━━━━━\n`;
    text += `🙏 شكراً لكم لتعاونكم الدائم معنا.`;

    const cleanPhone = activeCustomerRecord.phone.replace(/[^\d]/g, '');
    let finalPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      finalPhone = '964' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('7') && cleanPhone.length === 9) {
      finalPhone = '964' + cleanPhone;
    }
    
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${finalPhone}?text=${encodedText}`;
    window.open(url, '_blank');
    showNotification('تم تحضير كشف الحساب وفتح واتساب للإرسال المباشر!', 'success');
  };

  const exportStatementToCSV = () => {
    if (!activeCustomerRecord) return;
    
    // Header Row
    let csvContent = "\ufeff"; // BOM for Excel UTF-8 Arabic support
    csvContent += "المستند,المبلغ (د.ع),التاريخ,الملاحظات,المواد التابعة\n";
    
    activeCustomerLedger.forEach((tx) => {
      const typeStr = tx.type === 'debt' ? 'دين ومستند صادرات' : 'دفعة مستلمة واصلة';
      const amountStr = tx.amount;
      const dateStr = formatDate(tx.date).replace(/,/g, ' ');
      const noteStr = tx.note.replace(/,/g, ' ');
      let itemsStr = "";
      if (tx.items && tx.items.length > 0) {
        itemsStr = tx.items.map(it => `${it.name} (${it.qty}x${it.unitPrice})`).join(' | ').replace(/,/g, ' ');
      }
      
      csvContent += `"${typeStr}","${amountStr}","${dateStr}","${noteStr}","${itemsStr}"\n`;
    });
    
    // Add summary row
    csvContent += `\n`;
    csvContent += `"إجمالي الديون","${activeStatementSummary.debts}"\n`;
    csvContent += `"إجمالي الواصل والمسدد","${activeStatementSummary.payments}"\n`;
    csvContent += `"الرصيد النهائي المترتب","${activeStatementSummary.balance}"\n`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `كشف_حساب_${activeCustomerRecord.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('تم تصدير كشف الحساب بملف جدول Excel / CSV بنجاح!', 'success');
  };

  const activeCustomerRecord = customers.find(c => c.id === selectedCustomerIdForStatement);
  const activeCustomerLedger = transactions
    .filter(t => t.customerId === selectedCustomerIdForStatement)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const activeCustBalance = activeCustomerRecord 
    ? getCustomerLedgerSummary(activeCustomerRecord.id).balance 
    : 0;

  const filteredCustomersList = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || 
    c.phone.includes(customerSearchTerm)
  );

  const activeStatementSummary = selectedCustomerIdForStatement 
    ? getCustomerLedgerSummary(selectedCustomerIdForStatement)
    : { debts: 0, payments: 0, balance: 0, txCount: 0 };

  const colors = themeColors[activeThemeColor] || themeColors.blue;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:text-white ${
      isDarkMode 
        ? 'bg-[#070B13] text-slate-100 selection:bg-blue-600' 
        : 'bg-[#F4F6FA] text-slate-900 selection:bg-blue-400'
    }`} id="al_rassam_app">

      {!isSiteLoggedIn ? (
        /* =======================================================
            GLOBAL SITE LOGIN SCREEN (أول ما يفتح الموقع يوزر admin وباسورد 1234)
           ======================================================= */
        <div className="flex-1 flex items-center justify-center p-4 min-h-screen w-full" id="site_login_container">
          <div className={`w-full max-w-md p-8 rounded-[32px] border text-right space-y-6 shadow-2xl transition-all duration-300 ${
            isDarkMode ? 'bg-[#0E1322] border-slate-500/10' : 'bg-white border-slate-200'
          }`} id="site_login_card">
            
            {/* Logo and Headings */}
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 blur opacity-40 group-hover:opacity-60 transition duration-1000"></div>
                <img 
                  src="/apple-touch-icon.png" 
                  alt={shopName} 
                  referrerPolicy="no-referrer"
                  className="relative w-24 h-24 rounded-3xl object-cover shadow-xl border border-white/10"
                />
              </div>
              
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF5D02] bg-[#FF5D02]/5 px-3 py-1 rounded-full">
                  الولوج المؤمن لقاعدة البيانات
                </span>
                <h1 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} pt-2`}>
                  تسجيل الدخول إلى {shopName}
                </h1>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium max-w-sm mx-auto`}>
                  يرجى كتابة اسم المستخدم (اليوزر) وكلمة المرور (الباسورد) لفتح دفاتر الذمم والديون.
                </p>
              </div>
            </div>

            <form onSubmit={handleSiteLoginSubmit} className="space-y-4 pt-2">
              {siteLoginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs text-center font-bold">
                  ⚠️ {siteLoginError}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5 text-right">
                <label className={`block text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  اسم المستخدم (اليوزر) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={enteredSiteUsername}
                    onChange={(e) => {
                      setEnteredSiteUsername(e.target.value);
                      setSiteLoginError('');
                    }}
                    placeholder="أدخل اسم المستخدم (اليوزر)"
                    className={`w-full text-right pr-11 pl-4 py-3.5 border rounded-2xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#FF5D02]/20 ${
                      isDarkMode ? 'bg-[#090D16] border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 text-right">
                <label className={`block text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  كلمة المرور (الباسورد) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    value={enteredSitePassword}
                    onChange={(e) => {
                      setEnteredSitePassword(e.target.value);
                      setSiteLoginError('');
                    }}
                    placeholder="أدخل كلمة المرور (الباسورد)"
                    className={`w-full text-right pr-11 pl-4 py-3.5 border rounded-2xl text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#FF5D02]/20 ${
                      isDarkMode ? 'bg-[#090D16] border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <span>الولوج وفتح الدفاتر المحاسبية</span>
                <Sparkles size={16} />
              </button>
            </form>

            <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 border-t border-dashed border-slate-500/10">
              <span>برمجة وتأمين: مكتب الرسام</span>
              <span>الولوج الافتراضي: admin / 1234</span>
            </div>
            
          </div>
        </div>
      ) : (
        <>
      
      {/* ---- NATIVE ANDROID STYLE BAR / HEADER ---- */}
      <header className={`border-b px-4 md:px-8 py-4 sticky top-0 z-40 transition-colors duration-300 shadow-lg shrink-0 ${
        isDarkMode ? 'bg-[#0B0F19] border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`} id="header_container">
        <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between gap-3">
          
          {/* Left Corner Buttons (Safe exit, Database clear, Reload, Dark mode) */}
          <div className="flex items-center gap-2" id="header_control_buttons">
            <button
              onClick={() => {
                setConfirmModal({
                  isOpen: true,
                  title: 'تسجيل الخروج الآمن',
                  message: `هل تريد الخروج المقفل والآمن للنظام وتأمين دفاتر حسابات ${shopName} الحالية؟`,
                  confirmText: 'نعم، خروج آمن',
                  cancelText: 'إلغاء الخروج',
                  isDanger: false,
                  onConfirm: () => {
                    sessionStorage.removeItem('al_rassam_site_logged_in_v2');
                    sessionStorage.removeItem('al_rassam_admin_unlocked_session_v2');
                    setIsSiteLoggedIn(false);
                    setIsAdminUnlocked(false);
                    showNotification(`إيقاف الجلسة وتأمين دفاتر حسابات ${shopName} بنجاح`, 'info');
                    setConfirmModal(null);
                  }
                });
              }}
              title="خروج آمن من النظام"
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-[13px] font-bold transition shrink-0 active:scale-95 border ${
                isDarkMode
                  ? 'bg-white/10 hover:bg-white/15 border-white/10 text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
              id="btn_logout_secure"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">خروج آمن</span>
            </button>

            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلي'}
              className={`p-2.5 rounded-2xl transition active:scale-95 shrink-0 border ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300' 
                  : 'bg-slate-50 border-slate-200 text-indigo-900 hover:bg-slate-100 hover:border-slate-300'
              }`}
              id="btn_toggle_dark_mode_fast"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={handleResetAppDB}
              title="تصفير الدفاتر"
              className="p-2.5 bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-900/40 hover:bg-rose-900/50 rounded-2xl transition active:scale-95 shrink-0"
              id="btn_reset_db"
            >
              <Trash2 size={18} />
            </button>

            <button
              onClick={handleLoadDemoData}
              title="تحميل البيانات الافتراضية للتجربة"
              className={`p-2.5 rounded-2xl transition active:scale-95 shrink-0 border ${
                isDarkMode
                  ? 'bg-slate-900/80 text-blue-400 hover:text-blue-300 border-slate-800'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100'
              }`}
              id="btn_reload_demo"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Right Brand and sparkling logo inside image */}
          <div className="flex items-center gap-3.5 text-right cursor-pointer" onClick={() => setActiveTab('dashboard')} id="header_brand_badge">
            <div className="text-right">
              <h1 className={`text-base md:text-lg font-black tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {shopName}
              </h1>
              <p className={`text-[10px] font-semibold tracking-normal mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {shopSlogan}
              </p>
            </div>
            
            <div className="p-3 rounded-2xl shadow-md flex items-center justify-center shrink-0 border animate-pulse text-white" style={{
              backgroundColor: colors.hex,
              borderColor: 'rgba(255, 255, 255, 0.15)'
            }}>
              <Sparkles size={18} className="text-white fill-white" />
            </div>
          </div>

        </div>
      </header>

      {/* ---- TOAST SENSORY NOTIFICATION ---- */}
      {toast && (
        <div 
          id="toast_notification"
          className={`fixed top-5 left-5 z-50 max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl transition-all border animate-slide-in-left ${
            toast.type === 'error' 
              ? 'bg-rose-950/90 border-rose-800 text-rose-200' 
              : toast.type === 'info' 
              ? 'bg-blue-950/90 border-blue-800 text-blue-200' 
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="text-rose-400 shrink-0 animate-bounce" size={18} />
          ) : (
            <CheckCircle className="text-emerald-400 shrink-0" size={18} />
          )}
          <span className="text-xs leading-relaxed text-right font-medium">{toast.message}</span>
        </div>
      )}

      {/* ---- CENTRAL LAYOUT CONTAINER (MOBILE SHELL STYLED) ---- */}
      <div className="flex-1 w-full max-w-md md:max-w-xl mx-auto px-4 pt-4 pb-28 flex flex-col min-w-0" id="app_body_container">
        
        {/* =======================================================
            TAB VIEW: DASHBOARD (الرئيسية)
           ======================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in" id="screen_dashboard">
            
            {/* 1. Large Blue Gradient Statement Card as in image */}
            <div className="bg-gradient-to-b from-[#2552fc] to-[#0d164d] rounded-[32px] p-6 text-white text-center shadow-2xl relative overflow-hidden border border-blue-600/20" id="main_blue_panel">
              
              {/* Top ambient lights */}
              <div className="absolute top-0 right-1/4 w-32 h-32 bg-blue-400/20 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
              
              <div className="relative z-10 space-y-4">
                <span className="text-[12px] font-bold text-slate-300 tracking-wider">
                  إجمالي ديون العملاء المطلوبة
                </span>
                
                {/* Dynamically computes the cumulative debt balance */}
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-wider font-mono">
                  {formatCurrency(totalRemaining)}
                </h2>

                {/* 4 Inner Grid Sub-Cards - Matches Image EXACTLY */}
                <div className="grid grid-cols-2 gap-3 pt-4" id="image_subcards_grid">
                  
                  {/* Card 1: عدد زبائن المكتب */}
                  <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-2xl p-3 text-center flex flex-col justify-between min-h-[92px]">
                    <span className="text-[10px] text-slate-300 font-bold block">
                      عدد زبائن المكتب
                    </span>
                    <span className="text-xl font-extrabold text-white mt-2 block font-mono">
                      {customers.length}
                    </span>
                  </div>

                  {/* Card 2: تنبيهات التأخير (15+ يوم) */}
                  <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-2xl p-3 text-center flex flex-col justify-between min-h-[92px]">
                    <span className="text-[10px] text-slate-300 font-bold block leading-tight">
                      تنبيهات التأخر (15+ يوم)
                    </span>
                    <span className="text-xl font-extrabold text-[#FF9F0A] mt-2 block font-mono">
                      {overdue15DaysCount}
                    </span>
                  </div>

                  {/* Card 3: تجاوز الديون للحد الأقصى */}
                  <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-2xl p-3 text-center flex flex-col justify-between min-h-[92px]">
                    <span className="text-[10px] text-slate-300 font-bold block leading-tight">
                      تجاوز الديون للحد الأقصى
                    </span>
                    <span className="text-xl font-extrabold text-white mt-2 block font-mono">
                      {exceededLimitsCount}
                    </span>
                  </div>

                  {/* Card 4: العملاء المتأخرون (شهر+) */}
                  <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md rounded-2xl p-3 text-center flex flex-col justify-between min-h-[92px]">
                    <span className="text-[10px] text-slate-300 font-bold block leading-tight">
                      الزبائن المتأخرين (شهر+)
                    </span>
                    <span className="text-xl font-extrabold text-[#FF453A] mt-2 block font-mono animate-pulse">
                      {overdueAlertsCount}
                    </span>
                  </div>

                </div>

              </div>
            </div>

            {/* 2. Action Shortcuts Styled exactly like image buttons with modern cards */}
            <div className="space-y-3" id="primary_shortcuts_grid">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider text-right px-1">
                الوصول والعمليات السريعة
              </h3>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Add Customer Card Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customers');
                    // Focus name input on delay
                    setTimeout(() => {
                      document.getElementById('customer_name_input')?.focus();
                    }, 100);
                  }}
                  className="bg-white text-slate-900 rounded-[28px] p-5 text-right flex flex-col items-start justify-between min-h-[140px] hover:shadow-lg transition-transform duration-200 active:scale-95 text-right cursor-pointer shadow-md group border border-slate-100/10"
                >
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <UserPlus size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 block">زبون جديد</h4>
                    <span className="text-[11px] text-slate-500 font-medium block mt-1">
                      تسجيل زبون للاستوديو
                    </span>
                  </div>
                </button>

                {/* Add Debt Card Shortcut */}
                <button
                  type="button"
                  onClick={() => setActiveTab('add-debt')}
                  className="bg-white text-slate-900 rounded-[28px] p-5 text-right flex flex-col items-start justify-between min-h-[140px] hover:shadow-lg transition-transform duration-200 active:scale-95 text-right cursor-pointer shadow-md group border border-slate-100/10"
                >
                  <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl">
                    <PlusCircle size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 block">دين جديد</h4>
                    <span className="text-[11px] text-slate-500 font-medium block mt-1">
                      تسجيل عملية ذمم مالية
                    </span>
                  </div>
                </button>

                {/* Pay Installment Card Shortcut */}
                <button
                  type="button"
                  onClick={() => setActiveTab('add-payment')}
                  className="bg-white text-slate-900 rounded-[28px] p-5 text-right flex flex-col items-start justify-between min-h-[140px] hover:shadow-lg transition-transform duration-200 active:scale-95 text-right cursor-pointer shadow-md group border border-slate-100/10"
                >
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <Wallet size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 block">دفعة جديدة</h4>
                    <span className="text-[11px] text-slate-500 font-medium block mt-1">
                      تسجيل المقبوضات والدفعات الواصلة
                    </span>
                  </div>
                </button>

                {/* Financial Ledger Shortcuts */}
                <button
                  type="button"
                  onClick={() => setActiveTab('statements')}
                  className="bg-white text-slate-900 rounded-[28px] p-5 text-right flex flex-col items-start justify-between min-h-[140px] hover:shadow-lg transition-transform duration-200 active:scale-95 text-right cursor-pointer shadow-md group border border-slate-100/10"
                >
                  <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl">
                    <FileText size={22} className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 block">كشف مالي</h4>
                    <span className="text-[11px] text-slate-500 font-medium block mt-1">
                      عرض التقارير المحاسبية
                    </span>
                  </div>
                </button>

              </div>
            </div>

            {/* 3. Top / Overdue Warnings box dynamically built */}
            {exceededLimitsCount > 0 && (
              <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-4.5 flex gap-3 text-right">
                <AlertCircle className="text-rose-400 shrink-0" size={20} />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-rose-300">تجاوز الحد الأقصى للمطالبات المالية</h4>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    يوجد حالياً {exceededLimitsCount} زبائن تخطت مديونياتهم السقف المحدد البالغ ({formatCurrency(maxDebtLimit)}). يوصى بالتواصل معهم للتنـزيل والتحصيل النقدى.
                  </p>
                </div>
              </div>
            )}

            {/* 3.1 Overdue Debts Alerts List (> 30 days / 1 month) */}
            {overdueAlertsCount > 0 && (
              <div className={`border rounded-[24px] p-5 space-y-3 text-right transition-colors ${
                isDarkMode ? 'bg-amber-950/15 border-amber-500/20' : 'bg-amber-50/50 border-amber-200 shadow-xs'
              }`} id="overdue_debts_alert_panel">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-800'
                  }`}>
                    مطالبات تجاوزت شهراً ⏳
                  </span>
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                    <span>{overdueAlertsCount} زبائن بحاجة لمتابعة</span>
                    <AlertTriangle size={15} />
                  </div>
                </div>

                <p className={`text-[11px] leading-normal ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  العملاء أدناه لديهم ذمم مالية معلّقة لم يتم تسديدها أو تعديلها منذ أكثر من شهر (30 يوماً). بإمكانك تذكيرهم بالدفع مباشرة:
                </p>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {customers
                    .map(c => {
                      const overdueDays = getOverdueDays(c.id);
                      if (overdueDays < 30) return null;
                      const summary = getCustomerLedgerSummary(c.id);
                      return { customer: c, overdueDays, balance: summary.balance };
                    })
                    .filter((item): item is { customer: typeof customers[0]; overdueDays: number; balance: number } => item !== null)
                    .map(({ customer, overdueDays, balance }) => {
                      const messageText = whatsappTemplate
                        .replace('{المبلغ}', formatCurrency(balance))
                        .replace('{amount}', formatCurrency(balance));
                      return (
                        <div 
                          key={customer.id}
                          className={`p-3 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 transition-all duration-200 ${
                            isDarkMode ? 'bg-amber-950/20 border-amber-500/10 hover:border-amber-500/25' : 'bg-white border-amber-100 hover:border-amber-200 shadow-xs'
                          }`}
                        >
                          <div className="text-right">
                            <span className={`font-extrabold text-xs block ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{customer.name}</span>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-[10px] text-red-500 font-black">
                                رصيد الذمة: {formatCurrency(balance)}
                              </span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <span className="text-[10px] text-amber-500 font-bold">
                                متأخر منذ {overdueDays} يوماً
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            {customer.phone && customer.phone !== 'بدون رقم هاتف' && (
                              <a
                                href={getWhatsAppLink(customer.phone, messageText)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-[10px] font-bold rounded-xl bg-emerald-600 dark:bg-emerald-600/90 text-white hover:bg-emerald-700 transition flex items-center gap-1"
                              >
                                <MessageCircle size={12} />
                                <span>تذكير</span>
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomerIdForStatement(customer.id);
                                setActiveTab('statements');
                              }}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition ${
                                isDarkMode 
                                  ? 'bg-slate-800 border-slate-700 text-slate-350 hover:bg-slate-750' 
                                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              الكشف
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 4. Mini Transactions Feed */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3" id="mini_tx_history_feed">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-bold text-slate-200">أحدث العمليات</span>
                <button
                  onClick={() => setActiveTab('statements')}
                  className="text-[10px] text-blue-400 font-bold hover:underline"
                >
                  كشف شامل كلياً
                </button>
              </div>

              {transactions.length > 0 ? (
                <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto pr-1">
                  {transactions.slice(0, 4).map((tx) => {
                    const client = customers.find(c => c.id === tx.customerId);
                    return (
                      <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="text-right">
                          <span className="font-bold text-slate-100 block">
                            {client ? client.name : 'زبون غير مضاف للدفاتر'}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{tx.note}</span>
                        </div>
                        <div className="text-left shrink-0">
                          <span className={`font-mono font-bold block ${tx.type === 'debt' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {tx.type === 'debt' ? '+' : '-'} {formatCurrency(tx.amount)}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{formatDate(tx.date)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-500">لا توجد أي قيد مالي في النظام اليوم.</p>
              )}
            </div>

          </div>
        )}

        {/* =======================================================
            TAB VIEW: CUSTOMERS (الزبائن)
           ======================================================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fade-in" id="screen_customers">
            
            <div className="border-b border-slate-800 pb-3 text-right">
              <h2 className="text-lg font-bold text-white">إدارَة أسماء وعملاء الدفتر</h2>
              <p className="text-xs text-slate-400 mt-1">سجل تفاصيل الزبائن، أرقام الهواتف وتفقد مديونية كل منهم المتبقية.</p>
            </div>

            {/* Quick Register Customer */}
            <form onSubmit={handleAddCustomer} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4.5 space-y-4" id="form_add_customer">
              <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <UserPlus size={15} className="text-[#FF9200]" />
                <span>إضافة زبون محاسبي جديد</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label htmlFor="customer_name_input" className="block text-[11px] font-bold text-slate-300 mb-1.5 text-right">
                    الاسم الثلاثي أو المكتب <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customer_name_input"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="مثال: شركة الرافدين"
                    className="w-full text-right px-3.5 py-2.5 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 placeholder-slate-600"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="customer_phone_input" className="block text-[11px] font-bold text-slate-300 mb-1.5 text-right">
                    رقم الهاتف للاتصال والمطالبة
                  </label>
                  <input
                    type="text"
                    id="customer_phone_input"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="مثال: 0770XXXXXXX"
                    className="w-full text-right px-3.5 py-2.5 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 placeholder-slate-600"
                  />
                </div>

                <div>
                  <label htmlFor="customer_initial_amount_input" className="block text-[11px] font-bold text-slate-300 mb-1.5 text-right">
                    المبلغ الكلي المستمر (رصيد أولي كدين)
                  </label>
                  <input
                    type="text"
                    id="customer_initial_amount_input"
                    value={custInitialCommitment}
                    onChange={(e) => handleCommaFormattedChange(e.target.value, setCustInitialCommitment)}
                    placeholder="مثال: 150,000 (اختياري)"
                    className="w-full text-right px-3.5 py-2.5 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-white font-bold focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 placeholder-slate-700 placeholder:font-normal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="customer_goods_type_input" className="block text-[11px] font-bold text-slate-300 mb-1.5 text-right">
                    نوع البضاعة / صنف زبون المطبوعات
                  </label>
                  <input
                    type="text"
                    id="customer_goods_type_input"
                    value={custGoodsType}
                    onChange={(e) => setCustGoodsType(e.target.value)}
                    placeholder="مثال: يافطات فلكس ومطبوعات عامة، شركات المقاولات..."
                    className="w-full text-right px-3.5 py-2.5 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 placeholder-slate-600"
                  />
                </div>

                <div>
                  <label htmlFor="customer_notes_input" className="block text-[11px] font-bold text-slate-300 mb-1.5 text-right">
                    ملاحظات إدارية وإضافية حول الزبون
                  </label>
                  <input
                    type="text"
                    id="customer_notes_input"
                    value={custNotes}
                    onChange={(e) => setCustNotes(e.target.value)}
                    placeholder="مثال: يسدد نقداً عند بلوغ ربع مليون غلق الحساب المالي..."
                    className="w-full text-right px-3.5 py-2.5 bg-[#090D16] border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-[#FF5E00] to-[#FF9200] hover:opacity-90 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <PlusCircle size={15} />
                  <span>تسجيل الزبون فوراً</span>
                </button>
              </div>
            </form>

            {/* Customer List Section */}
            <div className="space-y-3.5" id="customer_list_block">
              
              {/* Search Customer Input */}
              <div className="relative">
                <span className="absolute inset-y-0 right-3.5 flex items-center text-slate-600">
                  <Search size={15} />
                </span>
                <input
                  type="text"
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  placeholder="ابحث بالاسم أو برقم الهاتف ضمن القائمة..."
                  className="w-full text-right pl-3.5 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-slate-600"
                />
              </div>

              {/* Customer Cards */}
              {filteredCustomersList.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {filteredCustomersList.map((customer) => {
                    const summary = getCustomerLedgerSummary(customer.id);
                    const isExceeded = summary.balance > maxDebtLimit;
                    const isCurrentlyEditing = editingCustomerId === customer.id;

                    if (isCurrentlyEditing) {
                      return (
                        <div 
                          key={customer.id} 
                          className={`p-4 rounded-2xl border transition-colors ${
                            isDarkMode ? 'bg-[#0B0F19] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-md'
                          }`}
                        >
                          <div className="space-y-3.5">
                            <span className="text-[10px] uppercase tracking-wide text-amber-500 font-bold block text-right">قيد تعديل بيانات الزبون</span>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className={`block text-[10px] font-bold mb-1 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>الاسم الجديد</label>
                                <input
                                  type="text"
                                  value={editingCustName}
                                  onChange={(e) => setEditingCustName(e.target.value)}
                                  className={`w-full text-right px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                                    isDarkMode ? 'bg-[#090D16] border-slate-850 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                                  }`}
                                  required
                                />
                              </div>
                              <div>
                                <label className={`block text-[10px] font-bold mb-1 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>رقم الهاتف الجديد</label>
                                <input
                                  type="text"
                                  value={editingCustPhone}
                                  onChange={(e) => setEditingCustPhone(e.target.value)}
                                  className={`w-full text-right px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                                    isDarkMode ? 'bg-[#090D16] border-slate-850 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className={`block text-[10px] font-bold mb-1 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>صنف البضاعة الجديد</label>
                                <input
                                  type="text"
                                  value={editingCustGoodsType}
                                  onChange={(e) => setEditingCustGoodsType(e.target.value)}
                                  className={`w-full text-right px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                                    isDarkMode ? 'bg-[#090D16] border-slate-850 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                                  }`}
                                />
                              </div>
                              <div>
                                <label className={`block text-[10px] font-bold mb-1 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>الملاحظات الجديدة</label>
                                <input
                                  type="text"
                                  value={editingCustNotes}
                                  onChange={(e) => setEditingCustNotes(e.target.value)}
                                  className={`w-full text-right px-3 py-2 text-xs rounded-lg border focus:outline-none ${
                                    isDarkMode ? 'bg-[#090D16] border-slate-850 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                                  }`}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleEditCustomerSave(customer.id)}
                                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg text-white transition flex items-center gap-1 cursor-pointer bg-blue-600 hover:bg-blue-700`}
                              >
                                <CheckCircle size={13} />
                                <span>حفظ وتأكيد</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingCustomerId(null)}
                                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer ${
                                  isDarkMode ? 'bg-slate-850 hover:bg-slate-800 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                <X size={13} />
                                <span>إلغاء</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={customer.id} 
                        className={`p-4 border rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                          isDarkMode ? 'bg-slate-900/40 border-slate-800/80 text-white' : 'bg-white border-slate-200 text-slate-1000 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                            isDarkMode ? 'bg-slate-800 border-slate-750 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
                          }`}>
                            <User size={18} />
                          </div>
                          <div className="text-right">
                            <h4 className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{customer.name}</h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                              <span className={`text-[10px] font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{customer.phone}</span>
                              {customer.goodsType && (
                                <>
                                  <span className="text-[10px] text-slate-600 dark:text-slate-500">•</span>
                                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                    isDarkMode ? 'bg-[#FF5E00]/15 text-[#FF9200]' : 'bg-orange-50 text-orange-700'
                                  }`}>
                                    صنف البضاعة: {customer.goodsType}
                                  </span>
                                </>
                              )}
                              {getOverdueDays(customer.id) >= 30 && (
                                <>
                                  <span className="text-[10px] text-slate-605 dark:text-slate-500">•</span>
                                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 flex items-center gap-0.5" title="تجاوز هذا الحساب مدة 30 يوماً دون تسديد أو حركات">
                                    <span>متأخر {getOverdueDays(customer.id)} يوماً ⏳</span>
                                  </span>
                                </>
                              )}
                            </div>
                            {customer.notes && (
                              <p className={`text-[10px] sm:text-[11px] mt-1.5 border-t border-dashed dark:border-slate-850 border-slate-200/55 pt-1.5 ${
                                isDarkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>
                                <span className="font-bold dark:text-slate-500 text-slate-400">ملاحظات:</span> {customer.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-3 shrink-0">
                          
                          {/* Debt indicator */}
                          <div className={`text-right px-2.5 py-1 border rounded-lg min-w-[102px] ${
                            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}>
                            <span className={`text-[9px] block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>صافي الذمة</span>
                            <span className={`text-xs font-bold font-mono block mt-0.5 ${summary.balance > 0 ? 'text-red-500 font-extrabold' : (isDarkMode ? 'text-slate-400' : 'text-slate-500')}`}>
                              {formatCurrency(summary.balance)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 pt-1">
                            {customer.phone && customer.phone !== 'بدون رقم هاتف' && (
                              <a
                                href={getWhatsAppLink(
                                  customer.phone,
                                  whatsappTemplate
                                    .replace('{المبلغ}', formatCurrency(summary.balance))
                                    .replace('{amount}', formatCurrency(summary.balance))
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="مراسلة ودخول سريع عبر واتساب"
                                className="flex items-center justify-center gap-1 px-2.5 py-1.5 font-bold rounded-xl text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm active:scale-95 shrink-0"
                              >
                                <MessageCircle size={13} />
                                <span>واتساب</span>
                              </a>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomerIdForStatement(customer.id);
                                setActiveTab('statements');
                              }}
                              className={`px-2.5 py-1.5 font-bold rounded-xl text-[10px] border transition ${
                                isDarkMode 
                                  ? 'bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border-blue-800/30' 
                                  : 'bg-blue-50 hover:bg-blue-100 text-blue-750 border-blue-200/50'
                              }`}
                            >
                              الكشف المالي
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setEditingCustomerId(customer.id);
                                setEditingCustName(customer.name);
                                setEditingCustPhone(customer.phone === 'بدون رقم هاتف' ? '' : customer.phone);
                                setEditingCustGoodsType(customer.goodsType || '');
                                setEditingCustNotes(customer.notes || '');
                              }}
                              title="تعديل بيانات العميل"
                              className={`p-1.5 rounded-lg transition ${
                                isDarkMode ? 'text-slate-500 hover:text-amber-400 hover:bg-slate-800/40' : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                              }`}
                            >
                              <Edit size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                              title="حذف العميل"
                              className={`p-1.5 rounded-lg transition ${
                                isDarkMode ? 'text-slate-500 hover:text-rose-500 hover:bg-slate-800/40' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-150'
                              }`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center py-12 text-xs text-slate-6001">لا يوجد عملاء يطابقون شروط البحث.</p>
              )}

            </div>

          </div>
        )}

        {/* =======================================================
            TAB VIEW: ADD DEBT (دين جديد)
           ======================================================= */}
        {activeTab === 'add-debt' && (
          <div className="space-y-6 animate-fade-in" id="screen_add_debt">
            
            <div className={`border-b pb-3 text-right ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>تسجيل وتأكيد دين جديد</h2>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>سجل ثمن الخدمات والمطبوعات الإعلانية الصادرة الآجلة لعملاء {shopName}.</p>
            </div>

            <form onSubmit={handleAddDebt} className={`border p-5 rounded-2xl space-y-5 ${
              isDarkMode ? 'bg-[#0B0F19]/40 border-slate-800/85' : 'bg-white border-slate-200 shadow-sm'
            }`} id="form_add_debt">
              
              {/* Customer Dropdown fetch Dynamically */}
              <div>
                <SearchableDropdown
                  id="debt_dropdown_trigger"
                  customers={customers}
                  selectedCustomerId={debtCustomerId}
                  onSelect={(id) => setDebtCustomerId(id)}
                  isDarkMode={isDarkMode}
                  placeholder="اختر اسم العميل المطلوب قيد الدين عليه..."
                  onAddNewCustomerClick={() => {
                    setActiveTab('customers');
                    showNotification('يرجى كتابة الاسم لإضافة الـعميل الجديد أولاً', 'info');
                  }}
                />
              </div>

              {/* ---- START OF MATERIALS (الخدمات والمواد) SECTION ---- */}
              <div className={`p-4 rounded-xl border space-y-4 ${
                isDarkMode ? 'bg-[#090D16]/40 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b pb-2.5 border-dashed border-slate-800/10 dark:border-slate-800/50" id="materials_header">
                  <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    حساب تكاليف المواد تفصيلياً (اختياري)
                  </span>
                  <h3 className={`text-xs font-black flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                     تفاصيل المواد والمبيوعات
                    <FileText size={14} className="text-[#FF5E00]" />
                  </h3>
                </div>

                {/* Material Inputs Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end" id="material_inputs_row">
                  {/* Name field */}
                  <div className="sm:col-span-5">
                    <label className={`block text-[10px] font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>اسم المادة / المطبوع</label>
                    <input
                      type="text"
                      placeholder="مثال: يافطة فلكس أو كارت شخصي"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className={`w-full text-right px-3 py-2.5 rounded-xl text-xs focus:outline-none ${
                        isDarkMode ? 'bg-[#0E1322] border border-slate-800 text-white placeholder-slate-700' : 'bg-white border border-slate-300 text-slate-950 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-2">
                    <label className={`block text-[10px] font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>الكمية</label>
                    <input
                      type="number"
                      min="1"
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      className={`w-full text-center px-2 py-2.5 rounded-xl text-xs focus:outline-none ${
                        isDarkMode ? 'bg-[#0E1322] border border-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-950'
                      }`}
                    />
                  </div>

                  {/* Unit price */}
                  <div className="sm:col-span-3">
                    <label className={`block text-[10px] font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>السعر المفرد (د.ع)</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="سعر المفرد..."
                        value={newItemPrice}
                        onChange={(e) => handleCommaFormattedChange(e.target.value, setNewItemPrice)}
                        className={`w-full text-right pl-7 pr-3 py-2.5 rounded-xl text-xs font-bold focus:outline-none ${
                          isDarkMode ? 'bg-[#0E1322] border border-slate-800 text-white focus:border-slate-700' : 'bg-white border border-slate-300 text-slate-950 placeholder-slate-400'
                        }`}
                      />
                      <span className="absolute inset-y-0 left-2.5 flex items-center text-slate-500 text-[10px] font-bold">د.ع</span>
                    </div>
                  </div>

                  {/* Add button */}
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddMaterialToDebt}
                      className={`w-full py-2.5 px-3 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5 ${colors.primary} ${colors.primaryHover}`}
                    >
                      <PlusCircle size={14} />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>

                {/* Materials List Table */}
                {debtItems.length > 0 && (
                  <div className="overflow-x-auto border border-dashed rounded-xl dark:border-slate-800" id="materials_list_table_wrapper">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className={isDarkMode ? 'bg-slate-900/60 text-slate-400' : 'bg-slate-100 text-slate-650'}>
                          <th className="p-2 font-bold border-b text-center w-12 dark:border-slate-850">حذف</th>
                          <th className="p-2 font-bold border-b text-center dark:border-slate-850">المجموع</th>
                          <th className="p-2 font-bold border-b text-center dark:border-slate-850">سعر المفرد</th>
                          <th className="p-2 font-bold border-b text-center w-16 dark:border-slate-850">الكمية</th>
                          <th className="p-2 font-bold border-b text-right pr-4 dark:border-slate-850">اسم المادة / الخدمة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {debtItems.map((item, idx) => (
                          <tr 
                            key={item.id} 
                            className={`border-b last:border-0 ${
                              isDarkMode ? 'border-slate-850 hover:bg-[#0E1322]/40 text-slate-200' : 'border-slate-150 hover:bg-slate-50/70 text-slate-850'
                            }`}
                          >
                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveMaterialFromDebt(item.id)}
                                className="text-rose-500 hover:text-rose-600 transition p-1"
                                title="حذف هذه المادة"
                              >
                                <Trash2 size={13} className="mx-auto" />
                              </button>
                            </td>
                            <td className="p-2 font-mono font-bold text-center">
                              {formatCurrency(item.qty * item.unitPrice)}
                            </td>
                            <td className="p-2 font-mono text-center">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="p-2 font-mono text-center font-bold">
                              {item.qty}
                            </td>
                            <td className="p-2 text-right pr-4 font-semibold">
                              {idx + 1}. {item.name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* ---- END OF MATERIALS (الخدمات والمواد) SECTION ---- */}

              {/* Debt Amount Input */}
              <div>
                <label htmlFor="debt_amount" className={`block text-[11px] font-bold mb-1 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  المبلغ الكلي للدين (دينار عراقي) <span className="text-rose-500">*</span>
                </label>
                <p className={`text-[10px] mb-1.5 text-right ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  (يمكنك كتابة المبلغ يدوياً مباشرة بالكومات، أو تعبئته آلياً عبر إضافة المواد أعلاه)
                </p>
                <div className="relative">
                  <input
                    type="text"
                    id="debt_amount"
                    value={debtAmount}
                    onChange={(e) => handleCommaFormattedChange(e.target.value, setDebtAmount)}
                    placeholder="مثال: 500,000"
                    className={`w-full text-right pl-12 pr-4.5 py-3 rounded-xl text-xs font-bold focus:outline-none ${
                      isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-405'
                    }`}
                    required
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-500 text-[10px] font-bold">د.ع</span>
                </div>

                {/* Tafqeet Translator Display */}
                {parseCommaValue(debtAmount) > 0 && (
                  <div className={`mt-2.5 text-xs px-3 py-2 rounded-xl text-right border ${
                    isDarkMode 
                      ? 'text-slate-305 bg-rose-950/20 border-rose-900/30' 
                      : 'text-rose-900 bg-rose-50/50 border-rose-200/50'
                  }`}>
                    <span className="text-rose-500 font-bold block mb-0.5">صيغة التفقيط المالي للوصول:</span>
                    {translateNumberToArabicWords(parseCommaValue(debtAmount))}
                  </div>
                )}
              </div>

              {/* Debt Date selection */}
              <div>
                <label htmlFor="debt_date" className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                   التاريخ الموثق للدين
                </label>
                <input
                  type="date"
                  id="debt_date"
                  value={debtDate}
                  onChange={(e) => setDebtDate(e.target.value)}
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs focus:outline-none ${
                    isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* What was bought field */}
              <div>
                <label htmlFor="debt_purchase_details" className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-705'}`}>
                  البضاعة المشتراة أو الخدمة (ما الذي اشتراه الزبون؟)
                </label>
                <input
                  type="text"
                  id="debt_purchase_details"
                  value={debtPurchaseDetails}
                  onChange={(e) => setDebtPurchaseDetails(e.target.value)}
                  placeholder="مثال: يافطة غناء، كروت شخصية، فولدرات، إعلان ممول..."
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs focus:outline-none ${
                    isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white placeholder-slate-700' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Debt Details and description */}
              <div>
                <label htmlFor="debt_note" className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-705'}`}>
                  ملاحظات إضافية على وصل الدين
                </label>
                <textarea
                  id="debt_note"
                  rows={3}
                  value={debtNote}
                  onChange={(e) => setDebtNote(e.target.value)}
                  placeholder="جاهز للتجهيز أو التفاصيل الإدارية الإضافية لوصل المحاسبة..."
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs focus:outline-none ${
                    isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white placeholder-slate-705' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2 ${colors.primary} ${colors.primaryHover}`}
              >
                <ArrowUpRight size={16} />
                <span>حفظ وقيد الدين الآجل في الدفتر</span>
              </button>

            </form>

          </div>
        )}

        {/* =======================================================
            TAB VIEW: ADD PAYMENT (دفعة جديدة)
           ======================================================= */}
        {activeTab === 'add-payment' && (
          <div className="space-y-6 animate-fade-in" id="screen_add_payment">
            
            <div className={`border-b pb-3 text-right ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>تسجيل وتدوين دفعة جديدة</h2>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>سجل المبالغ المحصلة من الزبائن نقداً لتنزيل الدفاتر والمطالبات.</p>
            </div>

            <form onSubmit={handleAddPayment} className={`border p-5 rounded-2xl space-y-5 ${
              isDarkMode ? 'bg-[#0B0F19]/40 border-slate-800/85' : 'bg-white border-slate-200 shadow-sm'
            }`} id="form_add_payment">
              
              {/* Dynamic Customer Dropdown for installments */}
              <div>
                <SearchableDropdown
                  id="payment_dropdown_trigger"
                  customers={customers}
                  selectedCustomerId={paymentCustomerId}
                  onSelect={(id) => setPaymentCustomerId(id)}
                  isDarkMode={isDarkMode}
                  placeholder="اختر اسم الزبون المسدد للدفعة..."
                  onAddNewCustomerClick={() => {
                    setActiveTab('customers');
                    showNotification('يرجى كتابة الاسم لإضافة الـعميل الجديد أولاً', 'info');
                  }}
                />
              </div>

              {/* Input Amount */}
              <div>
                <label htmlFor="payment_amount" className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  المبلغ المسدد (دينار عراقي) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="payment_amount"
                    value={paymentAmount}
                    onChange={(e) => handleCommaFormattedChange(e.target.value, setPaymentAmount)}
                    placeholder="مثال: 250,000"
                    className={`w-full text-right pl-12 pr-4.5 py-3 rounded-xl text-xs font-bold focus:outline-none ${
                      isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-405'
                    }`}
                    required
                  />
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-500 text-[10px] font-bold">د.ع</span>
                </div>

                {/* Tafqeet display for Payment */}
                {parseCommaValue(paymentAmount) > 0 && (
                  <div className={`mt-2.5 text-xs px-3 py-2 rounded-xl text-right border ${
                    isDarkMode 
                      ? 'text-slate-300 bg-emerald-950/20 border-emerald-900/30' 
                      : 'text-emerald-900 bg-emerald-50/50 border-emerald-200/50'
                  }`}>
                    <span className="text-emerald-500 font-bold block mb-0.5">صيغة التفقيط المالي للمستلم واصل:</span>
                    {translateNumberToArabicWords(parseCommaValue(paymentAmount))}
                  </div>
                )}
              </div>

              {/* Installments date */}
              <div>
                <label htmlFor="payment_date" className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  تاريخ استلام الدفعة
                </label>
                <input
                  type="date"
                  id="payment_date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs focus:outline-none ${
                    isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="payment_note" className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  ملاحظات الاستلام الدفتري
                </label>
                <textarea
                  id="payment_note"
                  rows={2}
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="مثال: تسديد نقدي مباشر، أو تحويل زين كاش للمندوب"
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs focus:outline-none ${
                    isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white placeholder-slate-705' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                <span>حفظ وتأكيد الدفعة الجديدة للدفتر</span>
              </button>

            </form>

          </div>
        )}

        {/* =======================================================
            TAB VIEW: STATEMENTS (كشف الحساب)
           ======================================================= */}
        {activeTab === 'statements' && (
          <div className="space-y-6 animate-fade-in" id="screen_statements">
            
            <div className="border-b border-slate-800 pb-3 text-right">
              <h2 className="text-lg font-bold text-white">كشوفات الحسابات المطبوعة والذمم</h2>
              <p className="text-xs text-slate-400 mt-1">ابحث، تصفح، واطبع فواتير وكشوفات الحساب الشاملة مع الحساب الإجمالي المتبقي.</p>
            </div>

            {/* Customer select box */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4.5 space-y-4" id="select_statement_cust_group">
              <label className="block text-xs font-bold text-slate-300 mb-1 text-right">
                اختر الزبون لفرز ومعاينة دفتر الحساب الخاص به:
              </label>
              <div className="flex gap-2.5">
                <SearchableDropdown
                  id="report_cust_dropdown"
                  customers={customers}
                  selectedCustomerId={selectedCustomerIdForStatement}
                  onSelect={(id) => setSelectedCustomerIdForStatement(id)}
                  placeholder="ابحث بالاسم لعرض وتوليد الفاتورة..."
                />
              </div>
            </div>

            {/* Statement Screen Render */}
            {activeCustomerRecord ? (
              <div className="space-y-6" id="rendered_statement_view">
                
                {/* 1. Account Metrics info boxes */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">إجمالي ديون ومطالبات</span>
                    <span className="text-sm font-bold text-rose-400 font-mono mt-1 block">
                      {formatCurrency(activeStatementSummary.debts)}
                    </span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
                    <span className="text-[10px] text-slate-500 block">إجمالي كمية واصل مقبوض</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block">
                      {formatCurrency(activeStatementSummary.payments)}
                    </span>
                  </div>

                  <div className="bg-blue-950/40 border border-blue-900/50 p-3 rounded-2xl">
                    <span className="text-[10px] text-blue-400 block font-bold">الرصيد المغلَق الحالي</span>
                    <span className={`text-sm font-black font-mono mt-1 block ${activeStatementSummary.balance > 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {formatCurrency(activeStatementSummary.balance)}
                    </span>
                  </div>
                </div>

                {/* 2. Ledger list */}
                <div className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0B0F19]/80 p-3 rounded-2xl border border-slate-800">
                    <h3 className="text-xs font-black text-slate-200">دفتر الحركة المفصل وأدوات التصدير</h3>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={printStatement}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-extrabold cursor-pointer hover:bg-slate-100 transition shadow-sm active:scale-95"
                        title="طباعة كشف الحساب الورقي أو حفظه كـ PDF"
                      >
                        <Printer size={13} />
                        <span>طباعة الكشف</span>
                      </button>

                      <button
                        onClick={copyStatementToClipboard}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-slate-100 rounded-xl text-[10px] font-extrabold cursor-pointer hover:bg-slate-705 transition shadow-sm active:scale-95"
                        title="نسخ صيغة الفاتورة والكشف كامل للحافظة"
                      >
                        <Copy size={13} className="text-blue-400" />
                        <span>نسخ الفاتورة</span>
                      </button>

                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          shareStatementViaWhatsApp();
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-extrabold cursor-pointer hover:bg-emerald-700 transition shadow-sm active:scale-95 animate-pulse"
                        title="إرسال كشف حساب مفصل ومباشر للزبون عبر واتساب"
                      >
                        <MessageCircle size={13} className="text-emerald-200" />
                        <span>إرسال واتساب</span>
                      </a>

                      <button
                        onClick={exportStatementToCSV}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#FF5E00]/90 text-white rounded-xl text-[10px] font-extrabold cursor-pointer hover:bg-[#FF5E00] transition shadow-sm active:scale-95"
                        title="تنزيل كشف الحساب الحالي كملف excel منسق بالكامل"
                      >
                        <FileText size={13} className="text-orange-200" />
                        <span>ملف Excel</span>
                      </button>
                    </div>
                  </div>

                  {activeCustomerLedger.length > 0 ? (
                    <div className="border border-slate-850 bg-slate-950/60 rounded-2xl divide-y divide-slate-850 overflow-hidden" id="ledger_table">
                      {activeCustomerLedger.map((tx) => (
                        <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${tx.type === 'debt' ? 'bg-rose-500 shadow-sm shadow-rose-500/20' : 'bg-emerald-500 shadow-sm shadow-emerald-500/20'}`} />
                            <div className="text-right">
                              <span className={`font-bold block ${isDarkMode ? 'text-slate-100' : 'text-slate-905'}`}>{tx.note}</span>
                              
                              {tx.items && tx.items.length > 0 && (
                                <div className={`mt-2 p-2.5 rounded-xl text-[11px] border leading-relaxed ${
                                  isDarkMode 
                                    ? 'bg-[#0E1322] border-slate-800 text-slate-300' 
                                    : 'bg-slate-50 border-slate-205 text-slate-700'
                                }`}>
                                  <span className="font-bold block text-[10px] text-rose-500 mb-1">تفاصيل المواد المحسوبة:</span>
                                  <div className="space-y-1">
                                    {tx.items.map((item, idx) => (
                                      <div key={item.id} className="flex justify-between gap-4 border-b last:border-0 pb-1 border-dashed border-slate-800/10 dark:border-slate-800/30">
                                        <span>{idx + 1}. {item.name} ({item.qty} × {formatCurrency(item.unitPrice)})</span>
                                        <span className="font-mono font-bold text-[#FF5E00]">{formatCurrency(item.qty * item.unitPrice)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <span className="text-[10px] text-slate-500 font-mono block mt-1">{formatDate(tx.date)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`font-mono font-bold ${tx.type === 'debt' ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {tx.type === 'debt' ? '+' : '-'} {formatCurrency(tx.amount)}
                            </span>
                            <button
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="text-slate-600 hover:text-rose-500 transition p-1"
                              title="حذف العملية"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-xs text-slate-600">هذا العميل ليس لديه أي معاملات محاسبية مسجلة.</p>
                  )}
                </div>

                {/* 3. Printable invoice blueprint wrapper with pure beautiful signature matching requirements */}
                <div className="hidden print:block absolute inset-0 bg-white text-slate-900 p-8 direction-rtl text-right font-sans z-[1000] w-full" id="print_bill_template">
                  <div className="border-2 border-slate-900 rounded-2xl p-6 space-y-6">
                    
                    {/* Invoice header */}
                    <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                      <div className="text-right">
                        <h1 className="text-2xl font-black text-slate-900">{shopName}</h1>
                        <p className="text-xs text-slate-600 font-semibold mt-1">للإدارة والمطبوعات الإعلانية والمحاسبية</p>
                        <p className="text-[10px] text-slate-500 mt-1">تاريخ الكشف: {formatDate(new Date().toISOString())}</p>
                      </div>
                      <div className="text-left">
                        <span className="border border-slate-900 font-mono font-bold px-3 py-1.5 rounded-lg text-sm bg-slate-50 text-slate-900">
                          كشف حساب زبون مالي
                        </span>
                      </div>
                    </div>

                    {/* Customer info */}
                    <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-500 font-medium block">اسم المكلف / الزبون:</span>
                        <span className="text-sm font-extrabold text-slate-950 mt-1 block">{activeCustomerRecord.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium block">رقم الهاتف الدفتري:</span>
                        <span className="text-sm font-bold text-slate-950 font-mono mt-1 block">{activeCustomerRecord.phone}</span>
                      </div>
                    </div>

                    {/* Invoice financial stats */}
                    <table className="w-full text-xs text-right border-collapse border border-slate-300">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-300 p-2 font-bold text-slate-900">الحالة والمستند</th>
                          <th className="border border-slate-300 p-2 font-bold text-slate-900">المبلغ</th>
                          <th className="border border-slate-300 p-2 font-bold text-slate-900">التاريخ</th>
                          <th className="border border-slate-300 p-2 font-bold text-slate-900">الملاحظات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeCustomerLedger.map((tx) => (
                          <tr key={tx.id}>
                            <td className="border border-slate-300 p-2 font-bold text-center">
                              {tx.type === 'debt' ? 'دين ومستند صادرات' : 'دفعة مستلمة واصلة'}
                            </td>
                            <td className="border border-slate-300 p-2 font-mono font-bold text-center">
                              {tx.type === 'debt' ? '+' : '-'} {formatCurrency(tx.amount)}
                            </td>
                            <td className="border border-slate-300 p-2 font-mono text-center">{formatDate(tx.date)}</td>
                            <td className="border border-slate-300 p-2 text-right">
                              <span className="font-bold text-slate-900 block">{tx.note}</span>
                              {tx.items && tx.items.length > 0 && (
                                <div className="mt-2 text-[10px] text-slate-800 border border-dashed border-slate-300 rounded-[#12px] p-2.5 bg-slate-50">
                                  <div className="font-bold border-b pb-1 mb-1 border-slate-200">الأصناف التابعة للمستند:</div>
                                  <div className="space-y-1">
                                    {tx.items.map((item, idx) => (
                                      <div key={item.id} className="flex justify-between gap-4 border-b last:border-0 pb-0.5 border-slate-200 border-dashed">
                                        <span>{idx + 1}. {item.name} ({item.qty} × {item.unitPrice.toLocaleString('en-US')} د.ع)</span>
                                        <span className="font-bold font-mono">{(item.qty * item.unitPrice).toLocaleString('en-US')} د.ع</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-slate-50">
                          <td className="border border-slate-300 p-2 font-bold" colSpan={3}>مجموع الديون الصادرة المطلوبة:</td>
                          <td className="border border-slate-300 p-2 font-mono font-extrabold text-red-700">{formatCurrency(activeStatementSummary.debts)}</td>
                        </tr>
                        <tr className="bg-slate-50">
                          <td className="border border-slate-300 p-2 font-bold" colSpan={3}>مجموع المدفوعات المستلمة واصل:</td>
                          <td className="border border-slate-300 p-2 font-mono font-extrabold text-emerald-700">{formatCurrency(activeStatementSummary.payments)}</td>
                        </tr>
                        <tr className="bg-slate-100 font-black">
                          <td className="border border-slate-300 p-2 text-sm" colSpan={3}>الرصيد المغلَق النهائي المطالب به:</td>
                          <td className="border border-slate-300 p-2 text-sm font-mono text-blue-900">{formatCurrency(activeStatementSummary.balance)}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Tafqeet inside Printable Invoice */}
                    {activeCustBalance > 0 && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-right">
                        <span className="font-bold block">التفقيط القانوني للمطالبة المالية:</span>
                        أن صافي الحساب المترتب بالذمة والبالغ قدره <span className="font-bold underline text-blue-900">{translateNumberToArabicWords(activeCustBalance)}</span> لا غيرها، يرجى تزويدنا بالمقاصه في أقرب وقت.
                      </div>
                    )}

                    {/* Signatures footer */}
                    <div className="grid grid-cols-2 gap-8 text-center pt-8 text-xs font-semibold">
                      <div className="space-y-12">
                        <span>إمضاء / ختم {shopName}</span>
                        <div className="h-0.5 w-32 bg-slate-400 mx-auto border-t border-dashed" />
                      </div>
                      <div className="space-y-12">
                        <span>إمضاء وتوقيع المستلم للدفتر</span>
                        <div className="h-0.5 w-32 bg-slate-400 mx-auto border-t border-dashed" />
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 border border-slate-800 rounded-2xl bg-slate-900/10">
                <Info size={28} className="text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-500">يرجى تحديد زبون من مربع البحث أعلاه لمشاهدة وتوليد كشف الحساب والوصولات.</p>
              </div>
            )}

          </div>
        )}

        {/* =======================================================
            TAB VIEW: SETTINGS (الضبط / الإدارة)
           ======================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in" id="screen_settings">
            
            {!isAdminUnlocked ? (
              /* ADMIN LOCK SCREEN CONTAINER */
              <div 
                className={`border p-6 rounded-3xl max-w-md mx-auto text-right space-y-6 ${
                  isDarkMode ? 'bg-[#0E1322] border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-xl'
                }`}
                id="admin_lock_screen"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-3 pt-4">
                  <div className={`p-4 rounded-full ${isDarkMode ? 'bg-[#FF5D02]/10 text-[#FF5D02]' : 'bg-[#FF5D02]/5 text-[#FF5D02]'}`}>
                    <Shield size={36} />
                  </div>
                  <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    رمز الدخول الآمن للوحة الإدارة
                  </h3>
                  <p className={`text-xs px-2 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    يقتصر الدخول إلى لوحة الإدارة المحتفظة بالذمم على الإدارة المعتمدة لتهيئة اسم المتجر، تعديل رسالة مطالبة ديون واتساب، وتعديل وحذف الحركات المالية الخاطئة.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className={`block text-[11px] font-bold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      أدخل الرمز السري للمشرف <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      maxLength={12}
                      value={enteredPasscode}
                      onChange={(e) => {
                        setEnteredPasscode(e.target.value);
                        setShowPasscodeError(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleVerifyPasscode(enteredPasscode);
                        }
                      }}
                      placeholder="••••"
                      className={`w-full text-center tracking-widest px-4 py-3 border rounded-xl text-sm font-mono focus:outline-none ${
                        showPasscodeError 
                          ? 'border-rose-500 bg-rose-500/5 text-rose-500' 
                          : isDarkMode ? 'bg-[#090D16] border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                      }`}
                    />
                    {showPasscodeError && (
                      <p className="text-[10px] text-rose-500 font-bold mt-1.5 text-right">
                        ⚠️ الرمز السري الذي أدخلته غير متطابق مع مفاتيح الإدارة. يرجى المحاولة مجدداً.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleVerifyPasscode(enteredPasscode)}
                    className={`w-full py-3 rounded-xl text-xs font-black text-white hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer ${colors.primary}`}
                  >
                    <Shield size={14} />
                    <span>فـك الـقـفـل وتـخـول الإدارة</span>
                  </button>
                </div>

                <div className={`p-3 rounded-xl border border-dashed text-right text-[10px] sm:text-xs leading-relaxed ${
                  isDarkMode ? 'bg-slate-950/40 border-slate-800 text-slate-500' : 'bg-slate-55 border-slate-200 text-slate-500'
                }`}>
                  💡 <strong>ملاحظة فنية:</strong> الرمز الافتراضي المهيأ من قبل المطور في المرة الأولى هو <code className="font-bold text-[#FF5D02] font-mono mx-0.5 bg-[#FF5D02]/5 px-1 py-0.5 rounded">1234</code>. يمكنك تغيير هذا الرمز لاحقاً في أي وقت من لوحة التحكم من الداخل بعد الدخول.
                </div>
              </div>
            ) : (
              /* UNLOCKED FULL ADMIN PANEL DASHBOARD */
              <div className="space-y-6" id="admin_dashboard_unlocked">
                {/* Header of Admin Panel */}
                <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 text-right ${
                  isDarkMode ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <div>
                    <h2 className={`text-lg font-black flex items-center justify-start gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      <Shield size={18} className="text-[#FF5D02]" />
                      <span>منصة إدارة الحسابات والتحكم بالموقع</span>
                    </h2>
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      تعديل بيانات {shopName}، تعديل القيود المالية، ومراجعة مؤشرات المنشأة الشاملة من داخل التطبيق.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                      🟢 جلسة مصرحة للمشرف
                    </span>
                    
                    <button
                      type="button"
                      onClick={handleLockAdmin}
                      className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[10px] font-bold px-2.5 py-1 rounded-full transition cursor-pointer flex items-center gap-1"
                    >
                      <Lock size={12} />
                      <span>قفل الإدارة</span>
                    </button>
                  </div>
                </div>

                {/* FINANCIAL KPI CARDS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Total Outstanding Balances */}
                  <div className={`p-4 border rounded-2xl text-right ${
                    isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      إجمالي الديون المطلوبة بالذمة
                    </span>
                    <span className="text-xs sm:text-sm font-black font-mono block text-rose-500 mt-1">
                      {formatCurrency(transactions.filter(t => t.type === 'debt').reduce((s, t) => s + t.amount, 0))}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 block leading-normal">
                      بذمة كافة زبائن المكتب
                    </span>
                  </div>

                  {/* Total Collections Received */}
                  <div className={`p-4 border rounded-2xl text-right ${
                    isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      إجمالي المقبوضات (المسدد)
                    </span>
                    <span className="text-xs sm:text-sm font-black font-mono block text-emerald-500 mt-1">
                      {formatCurrency(transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0))}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 block leading-normal">
                      مجموع واصل تسديدات الزبائن
                    </span>
                  </div>

                  {/* Net Outstanding Balance */}
                  <div className={`p-4 border rounded-2xl text-right ${
                    isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      صافي الديون القائمة المتبقية
                    </span>
                    <span className="text-xs sm:text-sm font-black font-mono block text-blue-500 mt-1">
                      {formatCurrency(
                        transactions.filter(t => t.type === 'debt').reduce((s, t) => s + t.amount, 0) -
                        transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0)
                      )}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 block leading-normal">
                      رأس المال النشط المطلوب بالشارع
                    </span>
                  </div>

                  {/* Customer Count */}
                  <div className={`p-4 border rounded-2xl text-right ${
                    isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      عدد الزبائن الكلي بالدفتر
                    </span>
                    <span className={`text-xs sm:text-sm font-black font-mono block mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {customers.length} زبائن
                    </span>
                    <span className="text-[9px] text-slate-500 mt-0.5 block leading-normal">
                      سجلات مضافة ومستقلة للزبائن
                    </span>
                  </div>
                </div>

                {/* EDIT/DELETE BRAND IDENTITY */}
                <div className={`border rounded-2xl p-5 space-y-4 ${
                  isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`} id="settings_brand_identity_card_admin">
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>
                    <Sparkles size={16} className={isDarkMode ? 'text-[#FF5E00]' : 'text-[#FF5E00]'} />
                    <span>إعدادات وتخصيص هوية المتجر/المحلة التجارية</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        اسم المحل / مكتب الحسابات الحالي <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={shopName}
                        onChange={(e) => handleUpdateShopName(e.target.value)}
                        placeholder="مثال: مكتب الرسام للطباعة"
                        className={`w-full text-right px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-bold mb-1.5 text-right ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        الشعار / العبارة الوصفية أسفل الاسم
                      </label>
                      <input
                        type="text"
                        value={shopSlogan}
                        onChange={(e) => handleUpdateShopSlogan(e.target.value)}
                        placeholder="مثال: نظام الديون الفوري والفواتير المحاسبية"
                        className={`w-full text-right px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* EDIT/DELETE WHATSAPP CUSTOM TEMPLATE */}
                <div className={`border rounded-2xl p-5 space-y-4 ${
                  isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`} id="settings_whatsapp_template_card_admin">
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>
                    <MessageCircle size={16} className="text-emerald-500" />
                    <span>قالب رسائل المطالبة المالية عبر واتساب الكليشة</span>
                  </h3>
                  
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    اكتب الكليشة المفضلة لديك وسيقوم التطبيق بإعدادها تلقائياً عند الضغط على واتساب. **هام جداً:** استخدم الرمز <code className="text-[#FF5E00] font-bold">{`{المبلغ}`}</code> في الموضع الذي تود أن يظهر فيه مبلغ دين الزبون.
                  </p>

                  <div>
                    <textarea
                      rows={3}
                      value={whatsappTemplate}
                      onChange={(e) => handleUpdateWhatsappTemplate(e.target.value)}
                      placeholder="اكتب كليشة المطالبة هنا..."
                      className={`w-full text-right px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none font-sans leading-relaxed ${
                        isDarkMode ? 'bg-[#090D16] border-slate-800 text-white focus:border-slate-600' : 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                      }`}
                    />
                  </div>

                  {/* Sample Live Preview */}
                  <div className={`p-4 rounded-xl border text-right space-y-1.5 ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-emerald-50/10 border-emerald-100'
                  }`}>
                    <span className={`text-[10px] font-bold block ${isDarkMode ? 'text-slate-500' : 'text-emerald-700'}`}>
                      👁️ عرض حي ومثال تفاعلي لما سيستلمه العميل:
                    </span>
                    <p className={`text-xs leading-relaxed font-sans whitespace-pre-wrap ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {whatsappTemplate
                        .replace('{المبلغ}', '١٢٥,٠٠٠ دينار عراقي')
                        .replace('{amount}', '125,000 IQD')
                      }
                    </p>
                  </div>
                </div>

                {/* THEME CUSTOMIZER COLORS */}
                <div className={`border rounded-2xl p-5 space-y-4 ${
                  isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`} id="theme_customizer_panel_admin">
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>
                    <Paintbrush size={16} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                    <span>طابع ألوان وهوية التطبيق البصرية (10 خيارات للواجهة)</span>
                  </h3>
                  
                  <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    اختر لون الطابع الذي تفضله للتطبيق؛ سيقوم النظام فوراً بتحديث كافة الأزرار والبطاقات:
                  </p>

                  {/* Theme Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2" id="theme_picker_grid_admin">
                    {Object.entries(themeColors).map(([key, value]) => {
                      const isActive = activeThemeColor === key;
                      return (
                        <button
                          key={key}
                          onClick={() => updateThemeColor(key)}
                          type="button"
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-right transition active:scale-95 cursor-pointer ${
                            isActive
                              ? `${isDarkMode ? 'bg-slate-900 border-white text-white' : 'bg-slate-100 border-slate-950 text-slate-950 font-black'}`
                              : `${isDarkMode ? 'bg-[#090D16] border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`
                          }`}
                        >
                          <span 
                            className="w-4 h-4 rounded-full shrink-0 border border-black/10" 
                            style={{ backgroundColor: value.hex }} 
                          />
                          <span className="text-[11px] font-bold truncate">{value.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dark mode switch card */}
                  <div className={`mt-4 p-3.5 border rounded-xl flex items-center justify-between gap-3 ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="text-right">
                      <span className={`text-xs font-bold block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>وضع راحة العين (الوضع الداكن)</span>
                      <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>تفعيل الخلفية الداكنة المريحة للاستعمال الطويل</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDarkMode ? colors.primary : 'bg-slate-200'
                      }`}
                      id="btn_toggle_dark_inline_admin"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isDarkMode ? '-translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* LIMITS AND SECURITY BLOCK */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* LIMITS CONTROL */}
                  <div className={`border rounded-2xl p-5 space-y-4 ${
                    isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <h3 className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <Settings size={15} className="text-[#FF9200]" />
                      <span>الحد الأقصى المسموح به للديون</span>
                    </h3>
                    
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      إشعار تحذيري عند تجاوز الديون للزبون الواحد.
                    </p>

                    <div className="flex flex-col gap-2">
                      <input
                        type="number"
                        defaultValue={maxDebtLimit}
                        onChange={(e) => handleUpdateMaxLimit(e.target.value)}
                        placeholder="مثال: 500000"
                        className={`w-full text-right px-3.5 py-2.5 border rounded-xl text-xs focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                      {maxDebtLimit > 0 && (
                        <span className="text-[10px] text-emerald-500 font-bold">
                          رصيد السقف الحالي: {formatCurrency(maxDebtLimit)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SECURE PIN CODES MANAGER */}
                  <div className={`border rounded-2xl p-5 space-y-4 ${
                    isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <h3 className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <Lock size={15} className="text-rose-500" />
                      <span>تغيير رمز المرور السري للمسؤول</span>
                    </h3>
                    
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      قم بتغيير كود الإدارة السري لمنع الولوج العبثي غير المفوّض.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={12}
                        value={adminPasscode}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.trim()) {
                            handleUpdatePasscode(val);
                          }
                        }}
                        className={`w-full text-center px-3.5 py-2.5 border rounded-xl text-xs font-mono focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* SITE LOGIN CREDENTIALS MANAGER (تغيير اسم المستخدم وكلمة مرور الموقع) */}
                  <div className={`border rounded-2xl p-5 space-y-4 ${
                    isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <h3 className={`text-xs font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <Shield size={15} className="text-indigo-500" />
                      <span>بيانات تسجيل الدخول للموقع (يوزر وباسورد)</span>
                    </h3>
                    
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      غيّر اليوزر وباسورد اللذين تظهر واجهتهما أول ما يفتح الموقع.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
                      <div>
                        <label className={`block text-[9px] font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>اسم المستخدم الجديد</label>
                        <input
                          type="text"
                          value={siteUsername}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSiteUsername(val);
                            localStorage.setItem('al_rassam_site_username_v2', val);
                          }}
                          className={`w-full text-center px-2 py-2 border rounded-xl text-xs font-mono focus:outline-none ${
                            isDarkMode ? 'bg-[#090D16] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-[9px] font-bold mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>كلمة المرور الجديدة</label>
                        <input
                          type="text"
                          value={sitePassword}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSitePassword(val);
                            localStorage.setItem('al_rassam_site_password_v2', val);
                          }}
                          className={`w-full text-center px-2 py-2 border rounded-xl text-xs font-mono focus:outline-none ${
                            isDarkMode ? 'bg-[#090D16] border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MASTER LEDGER CONTROLS (DIRECT TRANSACTION AUDIT & DELETE) */}
                <div className={`border rounded-2xl p-5 space-y-4 ${
                  isDarkMode ? 'bg-[#0B0F19] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`} id="admin_master_ledger_block">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3 border-dashed border-slate-800/60">
                    <div className="text-right">
                      <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-850'}`}>
                        <Shield size={16} className="text-indigo-400" />
                        <span>منظومة الرقابة المالية وإلغاء/تعديل الحركات</span>
                      </h3>
                      <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        تسمح هذه المنحة لمشرفي {shopName} بتتبع الأخطاء الحاصلة وإصلاحها أو مسح الدفعات.
                      </p>
                    </div>

                    <div className="relative max-w-xs w-full">
                      <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="ابحث باسم الزبون أو البيان..."
                        value={adminSearchTerm}
                        onChange={(e) => setAdminSearchTerm(e.target.value)}
                        className={`w-full text-right pr-8 pl-3 py-2 border rounded-xl text-[11px] focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border-slate-800 text-white placeholder-slate-600' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* MASTER ACTIONS GRID */}
                  <div className="overflow-x-auto border rounded-xl border-dashed border-slate-800 max-h-[350px] overflow-y-auto">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead>
                        <tr className={`${isDarkMode ? 'bg-slate-950/40 text-slate-400' : 'bg-slate-50 text-slate-600'} text-[11px] font-black border-b ${isDarkMode ? 'border-slate-850' : 'border-slate-200'}`}>
                          <th className="p-2.5">الزبون</th>
                          <th className="p-2.5">التاريخ</th>
                          <th className="p-2.5">النوع</th>
                          <th className="p-2.5">المبلغ</th>
                          <th className="p-2.5">البيان / الخدمة</th>
                          <th className="p-2.5 text-center">الإجراء المالي المباشر</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/20">
                        {(() => {
                          const matchedTxs = transactions.filter(t => {
                            const c = customers.find(cust => cust.id === t.customerId);
                            const nameMatch = c ? c.name.toLowerCase().includes(adminSearchTerm.toLowerCase()) : false;
                            const noteMatch = t.note ? t.note.toLowerCase().includes(adminSearchTerm.toLowerCase()) : false;
                            const detailsMatch = t.details ? t.details.toLowerCase().includes(adminSearchTerm.toLowerCase()) : false;
                            return nameMatch || noteMatch || detailsMatch;
                          });

                          if (matchedTxs.length === 0) {
                            return (
                              <tr>
                                <td colSpan={6} className="p-6 text-center text-[11px] text-slate-500">
                                  لاتوجد أي حركات مالية مطابقة للبحث المحاسبي الحالي.
                                </td>
                              </tr>
                            );
                          }

                          return matchedTxs.map(tx => {
                            const cust = customers.find(c => c.id === tx.customerId);
                            return (
                              <tr 
                                key={tx.id} 
                                className={`text-[11px] leading-relaxed transition ${
                                  isDarkMode ? 'hover:bg-slate-900/30 text-slate-300' : 'hover:bg-slate-100/50 text-slate-800'
                                }`}
                              >
                                <td className="p-2.5 font-bold truncate max-w-[120px]">
                                  {cust ? cust.name : 'زبون محذوف'}
                                </td>
                                <td className="p-2.5 font-mono text-[10px] shrink-0 text-slate-400">
                                  {formatDate(tx.date)}
                                </td>
                                <td className="p-2.5">
                                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                    tx.type === 'debt' 
                                      ? 'bg-rose-500/10 text-rose-500' 
                                      : 'bg-emerald-500/10 text-emerald-500'
                                  }`}>
                                    {tx.type === 'debt' ? '🔻 دين' : '🟢 واصل'}
                                  </span>
                                </td>
                                <td className="p-2.5 font-bold font-mono">
                                  {formatCurrency(tx.amount)}
                                </td>
                                <td className="p-2.5 truncate max-w-[160px] text-slate-400">
                                  {tx.details || tx.note || '---'}
                                </td>
                                <td className="p-2.5">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => startAdminEditTx(tx)}
                                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition cursor-pointer"
                                      title="تعديل تفاصيل العملية ورقمها"
                                    >
                                      <Edit size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleAdminDeleteTx(tx.id)}
                                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition cursor-pointer"
                                      title="حذف القيد وحفظ الدفتر"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECURED DATABASE DESTRUCTION OVERLAYS */}
                <div className={`border rounded-2xl p-5 space-y-4 ${
                  isDarkMode ? 'bg-rose-950/5 border-slate-800' : 'bg-rose-50/20 border-rose-100 shadow-xs'
                }`} id="settings_database_actions_admin">
                  <h3 className={`text-xs font-bold text-red-500 flex items-center gap-1.5`}>
                    <Trash2 size={15} />
                    <span>تصفير وإعادة تهيئة الدفاتر المحاسبية (متقدم للغاية)</span>
                  </h3>
                  
                  <p className={`text-[10px] leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    هذه العمليات تمس سلامة القيود ويجب ألا تنفذ إلا مع مطلع السنة المالية أو للتدريب وتجربة التطبيق:
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={handleResetAppDB}
                      className="flex-1 py-2.5 rounded-xl text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      <span>حذف كافة البيانات وتصفير الدفتر كدليل فارغ</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleLoadDemoData}
                      className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                        isDarkMode 
                          ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' 
                          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <RefreshCw size={12} />
                      <span>تحميل البيانات التجريبية وهيكل الرسام</span>
                    </button>
                  </div>
                </div>

                {/* Secure details card */}
                <div className={`border rounded-2xl p-5 space-y-4 ${
                  isDarkMode ? 'bg-[#0B0F19]/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <h3 className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>الوضع والأمان للتثبيت المحاسبي</h3>
                  
                  <div className={`flex items-center justify-between text-xs pb-2.5 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>امتداد قواعد تخزين:</span>
                    <span className={`font-mono font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>LocalStorage v2 Secure Session</span>
                  </div>

                  <div className={`flex items-center justify-between text-xs pb-2.5 border-b ${isDarkMode ? 'border-[#0B0F19] border-slate-805' : 'border-slate-105'}`}>
                    <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>تثبيت الطابع والسمات:</span>
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg text-[10px]">مفعل ودائم</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>دعم العملات المجهزة:</span>
                    <span className="text-[#FF5E00] font-bold">جمهورية العراق د.ع</span>
                  </div>
                </div>
              </div>
            )}

            {/* DIRECT TRANSACTION EDITING OVERLAY MODAL */}
            {adminEditingTx && (
              <div 
                className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in text-right"
                onClick={() => setAdminEditingTx(null)}
              >
                <div 
                  className={`w-full max-w-sm rounded-[24px] p-6 space-y-4 shadow-2xl ${
                    isDarkMode ? 'bg-[#0E1322] border border-slate-800 text-white' : 'bg-white border text-slate-900 border-slate-200'
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-700/60">
                    <button 
                      type="button" 
                      onClick={() => setAdminEditingTx(null)} 
                      className="text-slate-500 hover:text-rose-500 transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                    <h4 className="text-sm font-black flex items-center gap-1.5">
                      <Edit size={16} className="text-blue-500" />
                      <span>تعديل الحركة بصفة مشرف</span>
                    </h4>
                  </div>

                  <form onSubmit={handleAdminEditTxSave} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold mb-1">المبلغ المالي (بالدينار)</label>
                      <input
                        type="number"
                        value={adminEditAmount}
                        onChange={(e) => setAdminEditAmount(e.target.value)}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold mb-1">البيان الأساسي / الخدمة</label>
                      <input
                        type="text"
                        value={adminEditDetails}
                        onChange={(e) => setAdminEditDetails(e.target.value)}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold mb-1">ملاحظات وراشيتات إضافية</label>
                      <input
                        type="text"
                        value={adminEditNote}
                        onChange={(e) => setAdminEditNote(e.target.value)}
                        className={`w-full text-right px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold mb-1">تاريخ العملية</label>
                      <input
                        type="date"
                        value={adminEditDate}
                        onChange={(e) => setAdminEditDate(e.target.value)}
                        className={`w-full text-center px-3 py-2 rounded-xl text-xs focus:outline-none ${
                          isDarkMode ? 'bg-[#090D16] border border-slate-800 text-white' : 'bg-white border border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setAdminEditingTx(null)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isDarkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        إلغاء التعديل
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                      >
                        حفظ التعديلات
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ---- FIXED PHONE BOTTOM NAVIGATION BAR MATCHING SCREENSHOT EXACTLY ---- */}
      <nav 
        id="bottom_navigation_bar"
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-3.5 px-4 z-[45] shadow-xl flex items-center justify-around rounded-t-[24px] duration-300 max-w-md md:max-w-xl mx-auto"
      >
        
        {/* Tab 1: الرئيسية */}
        <button
          onClick={() => setActiveTab('dashboard')}
          id="tab-btn-home"
          className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <LayoutGrid size={20} className={activeTab === 'dashboard' ? 'scale-110 drop-shadow-xs' : ''} />
          <span className="text-[10px] sm:text-11px">الرئيسية</span>
        </button>

        {/* Tab 2: الزبائن */}
        <button
          onClick={() => setActiveTab('customers')}
          id="tab-btn-customers"
          className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'customers' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users size={20} className={activeTab === 'customers' ? 'scale-110' : ''} />
          <span className="text-[10px] sm:text-11px">الزبائن</span>
        </button>

        {/* Tab 3: دفعة جديدة */}
        <button
          onClick={() => setActiveTab('add-payment')}
          id="tab-btn-payment"
          className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'add-payment' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Wallet size={20} className={activeTab === 'add-payment' ? 'scale-110' : ''} />
          <span className="text-[10px] sm:text-11px">دفعة جديدة</span>
        </button>

        {/* Tab 4: كشف مالي */}
        <button
          onClick={() => setActiveTab('statements')}
          id="tab-btn-statements"
          className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'statements' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText size={20} className={activeTab === 'statements' ? 'scale-110' : ''} />
          <span className="text-[10px] sm:text-11px">كشف مالي</span>
        </button>

        {/* Tab 5: الضبط */}
        <button
          onClick={() => setActiveTab('settings')}
          id="tab-btn-settings"
          className={`flex flex-col items-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'settings' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Settings size={20} className={activeTab === 'settings' ? 'scale-110' : ''} />
          <span className="text-[10px] sm:text-11px">الضبط</span>
        </button>

      </nav>

      {/* ---- CUSTOM SYSTEM CONFIRM MODAL OVERLAY ---- */}
      {confirmModal && confirmModal.isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in"
          id="confirm_modal_overlay"
          onClick={() => setConfirmModal(null)}
        >
          <div 
            className={`w-full max-w-sm rounded-[24px] border p-6 text-right space-y-4 shadow-2xl transform scale-100 transition-all ${
              isDarkMode ? 'bg-[#0E1322] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
            id="confirm_modal_card"
          >
            {/* Modal Icon and Header */}
            <div className="flex items-center justify-start gap-3">
              <div className={`p-2.5 rounded-2xl ${
                confirmModal.isDanger 
                  ? 'bg-rose-500/10 text-rose-500' 
                  : 'bg-emerald-500/10 text-[#FF5E00]'
              }`}>
                <AlertCircle size={22} />
              </div>
              <div className="text-right">
                <h4 className="text-sm font-black">{confirmModal.title}</h4>
                <p className={`text-[10px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>الرسام للمطبوعات والإعلانات</p>
              </div>
            </div>

            {/* Modal Message */}
            <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {confirmModal.message}
            </p>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800' 
                    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'
                }`}
                id="btn_confirm_cancel"
              >
                {confirmModal.cancelText || 'تراجع'}
              </button>
              
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 text-xs font-bold rounded-xl text-white transition shadow-sm cursor-pointer ${
                  confirmModal.isDanger 
                    ? 'bg-[#E11D48] hover:bg-[#BE1230]' 
                    : `${colors.primary} ${colors.primaryHover}`
                }`}
                id="btn_confirm_execute"
              >
                {confirmModal.confirmText || 'تأكيد'}
              </button>
            </div>
          </div>
        </div>
      )}

      </>
      )}

    </div>
  );
}
