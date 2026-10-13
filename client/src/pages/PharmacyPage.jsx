import React, { useState } from 'react';
import {
  Pill,
  PlusCircle,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  PackageCheck,
  SendHorizontal,
  RefreshCw
} from 'lucide-react';

export default function PharmacyPage({
  medicines,
  patients,
  onAddMedicine,
  onUpdateMedicine,
  onDispenseMedicine
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dispenseModalMed, setDispenseModalMed] = useState(null);
  const [dispenseQty, setDispenseQty] = useState(1);
  const [dispensePatient, setDispensePatient] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    category: 'Antibiotics',
    dosage: '',
    stock: 100,
    minThreshold: 30,
    unitPrice: 80.0,
    manufacturer: '',
    expiryDate: '2027-12-31'
  });

  const categories = [
    'All',
    'Antibiotics',
    'Cardiovascular',
    'Endocrinology',
    'Respiratory',
    'Analgesic / Anti-inflammatory'
  ];

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All' || med.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddMedicine(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      genericName: '',
      category: 'Antibiotics',
      dosage: '',
      stock: 100,
      minThreshold: 30,
      unitPrice: 80.0,
      manufacturer: '',
      expiryDate: '2027-12-31'
    });
  };

  const handleDispenseSubmit = (e) => {
    e.preventDefault();
    if (!dispenseModalMed) return;
    onDispenseMedicine(dispenseModalMed.id, {
      quantity: Number(dispenseQty) || 1,
      patientName: dispensePatient || 'Walk-in Patient'
    });
    setDispenseModalMed(null);
    setDispenseQty(1);
    setDispensePatient('');
  };

  const handleRestock = (med) => {
    const qty = prompt(`Enter quantity to add for ${med.name}:`, '50');
    if (qty && !isNaN(qty)) {
      onUpdateMedicine(med.id, {
        stock: med.stock + Number(qty)
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hospital Pharmacy Store & Formulary</h2>
          <p className="text-xs text-slate-500">
            Real-time drug inventory, dispensing log, expiration monitoring, and unit pricing in Indian Rupees (₹)
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicine, generic name, category..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Medicines Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                <th className="py-3.5 px-5 font-bold">Item ID</th>
                <th className="py-3.5 px-5 font-bold">Medication & Formulation</th>
                <th className="py-3.5 px-5 font-bold">Category</th>
                <th className="py-3.5 px-5 font-bold">Stock Level</th>
                <th className="py-3.5 px-5 font-bold">MRP (₹)</th>
                <th className="py-3.5 px-5 font-bold">Expiry Date</th>
                <th className="py-3.5 px-5 font-bold">Status</th>
                <th className="py-3.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMedicines.map((med) => {
                const isLow = med.status === 'Low Stock';
                const isOut = med.status === 'Out of Stock';

                return (
                  <tr key={med.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-5 font-mono font-bold text-slate-400">{med.id}</td>
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900">{med.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {med.dosage} • {med.manufacturer}
                      </p>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {med.category}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{med.stock} units</span>
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isOut ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${Math.min((med.stock / 200) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400">Min safe threshold: {med.minThreshold}</p>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-800">
                      ₹{Number(med.unitPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-5 text-slate-500">{med.expiryDate}</td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isOut
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isLow
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {med.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setDispenseModalMed(med);
                          setDispensePatient(patients[0]?.name || '');
                        }}
                        disabled={med.stock <= 0}
                        title="Dispense to patient"
                        className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-lg text-xs font-semibold transition disabled:opacity-40"
                      >
                        Dispense
                      </button>
                      <button
                        onClick={() => handleRestock(med)}
                        title="Restock units"
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition"
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispense Modal */}
      {dispenseModalMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Dispense Medication: {dispenseModalMed.name}
              </h3>
              <button onClick={() => setDispenseModalMed(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleDispenseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={dispensePatient}
                  onChange={(e) => setDispensePatient(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                >
                  <option value="">Walk-in OPD Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Quantity to Dispense (Available Stock: {dispenseModalMed.stock})
                </label>
                <input
                  type="number"
                  min="1"
                  max={dispenseModalMed.stock}
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border text-slate-600 text-[11px] flex justify-between">
                <span>Unit MRP: ₹{Number(dispenseModalMed.unitPrice).toFixed(2)}</span>
                <span className="font-bold text-slate-900">
                  Total Payable: ₹{(dispenseModalMed.unitPrice * dispenseQty).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setDispenseModalMed(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Fulfill & Dispense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Medicine to Formulary</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Paracetamol 650mg (Dolo)"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Generic Name</label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Paracetamol IP"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Therapeutic Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  >
                    <option>Antibiotics</option>
                    <option>Cardiovascular</option>
                    <option>Endocrinology</option>
                    <option>Respiratory</option>
                    <option>Analgesic / Anti-inflammatory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Form</label>
                  <input
                    type="text"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g. 500mg Tablet / 10ml Vial"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Safe Threshold</label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit MRP (₹ INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g. Cipla, Sun Pharma, Lupin"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Add Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
