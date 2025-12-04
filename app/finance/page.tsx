"use client";

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useGraveyard } from '@/contexts/GraveyardContext';
import { Plus, Search, DollarSign, TrendingUp, AlertCircle, Clock, Receipt, Eye, Lock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaymentForm from '@/components/PaymentForm';
import ReceiptView from '@/components/ReceiptView';

export default function FinancePage() {
  const { isAuthenticated, user } = useAuth();
  const { payments, getTotalRevenue, getPendingAmount, getOverdueAmount, getOverduePayments } = useFinance();
  const { plots, graves } = useGraveyard();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'overdue'>('all');
  const [filterType, setFilterType] = useState<'all' | 'plot_booking' | 'burial_service' | 'maintenance' | 'other'>('all');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl text-center">
          <div className="rounded-full bg-red-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">You need to be logged in to view financial transactions.</p>
        </div>
      </div>
    );
  }

  const canModify = ['admin', 'staff'].includes(user?.role || '');

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.payerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
      const matchesType = filterType === 'all' || payment.paymentType === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [payments, searchQuery, filterStatus, filterType]);

  const totalRevenue = getTotalRevenue();
  const pendingAmount = getPendingAmount();
  const overdueAmount = getOverdueAmount();
  const overduePayments = getOverduePayments();

  const getPlotName = (plotId?: string) => {
    if (!plotId) return 'N/A';
    const plot = plots.find((p) => p.id === plotId);
    return plot ? `Plot ${plot.plotNumber}` : 'N/A';
  };

  const getGraveName = (graveId?: string) => {
    if (!graveId) return 'N/A';
    const grave = graves.find((g) => g.id === graveId);
    return grave ? `Grave ${grave.graveNumber}` : 'N/A';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatPaymentType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentForm(false);
    setSelectedReceiptId(paymentId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Financial Transactions</h1>
            <p className="text-slate-600">Manage payments and track revenue</p>
          </div>
          {canModify && (
            <Button
              onClick={() => setShowPaymentForm(true)}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 flex items-center gap-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              New Payment
            </Button>
          )}
        </div>

        {overduePayments.length > 0 && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-red-500 to-red-600 p-4 shadow-lg">
            <div className="flex items-center gap-3 text-white">
              <AlertCircle className="h-6 w-6" />
              <div className="flex-1">
                <p className="font-semibold">Overdue Payments Alert</p>
                <p className="text-sm opacity-90">
                  You have {overduePayments.length} overdue payment{overduePayments.length !== 1 ? 's' : ''} totaling ${overdueAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Total Revenue</h3>
              <p className="text-3xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-3 shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Pending Payments</h3>
              <p className="text-3xl font-bold text-slate-900">${pendingAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-rose-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-gradient-to-br from-red-500 to-red-600 p-3 shadow-lg">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Overdue Amount</h3>
              <p className="text-3xl font-bold text-slate-900">${overdueAmount.toFixed(2)}</p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-slate-600 mb-1">Total Transactions</h3>
              <p className="text-3xl font-bold text-slate-900">{payments.length}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, email, receipt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white shadow-sm"
            />
          </div>

          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
            <SelectTrigger className="bg-white shadow-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
            <SelectTrigger className="bg-white shadow-sm">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="plot_booking">Plot Booking</SelectItem>
              <SelectItem value="burial_service">Burial Service</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Receipt #</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Payer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Plot/Grave</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{payment.receiptNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{payment.payerName}</p>
                        <p className="text-xs text-slate-500">{payment.payerEmail}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {formatPaymentType(payment.paymentType)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-green-600">${payment.amount.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        <div className="bg-slate-100 rounded px-2 py-1 inline-block">
                          {getPlotName(payment.plotId)}/{getGraveName(payment.graveId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {payment.paymentDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedReceiptId(payment.id)}
                          className="p-2 rounded-lg hover:bg-blue-100 text-blue-600 hover:text-blue-700"
                          title="View receipt"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <p className="text-slate-600">No transactions found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showPaymentForm && (
        <PaymentForm
          onClose={() => setShowPaymentForm(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {selectedReceiptId && (
        <ReceiptView
          paymentId={selectedReceiptId}
          onClose={() => setSelectedReceiptId(null)}
        />
      )}
    </div>
  );
}
