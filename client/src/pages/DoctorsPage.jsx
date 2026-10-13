import React, { useState } from 'react';
import {
  Stethoscope,
  UserPlus,
  Star,
  Clock,
  Phone,
  Mail,
  Award,
  CheckCircle,
  XCircle,
  Search,
  Filter
} from 'lucide-react';

export default function DoctorsPage({ doctors, onAddDoctor, onToggleAvailability }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    department: 'Cardiology',
    qualification: '',
    contact: '',
    email: '',
    schedule: 'Mon - Fri: 09:00 - 17:00',
    consultationFee: 1200,
    experienceYears: 10
  });

  const departments = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'Pulmonology', 'Pediatrics'];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || doc.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddDoctor({
      ...formData,
      consultationFee: Number(formData.consultationFee) || 1200,
      experienceYears: Number(formData.experienceYears) || 5
    });
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      specialty: '',
      department: 'Cardiology',
      qualification: '',
      contact: '',
      email: '',
      schedule: 'Mon - Fri: 09:00 - 17:00',
      consultationFee: 1200,
      experienceYears: 10
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Medical Specialists & Senior Consultants</h2>
          <p className="text-xs text-slate-500">
            Consultant OPD schedules, medical credentials, consultation fees (₹), and duty rosters
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Medical Staff</span>
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
            placeholder="Search by physician name or specialty..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-none transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                departmentFilter === dept
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-4">
              {/* Doctor Avatar & Status */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-base shadow-inner">
                    {doc.name.replace('Dr. ', '').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs font-medium text-teal-700">{doc.specialty}</p>
                    <p className="text-[11px] text-slate-400">{doc.qualification}</p>
                  </div>
                </div>

                <button
                  onClick={() => onToggleAvailability(doc.id, !doc.isAvailable)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition flex items-center gap-1 ${
                    doc.isAvailable
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      doc.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  {doc.isAvailable ? 'On Duty' : 'Off Duty'}
                </button>
              </div>

              {/* Details & Experience */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] block">Experience</span>
                  <span className="font-bold text-slate-800">{doc.experienceYears || 8} yrs</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">OPD Fee</span>
                  <span className="font-bold text-teal-700">₹{(doc.consultationFee || 1000).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Rating</span>
                  <span className="font-bold text-amber-600 flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {doc.rating || 4.9}
                  </span>
                </div>
              </div>

              {/* Working Hours & Contact */}
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{doc.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-600 truncate">{doc.email}</span>
                </div>
              </div>
            </div>

            {/* Department Footer Tag */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">Division: {doc.department}</span>
              <span className="text-slate-400 font-mono text-[11px]">{doc.id}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Medical Consultant</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Rajesh Kulkarni"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Specialty</label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    placeholder="e.g. Senior Neurologist"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
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
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g. MBBS, MD, DM (AIIMS New Delhi)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">OPD Consultation Fee (₹ INR)</label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Years Experience</label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
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
                  <label className="block font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="doctor@medicare.in"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">OPD Clinic Schedule</label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="e.g. Mon - Fri: 09:00 - 16:30"
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
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
