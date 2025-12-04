"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type PaymentStatus = 'completed' | 'pending' | 'overdue';
export type PaymentType = 'plot_booking' | 'burial_service' | 'maintenance' | 'other';

export interface Payment {
  id: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  amount: number;
  paymentType: PaymentType;
  status: PaymentStatus;
  plotId?: string;
  graveId?: string;
  burialRecordId?: string;
  description: string;
  paymentDate: Date;
  dueDate?: Date;
  createdAt: Date;
  receiptNumber: string;
}

interface FinanceContextType {
  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'receiptNumber'>) => Payment;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  getPaymentById: (id: string) => Payment | undefined;
  getTotalRevenue: () => number;
  getPendingAmount: () => number;
  getOverdueAmount: () => number;
  getOverduePayments: () => Payment[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      payerName: 'John Smith',
      payerEmail: 'john.smith@example.com',
      payerPhone: '555-0101',
      amount: 2500.00,
      paymentType: 'plot_booking',
      status: 'completed',
      plotId: '1',
      graveId: '1-5',
      description: 'Plot A1 - Grave 5 Booking',
      paymentDate: new Date('2024-10-15'),
      createdAt: new Date('2024-10-15'),
      receiptNumber: 'RCP-2024-0001',
    },
    {
      id: '2',
      payerName: 'Mary Johnson',
      payerEmail: 'mary.j@example.com',
      payerPhone: '555-0102',
      amount: 3500.00,
      paymentType: 'burial_service',
      status: 'completed',
      plotId: '1',
      graveId: '1-2',
      burialRecordId: '2',
      description: 'Burial Service for Mary Johnson',
      paymentDate: new Date('2024-10-21'),
      createdAt: new Date('2024-10-21'),
      receiptNumber: 'RCP-2024-0002',
    },
    {
      id: '3',
      payerName: 'Robert Davis',
      payerEmail: 'r.davis@example.com',
      payerPhone: '555-0103',
      amount: 1500.00,
      paymentType: 'plot_booking',
      status: 'pending',
      plotId: '2',
      graveId: '2-8',
      description: 'Plot A2 - Grave 8 Booking',
      paymentDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      receiptNumber: 'RCP-2024-0003',
    },
    {
      id: '4',
      payerName: 'Sarah Wilson',
      payerEmail: 's.wilson@example.com',
      payerPhone: '555-0104',
      amount: 800.00,
      paymentType: 'maintenance',
      status: 'overdue',
      plotId: '1',
      description: 'Annual Maintenance Fee',
      paymentDate: new Date('2024-09-15'),
      dueDate: new Date('2024-10-15'),
      createdAt: new Date('2024-09-15'),
      receiptNumber: 'RCP-2024-0004',
    },
  ]);

  const generateReceiptNumber = () => {
    const year = new Date().getFullYear();
    const count = payments.length + 1;
    return `RCP-${year}-${count.toString().padStart(4, '0')}`;
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'receiptNumber'>): Payment => {
    const newPayment: Payment = {
      ...payment,
      id: Date.now().toString(),
      createdAt: new Date(),
      receiptNumber: generateReceiptNumber(),
    };
    setPayments((prev) => [newPayment, ...prev]);
    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, ...updates } : payment
      )
    );
  };

  const deletePayment = (id: string) => {
    setPayments((prev) => prev.filter((payment) => payment.id !== id));
  };

  const getPaymentById = (id: string) => {
    return payments.find((payment) => payment.id === id);
  };

  const getTotalRevenue = () => {
    return payments
      .filter((p) => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getPendingAmount = () => {
    return payments
      .filter((p) => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getOverdueAmount = () => {
    return payments
      .filter((p) => p.status === 'overdue')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getOverduePayments = () => {
    return payments.filter((p) => p.status === 'overdue');
  };

  const value: FinanceContextType = {
    payments,
    addPayment,
    updatePayment,
    deletePayment,
    getPaymentById,
    getTotalRevenue,
    getPendingAmount,
    getOverdueAmount,
    getOverduePayments,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};
