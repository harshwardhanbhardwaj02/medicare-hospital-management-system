import React, { useState } from 'react';
import {
  Receipt,
  FilePlus,
  DollarSign,
  Printer,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';

export default function BillingPage({
  invoices,
  patients,
  onCreateInvoice,
  onUpdateInvoice,
  onViewReceipt
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for creating an invoice
  const [selectedPatient, setSelectedPatient] = useState(patients[0] || null);
  const [items, setItems] = useState([
    { description: 'Physician OPD Consultation Fee', category: 'Consultation', amount: 1500 },
    { description: 'Diagnostic Blood & Pathology Panel', category: 'Diagnostics', amount: 800 }
  ]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('UPI / Online');

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const totalPending = invoices
    .filter((i) => i.status === 'Pending')
    .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const grandTotal = Math.round((subtotal + tax - (Number(discount) || 0)) * 100) / 100;

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'Medication / Treatment Charge', category: 'Pharmacy', amount: 500 }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = field === 'amount' ? Number(value) : value;
    setItems(updated);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    onCreateInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      items,
      discount: Number(discount) || 0,
      paymentMethod,
      status: 'Pending'
    });

    setIsCreateModalOpen(false);
    setItems([
      { description: 'Physician OPD Consultation Fee', category: 'Consultation', amount: 1500 }
    ]);
    setDiscount(0);
  };

  const formatINR = (val) =>
    `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hospital Invoicing, GST & Claims</h2>
          <p className="text-xs text-slate-500">
            Itemized hospital bills, Indian tax accounting, print receipts, and UPI / Cash settlement logs
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPatient(patients[0] || null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          <FilePlus className="w-4 h-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* Financial Summary Cards in INR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Invoices Issued
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{invoices.length}</p>
          <p className="text-xs text-slate-500 mt-1">Hospital wide billing</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Collected Revenue (INR)
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {formatINR(totalCollected)}
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Settled & Cleared</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Pending / Under TPA Review
          </span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {formatINR(totalPending)}
          </p>
          <p className="text-xs text-amber-600 font-medium mt-1">Awaiting settlement</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice ID or patient..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Paid', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                <th className="py-3.5 px-5 font-bold">Invoice #</th>
                <th className="py-3.5 px-5 font-bold">Patient / UHID</th>
                <th className="py-3.5 px-5 font-bold">Invoice Date</th>
                <th className="py-3.5 px-5 font-bold">Payment Mode</th>
                <th className="py-3.5 px-5 font-bold">Total Amount (₹)</th>
                <th className="py-3.5 px-5 font-bold">Status</th>
                <th className="py-3.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-5 font-mono font-bold text-slate-800">{inv.id}</td>
                  <td className="py-4 px-5">
                    <p className="font-bold text-slate-900">{inv.patientName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{inv.patientId}</p>
                  </td>
                  <td className="py-4 px-5 text-slate-500">{inv.invoiceDate}</td>
                  <td className="py-4 px-5 text-slate-600">{inv.paymentMethod}</td>
                  <td className="py-4 px-5 font-extrabold text-slate-900">
                    {formatINR(inv.total)}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {inv.status === 'Paid' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => onViewReceipt(inv)}
                      className="px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Tax Receipt</span>
                    </button>
                    {inv.status === 'Pending' && (
                      <button
                        onClick={() => onUpdateInvoice(inv.id, { status: 'Paid' })}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Generate Itemized Hospital Tax Invoice</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                  <select
                    value={selectedPatient?.id}
                    onChange={(e) => {
                      const p = patients.find((pat) => pat.id === e.target.value);
                      setSelectedPatient(p);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  >
                    <option>UPI / Google Pay / PhonePe</option>
                    <option>Net Banking / NEFT</option>
                    <option>Credit / Debit Card</option>
                    <option>Cash</option>
                    <option>TPA / Health Insurance Claim</option>
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Hospital Billing Line Items</span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-teal-600 font-bold hover:text-teal-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Service / medication description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="flex-3 p-2 rounded-lg border border-slate-200 outline-none focus:border-teal-500"
                    />
                    <select
                      value={item.category}
                      onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                      className="flex-2 p-2 rounded-lg border border-slate-200 outline-none focus:border-teal-500"
                    >
                      <option>Consultation</option>
                      <option>Diagnostics</option>
                      <option>Room Charges</option>
                      <option>Pharmacy</option>
                      <option>Emergency</option>
                      <option>Surgery</option>
                    </select>
                    <input
                      type="number"
                      step="1"
                      required
                      value={item.amount}
                      onChange={(e) => handleItemChange(idx, 'amount', e.target.value)}
                      className="w-28 p-2 rounded-lg border border-slate-200 outline-none focus:border-teal-500"
                      placeholder="Amount (₹)"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length === 1}
                      className="p-2 text-slate-400 hover:text-rose-500 disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Discount & Totals */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5% Hospital Surcharge):</span>
                  <span className="font-semibold">{formatINR(tax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Concession / TPA Discount (₹):</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-28 p-1 text-right rounded border border-slate-200 outline-none"
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Net Payable:</span>
                  <span className="text-teal-700">{formatINR(grandTotal)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Create & Issue Tax Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
