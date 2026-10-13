import React from 'react';
import { Printer, CheckCircle2, Clock, X, Building2, FileCheck } from 'lucide-react';

export default function InvoiceReceiptModal({ invoice, isOpen, onClose, onMarkPaid }) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatINR = (val) => {
    return `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs no-print"
        onClick={onClose}
      />

      {/* Modal / Printable Invoice */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 z-10 overflow-hidden my-6 print-container">
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <FileCheck className="w-4 h-4 text-teal-400" />
            <span>Tax Invoice / Medical Receipt: {invoice.id}</span>
          </div>
          <div className="flex items-center gap-2">
            {invoice.status === 'Pending' && onMarkPaid && (
              <button
                onClick={() => onMarkPaid(invoice.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Paid</span>
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold rounded-lg transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Tax Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="p-8 sm:p-10 text-slate-800" id="printable-receipt">
          {/* Hospital Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start pb-8 border-b-2 border-slate-100 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  MediCare Super Speciality Hospital
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  National Accreditation Board for Hospitals & Healthcare Providers (NABH Accredited)
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Plot 14, Institutional Area, Sector 62, Noida, Delhi NCR - 201301
                </p>
                <p className="text-xs text-slate-400">
                  GSTIN: 07AAAAA9999Z1Z5 | Helpline: +91 (11) 4999-1200 | billing@medicare-hospital.in
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  invoice.status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {invoice.status === 'Paid' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                )}
                {invoice.status}
              </span>
              <p className="text-xl font-black text-slate-900 mt-2">{invoice.id}</p>
              <p className="text-xs text-slate-500">Invoice Date: {invoice.invoiceDate}</p>
              <p className="text-xs text-slate-500">Due Date: {invoice.dueDate}</p>
            </div>
          </div>

          {/* Billed To / Patient Info */}
          <div className="grid grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Patient / Billed To
              </p>
              <p className="text-sm font-bold text-slate-800 mt-1">{invoice.patientName}</p>
              <p className="text-slate-500 mt-0.5">UHID / Patient ID: {invoice.patientId}</p>
            </div>
            <div>
              <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Payment Mode & Currency
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1">
                Method: {invoice.paymentMethod || 'UPI / Online'}
              </p>
              <p className="text-slate-500 mt-0.5">Currency: Indian Rupees (INR ₹)</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/80 text-slate-600 border-b border-slate-200">
                  <th className="py-3 px-4 font-bold">#</th>
                  <th className="py-3 px-4 font-bold">Clinical Description / Service</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.items || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{item.description}</td>
                    <td className="py-3 px-4 text-slate-500">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-medium text-slate-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      {formatINR(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="flex justify-end mt-6">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">{formatINR(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (5% Hospital Surcharge)</span>
                <span className="font-semibold text-slate-800">{formatINR(invoice.tax)}</span>
              </div>
              {Number(invoice.discount) > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>TPA / Ayushman / Concession</span>
                  <span>-{formatINR(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t-2 border-slate-200">
                <span>Net Payable Amount</span>
                <span className="text-teal-700">{formatINR(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Signatures & Note */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4">
            <div>
              <p className="font-semibold text-slate-600">Thank you for visiting MediCare Super Speciality Hospital.</p>
              <p>For insurance reimbursement queries, please contact billing@medicare-hospital.in or TPA Desk Ext. 104.</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-40 border-b border-slate-300 pb-1 mb-1 font-mono text-[11px] text-slate-600">
                Authorized Signatory
              </div>
              <p className="text-[10px] text-slate-400">Accounts & Billing Officer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
