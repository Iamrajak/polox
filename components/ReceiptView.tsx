"use client";

import { useFinance } from '@/contexts/FinanceContext';
import { useGraveyard } from '@/contexts/GraveyardContext';
import { Button } from '@/components/ui/button';
import { X, Download, Printer, CheckCircle2 } from 'lucide-react';

interface ReceiptViewProps {
  paymentId: string;
  onClose: () => void;
}

export default function ReceiptView({ paymentId, onClose }: ReceiptViewProps) {
  const { getPaymentById } = useFinance();
  const { plots, graves } = useGraveyard();

  const payment = getPaymentById(paymentId);

  if (!payment) {
    return null;
  }

  const plot = payment.plotId ? plots.find((p) => p.id === payment.plotId) : null;
  const grave = payment.graveId ? graves.find((g) => g.id === payment.graveId) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const receiptContent = document.getElementById('receipt-content');
    if (receiptContent) {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt ${payment.receiptNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { text-align: center; margin-bottom: 30px; }
                .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .receipt-number { color: #666; }
                .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
                .label { font-weight: bold; display: inline-block; width: 150px; }
                .value { display: inline-block; }
                .amount { font-size: 28px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
              </style>
            </head>
            <body>
              ${receiptContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 p-6 print:hidden">
          <h2 className="text-2xl font-bold text-slate-900">Payment Receipt</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div id="receipt-content" className="p-8">
          <div className="text-center mb-8 border-b-2 border-slate-900 pb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Graveyard Management System</h1>
            <p className="text-slate-600">Payment Receipt</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                Receipt #{payment.receiptNumber}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Payer Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Name:</span>
                  <p className="text-slate-900">{payment.payerName}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Email:</span>
                  <p className="text-slate-900">{payment.payerEmail}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Phone:</span>
                  <p className="text-slate-900">{payment.payerPhone}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Payment Date:</span>
                  <p className="text-slate-900">{payment.paymentDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Payment Type:</span>
                  <p className="text-slate-900">{formatPaymentType(payment.paymentType)}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Status:</span>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(plot || grave) && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-8">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">Plot & Grave Information</h3>
              <div className="space-y-2 text-sm">
                {plot && (
                  <div>
                    <span className="font-medium text-blue-700">Plot:</span>
                    <span className="text-blue-900 ml-2">Plot {plot.plotNumber}</span>
                  </div>
                )}
                {grave && (
                  <div>
                    <span className="font-medium text-blue-700">Grave:</span>
                    <span className="text-blue-900 ml-2">Grave #{grave.graveNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-8">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Description</h3>
            <p className="text-slate-900">{payment.description}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center mb-8">
            <p className="text-sm font-medium text-slate-600 mb-2">Total Amount</p>
            <p className="text-5xl font-bold text-green-600">
              ${payment.amount.toFixed(2)}
            </p>
          </div>

          {payment.dueDate && (
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-700">Due Date:</span>
                <span className="text-sm font-semibold text-amber-900">
                  {payment.dueDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
            <p>This is an official receipt from Graveyard Management System</p>
            <p className="mt-1">Generated on {new Date().toLocaleDateString()}</p>
            <p className="mt-3 font-medium">Thank you for your payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
