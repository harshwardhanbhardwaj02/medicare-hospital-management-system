import React, { useState } from 'react';
import {
  Bed,
  CheckCircle2,
  AlertTriangle,
  User,
  DollarSign,
  Wrench,
  LogOut,
  UserPlus,
  ShieldAlert
} from 'lucide-react';

export default function BedsPage({ beds, patients, onUpdateBed }) {
  const [selectedWard, setSelectedWard] = useState('All');
  const [assignModalBed, setAssignModalBed] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');

  const wards = ['All', 'ICU', 'General Ward A', 'General Ward B', 'Emergency'];

  const filteredBeds = beds.filter(
    (b) => selectedWard === 'All' || b.ward === selectedWard
  );

  const totalBeds = beds.length;
  const occupiedCount = beds.filter((b) => b.status === 'Occupied').length;
  const availableCount = beds.filter((b) => b.status === 'Available').length;
  const maintenanceCount = beds.filter((b) => b.status === 'Maintenance').length;

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!assignModalBed || !selectedPatientId) return;

    const patient = patients.find((p) => p.id === selectedPatientId);
    if (!patient) return;

    onUpdateBed(assignModalBed.id, {
      status: 'Occupied',
      patientId: patient.id,
      patientName: patient.name,
      admittedSince: new Date().toISOString().split('T')[0]
    });

    setAssignModalBed(null);
    setSelectedPatientId('');
  };

  const handleVacate = (bed) => {
    if (window.confirm(`Vacate ${bed.ward} - ${bed.bedNumber}?`)) {
      onUpdateBed(bed.id, {
        status: 'Available',
        patientId: null,
        patientName: null,
        admittedSince: null
      });
    }
  };

  const handleMaintenanceToggle = (bed) => {
    const nextStatus = bed.status === 'Maintenance' ? 'Available' : 'Maintenance';
    onUpdateBed(bed.id, {
      status: nextStatus,
      patientId: null,
      patientName: null,
      admittedSince: null
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bed Allocation & Ward Map</h2>
          <p className="text-xs text-slate-500">
            Real-time occupancy management for ICU, General Wards, and Emergency bays in Indian Rupees (₹)
          </p>
        </div>

        {/* Mini stats pill */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
            Available: {availableCount}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-200">
            Occupied: {occupiedCount}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-200">
            Maint: {maintenanceCount}
          </span>
        </div>
      </div>

      {/* Ward Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {wards.map((ward) => (
          <button
            key={ward}
            onClick={() => setSelectedWard(ward)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedWard === ward
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {ward}
          </button>
        ))}
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const isOccupied = bed.status === 'Occupied';
          const isAvailable = bed.status === 'Available';
          const isMaintenance = bed.status === 'Maintenance';

          return (
            <div
              key={bed.id}
              className={`rounded-2xl p-5 border transition flex flex-col justify-between shadow-xs ${
                isOccupied
                  ? 'bg-white border-rose-200 ring-1 ring-rose-100'
                  : isAvailable
                  ? 'bg-white border-emerald-200/80 hover:shadow-md'
                  : 'bg-amber-50/40 border-amber-200'
              }`}
            >
              <div>
                {/* Top Bed status badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {bed.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isOccupied
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isAvailable
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isOccupied
                          ? 'bg-rose-500'
                          : isAvailable
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    {bed.status}
                  </span>
                </div>

                {/* Ward & Bed number */}
                <div className="mt-3 flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isOccupied
                        ? 'bg-rose-100 text-rose-700'
                        : isAvailable
                        ? 'bg-teal-100 text-teal-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <Bed className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{bed.bedNumber}</h3>
                    <p className="text-xs text-slate-500 font-medium">{bed.ward}</p>
                    <p className="text-[11px] text-slate-400">{bed.room}</p>
                  </div>
                </div>

                {/* Patient Information if occupied */}
                {isOccupied && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                      Current Inpatient
                    </p>
                    <p className="font-bold text-slate-800">{bed.patientName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      UHID: {bed.patientId} • Since {bed.admittedSince}
                    </p>
                  </div>
                )}

                {/* Rate indicator in INR */}
                <div className="mt-3 text-[11px] text-slate-500 flex justify-between">
                  <span>Daily Tariff:</span>
                  <span className="font-bold text-slate-800">₹{(bed.dailyRate || 1500).toLocaleString('en-IN')}/day</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                {isAvailable && (
                  <button
                    onClick={() => {
                      setAssignModalBed(bed);
                      setSelectedPatientId(patients[0]?.id || '');
                    }}
                    className="w-full py-1.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Assign Patient</span>
                  </button>
                )}

                {isOccupied && (
                  <button
                    onClick={() => handleVacate(bed)}
                    className="w-full py-1.5 px-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Vacate Bed</span>
                  </button>
                )}

                <button
                  onClick={() => handleMaintenanceToggle(bed)}
                  title={isMaintenance ? 'Return to Service' : 'Flag for Maintenance'}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                >
                  <Wrench className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Bed Modal */}
      {assignModalBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Assign Bed: {assignModalBed.ward} - {assignModalBed.bedNumber}
              </h3>
              <button onClick={() => setAssignModalBed(null)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Admitted Patient</label>
                <select
                  required
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id} - {p.admissionStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border text-slate-600">
                <p>
                  <strong>Ward:</strong> {assignModalBed.ward}
                </p>
                <p>
                  <strong>Daily Bed Tariff:</strong> ₹{assignModalBed.dailyRate.toLocaleString('en-IN')}/day
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAssignModalBed(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold shadow-xs"
                >
                  Confirm Bed Allocation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
