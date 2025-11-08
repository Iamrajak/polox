"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RecordStatus = 'pending' | 'approved' | 'rejected';

export interface BurialRecord {
  id: string;
  name: string;
  fatherName: string;
  dateOfDeath: string;
  gender: 'male' | 'female';
  age: number;
  religion: string;
  plotId: string;
  graveId: string;
  status: RecordStatus;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

interface BurialRecordContextType {
  records: BurialRecord[];
  addRecord: (record: Omit<BurialRecord, 'id' | 'createdAt'>) => void;
  updateRecord: (id: string, updates: Partial<BurialRecord>) => void;
  deleteRecord: (id: string) => void;
  approveRecord: (id: string, approvedBy: string) => void;
  rejectRecord: (id: string, notes: string) => void;
}

const BurialRecordContext = createContext<BurialRecordContextType | undefined>(undefined);

export const BurialRecordProvider = ({ children }: { children: ReactNode }) => {
  const [records, setRecords] = useState<BurialRecord[]>([
    {
      id: '1',
      name: 'John Smith',
      fatherName: 'Thomas Smith',
      dateOfDeath: '2024-10-15',
      gender: 'male',
      age: 78,
      religion: 'Christianity',
      plotId: '1',
      graveId: '1',
      status: 'approved',
      createdAt: new Date('2024-10-16'),
      approvedBy: 'admin',
      approvedAt: new Date('2024-10-16'),
    },
    {
      id: '2',
      name: 'Mary Johnson',
      fatherName: 'Robert Johnson',
      dateOfDeath: '2024-10-20',
      gender: 'female',
      age: 65,
      religion: 'Christianity',
      plotId: '1',
      graveId: '2',
      status: 'approved',
      createdAt: new Date('2024-10-21'),
      approvedBy: 'admin',
      approvedAt: new Date('2024-10-21'),
    },
  ]);

  const addRecord = (record: Omit<BurialRecord, 'id' | 'createdAt'>) => {
    const newRecord: BurialRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setRecords((prev) => [newRecord, ...prev]);
  };

  const updateRecord = (id: string, updates: Partial<BurialRecord>) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      )
    );
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const approveRecord = (id: string, approvedBy: string) => {
    updateRecord(id, {
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
    });
  };

  const rejectRecord = (id: string, notes: string) => {
    updateRecord(id, {
      status: 'rejected',
      notes,
    });
  };

  const value: BurialRecordContextType = {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
    approveRecord,
    rejectRecord,
  };

  return (
    <BurialRecordContext.Provider value={value}>
      {children}
    </BurialRecordContext.Provider>
  );
};

export const useBurialRecord = () => {
  const context = useContext(BurialRecordContext);
  if (!context) {
    throw new Error('useBurialRecord must be used within BurialRecordProvider');
  }
  return context;
};
