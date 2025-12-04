"use client";

import { useState } from 'react';
import { useFinance, PaymentType, PaymentStatus } from '@/contexts/FinanceContext';
import { useGraveyard } from '@/contexts/GraveyardContext';
import { useBurialRecord } from '@/contexts/BurialRecordContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Receipt } from 'lucide-react';

interface PaymentFormProps {
  onClose: () => void;
  onSuccess: (paymentId: string) => void;
}

export default function PaymentForm({ onClose, onSuccess }: PaymentFormProps) {
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentType, setPaymentType] = useState<PaymentType>('plot_booking');
  const [status, setStatus] = useState<PaymentStatus>('completed');
  const [plotId, setPlotId] = useState('');
  const [graveId, setGraveId] = useState('');
  const [burialRecordId, setBurialRecordId] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { addPayment } = useFinance();
  const { plots, graves } = useGraveyard();
  const { records } = useBurialRecord();

  const availableGraves = plotId
    ? graves.filter((g) => g.plotId === plotId)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!payerName || !payerEmail || !payerPhone || !amount || !description) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setIsLoading(true);

    try {
      const payment = addPayment({
        payerName,
        payerEmail,
        payerPhone,
        amount: parseFloat(amount),
        paymentType,
        status,
        plotId: plotId || undefined,
        graveId: graveId || undefined,
        burialRecordId: burialRecordId || undefined,
        description,
        paymentDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });

      onSuccess(payment.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-3 shadow-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">New Payment</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payer Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="Full name"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={payerPhone}
                onChange={(e) => setPayerPhone(e.target.value)}
                placeholder="555-0000"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                min="0"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Type <span className="text-red-500">*</span>
              </label>
              <Select value={paymentType} onValueChange={(value) => setPaymentType(value as PaymentType)}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plot_booking">Plot Booking</SelectItem>
                  <SelectItem value="burial_service">Burial Service</SelectItem>
                  <SelectItem value="maintenance">Maintenance Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Payment Status <span className="text-red-500">*</span>
              </label>
              <Select value={status} onValueChange={(value) => setStatus(value as PaymentStatus)}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Plot (Optional)
              </label>
              <Select value={plotId} onValueChange={setPlotId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select plot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      Plot {plot.plotNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Grave (Optional)
              </label>
              <Select value={graveId} onValueChange={setGraveId} disabled={!plotId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder={plotId ? "Select grave" : "Select plot first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {availableGraves.map((grave) => (
                    <SelectItem key={grave.id} value={grave.id}>
                      Grave {grave.graveNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Burial Record (Optional)
              </label>
              <Select value={burialRecordId} onValueChange={setBurialRecordId}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select burial record" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {records.map((record) => (
                    <SelectItem key={record.id} value={record.id}>
                      {record.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {status !== 'completed' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full"
                />
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment description"
                required
                className="w-full"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-green-700"
            >
              {isLoading ? 'Processing...' : 'Process Payment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
