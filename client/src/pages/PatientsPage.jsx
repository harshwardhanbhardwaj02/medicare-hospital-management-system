import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Activity,
  Heart,
  Thermometer,
  Bed,
  Stethoscope,
  Trash2,
  FileText,
  CheckCircle2,
  ArrowRightCircle,
  AlertCircle
} from 'lucide-react';

export default function PatientsPage({
  patients,
  doctors,
  beds,
  onAddPatient,
  onDischargePatient,
  onDeletePatient
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    contact: '',
    email: '',
    address: '',
    department: 'Cardiology',
    assignedDoctor: doctors[0]?.name || 'Dr. Vikram Malhotra',
    admissionStatus: 'Admitted',
    roomBed: '',
    diagnosis: '',
    allergies: 'None',
    vitals: {
      bp: '120/80 mmHg',
      heartRate: '72 bpm',
      temp: '98.6 °F',
      spO2: '98%'
    }
  });

  const availableBeds = beds.filter((b) => b.status === 'Available');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || patient.admissionStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddPatient({
      ...formData,
      age: Number(formData.age) || 30
    });
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      bloodGroup: 'B+',
      contact: '',
      email: '',
      address: '',
      department: 'Cardiology',
      assignedDoctor: doctors[0]?.name || '',
      admissionStatus: 'Admitted',
      roomBed: '',
      diagnosis: '',
      allergies: 'None',
      vitals: { bp: '120/80 mmHg', heartRate: '72 bpm', temp: '98.6 °F', spO2: '98%' }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Patient Directory & Inpatient Care</h2>
          <p className="text-xs text-slate-500">
            Clinical vitals, admissions, Indian ward bed assignments, and discharge summaries
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-xs transition transform active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Patient</span>
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
            placeholder="Search by name, UHID / ID, diagnosis..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Admitted', 'Outpatient', 'Discharged'].map((st) => (
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

      {/* Patient Cards / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
          >
            {/* Top Bar of Card */}
            <div className="p-5 border-b border-slate-100 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {patient.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{patient.name}</h3>
                  <p className="text-xs text-slate-500">
                    {patient.age} yrs • {patient.gender} • Blood Group:{' '}
                    <span className="font-bold text-rose-600">{patient.bloodGroup}</span>
                  </p>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    patient.admissionStatus === 'Admitted'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : patient.admissionStatus === 'Outpatient'
                      ? 'bg-sky-50 text-sky-700 border-sky-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {patient.admissionStatus}
                </span>
              </div>

              {/* Diagnosis & Dept */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <p className="text-slate-400 font-semibold text-[10px] uppercase">Diagnosis</p>
                <p className="font-semibold text-slate-800 line-clamp-1">{patient.diagnosis || 'General Health Check'}</p>
                <div className="mt-1 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>Dept: {patient.department}</span>
                  {patient.roomBed && (
                    <span className="font-semibold text-teal-700 flex items-center gap-1">
                      <Bed className="w-3 h-3" /> {patient.roomBed}
                    </span>
                  )}
                </div>
              </div>

              {/* Vitals Ribbon */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-1.5 rounded-lg bg-teal-50/60 border border-teal-100">
                  <p className="text-[10px] text-slate-400">BP</p>
                  <p className="text-xs font-bold text-teal-800">{patient.vitals?.bp || '120/80'}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-rose-50/60 border border-rose-100">
                  <p className="text-[10px] text-slate-400">Pulse</p>
                  <p className="text-xs font-bold text-rose-700">{patient.vitals?.heartRate || '72'}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-50/60 border border-amber-100">
                  <p className="text-[10px] text-slate-400">Temp</p>
                  <p className="text-xs font-bold text-amber-700">{patient.vitals?.temp || '98.6'}</p>
                </div>
                <div className="p-1.5 rounded-lg bg-sky-50/60 border border-sky-100">
                  <p className="text-[10px] text-slate-400">SpO2</p>
                  <p className="text-xs font-bold text-sky-700">{patient.vitals?.spO2 || '98%'}</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedPatient(patient)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Full Record</span>
              </button>

              {patient.admissionStatus === 'Admitted' && (
                <button
                  onClick={() => onDischargePatient(patient.id)}
                  title="Discharge patient and release bed"
                  className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Discharge</span>
                </button>
              )}

              <button
                onClick={() => onDeletePatient(patient.id)}
                title="Delete Record"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="font-semibold">No patients match your search criteria</p>
        </div>
      )}

      {/* Patient Full Record Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded">
                  {selectedPatient.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedPatient.name}</h3>
                <p className="text-xs text-slate-500">
                  Admitted Date: {selectedPatient.admissionDate}
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block font-medium">Physician In-Charge</span>
                  <span className="font-bold text-slate-800">{selectedPatient.assignedDoctor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Ward & Bed</span>
                  <span className="font-bold text-teal-700">{selectedPatient.roomBed || 'Not Assigned'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Allergies</span>
                  <span className="font-bold text-rose-600">{selectedPatient.allergies || 'None'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Contact Phone</span>
                  <span className="font-bold text-slate-800">{selectedPatient.contact}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Clinical Diagnosis</span>
                <p className="p-2.5 rounded-lg bg-teal-50/50 text-teal-950 font-medium">
                  {selectedPatient.diagnosis}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-1">Current Vitals</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-100 font-mono">
                    <p className="text-[10px] text-slate-500">BP</p>
                    <p className="font-bold text-slate-800">{selectedPatient.vitals?.bp}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-100 font-mono">
                    <p className="text-[10px] text-slate-500">Pulse</p>
                    <p className="font-bold text-slate-800">{selectedPatient.vitals?.heartRate}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-100 font-mono">
                    <p className="text-[10px] text-slate-500">Temp</p>
                    <p className="font-bold text-slate-800">{selectedPatient.vitals?.temp}</p>
                  </div>
                  <div className="p-2 rounded bg-slate-100 font-mono">
                    <p className="text-[10px] text-slate-500">SpO2</p>
                    <p className="font-bold text-slate-800">{selectedPatient.vitals?.spO2}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Patient Registration & Triage</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                    placeholder="e.g. Ramesh Kumar Patel"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                      placeholder="e.g. 42"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Admission Type</label>
                  <select
                    value={formData.admissionStatus}
                    onChange={(e) => setFormData({ ...formData, admissionStatus: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  >
                    <option>Admitted</option>
                    <option>Outpatient</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign Bed</label>
                  <select
                    value={formData.roomBed}
                    onChange={(e) => setFormData({ ...formData, roomBed: e.target.value })}
                    disabled={formData.admissionStatus !== 'Admitted'}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none disabled:bg-slate-100"
                  >
                    <option value="">None / Waitlist</option>
                    {availableBeds.map((bed) => (
                      <option key={bed.id} value={`${bed.ward} - ${bed.bedNumber}`}>
                        {bed.ward} - {bed.bedNumber} (₹{bed.dailyRate.toLocaleString('en-IN')}/day)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  >
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                    <option>Pulmonology</option>
                    <option>Pediatrics</option>
                    <option>General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Physician</label>
                  <select
                    value={formData.assignedDoctor}
                    onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} ({doc.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Diagnosis & Clinical Complaints</label>
                <textarea
                  required
                  rows={2}
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                  placeholder="Primary complaints, symptoms, vital notes..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="+91 98000 00000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Known Drug Allergies</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Sulfa or None"
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
                  Admit & Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
