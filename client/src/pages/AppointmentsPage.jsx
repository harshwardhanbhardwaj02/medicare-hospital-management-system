import React, { useState } from 'react';
import {
  CalendarCheck2,
  Calendar,
  Clock,
  User,
  Stethoscope,
  PlusCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  FileText
} from 'lucide-react';

export default function AppointmentsPage({
  appointments,
  patients,
  doctors,
  onAddAppointment,
  onUpdateStatus,
  onDeleteAppointment
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: patients[0]?.name || '',
    patientId: patients[0]?.id || '',
    doctorName: doctors[0]?.name || '',
    doctorId: doctors[0]?.id || '',
    department: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    type: 'Consultation',
    notes: ''
  });

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePatientSelect = (e) => {
    const selectedName = e.target.value;
    const found = patients.find((p) => p.name === selectedName);
    setFormData({
      ...formData,
      patientName: selectedName,
      patientId: found ? found.id : 'PAT-NEW'
    });
  };

  const handleDoctorSelect = (e) => {
    const selectedName = e.target.value;
    const found = doctors.find((d) => d.name === selectedName);
    setFormData({
      ...formData,
      doctorName: selectedName,
      doctorId: found ? found.id : 'DOC-NEW',
      department: found ? found.department : formData.department
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.doctorName) return;
    onAddAppointment(formData);
    setIsAddModalOpen(false);
    setFormData({
      patientName: patients[0]?.name || '',
      patientId: patients[0]?.id || '',
      doctorName: doctors[0]?.name || '',
      doctorId: doctors[0]?.id || '',
      department: 'Cardiology',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      type: 'Consultation',
      notes: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Appointment Management & Scheduling</h2>
          <p className="text-xs text-slate-500">
            Coordinate outpatient consultations, checkups, and diagnostic review queues
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
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
            placeholder="Search by patient, doctor, or ID..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {['All', 'Scheduled', 'Completed', 'Cancelled'].map((st) => (
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

      {/* Appointments List Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200">
                <th className="py-3.5 px-5 font-bold">Appt ID</th>
                <th className="py-3.5 px-5 font-bold">Patient</th>
                <th className="py-3.5 px-5 font-bold">Doctor / Dept</th>
                <th className="py-3.5 px-5 font-bold">Date & Time</th>
                <th className="py-3.5 px-5 font-bold">Type</th>
                <th className="py-3.5 px-5 font-bold">Status</th>
                <th className="py-3.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-5 font-mono font-bold text-slate-500">{apt.id}</td>
                  <td className="py-4 px-5">
                    <p className="font-bold text-slate-900">{apt.patientName}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{apt.patientId}</p>
                  </td>
                  <td className="py-4 px-5">
                    <p className="font-semibold text-slate-800">{apt.doctorName}</p>
                    <span className="text-[11px] text-teal-700 font-medium">{apt.department}</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{apt.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {apt.type}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : apt.status === 'Cancelled'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right space-x-1.5">
                    {apt.status === 'Scheduled' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'Completed')}
                          title="Mark Complete"
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => onUpdateStatus(apt.id, 'Cancelled')}
                          title="Cancel"
                          className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => onDeleteAppointment(apt.id)}
                      className="px-2 py-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="p-10 text-center text-slate-400">
            No appointments found matching your search.
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Schedule Clinical Appointment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
                <select
                  required
                  value={formData.patientName}
                  onChange={handlePatientSelect}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.id} - {p.admissionStatus})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Physician</label>
                <select
                  required
                  value={formData.doctorName}
                  onChange={handleDoctorSelect}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.specialty} - {d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g. 10:30 AM"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Appointment Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                >
                  <option>Consultation</option>
                  <option>Follow-up</option>
                  <option>Routine Checkup</option>
                  <option>Emergency Evaluation</option>
                  <option>Pre-Surgery Assessment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Reason for visit, symptoms, special accommodations..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                />
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
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
