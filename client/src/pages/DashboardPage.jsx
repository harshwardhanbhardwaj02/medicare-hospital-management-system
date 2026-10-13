import React from 'react';
import {
  Users,
  Bed,
  CalendarCheck2,
  DollarSign,
  Stethoscope,
  Pill,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee
} from 'lucide-react';

export default function DashboardPage({ statsData, onNavigate, onOpenAction }) {
  const stats = statsData?.stats || {
    totalPatients: 0,
    admittedPatients: 0,
    outpatients: 0,
    totalDoctors: 0,
    availableDoctors: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    occupancyRate: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    lowStockMedicines: 0
  };

  const monthlyTrends = statsData?.monthlyTrends || [];
  const departmentDistribution = statsData?.departmentDistribution || [];
  const recentActivities = statsData?.recentActivities || [];

  const maxPatients = Math.max(...monthlyTrends.map((t) => t.patients), 200);

  const formatINR = (val) => `₹${Number(val || 0).toLocaleString('en-IN')}`;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-teal-700 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-400/30">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            Operational Center Active • Delhi NCR
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            MediCare Central Operations
          </h2>
          <p className="mt-2 text-sm text-teal-100/90 leading-relaxed">
            Real-time patient tracking, bed allocations, doctor duty rosters, pharmacy inventory, and billing workflows in Indian Rupees (₹).
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onOpenAction('addPatient')}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Admit Patient</span>
            </button>
            <button
              onClick={() => onOpenAction('bookAppointment')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
            >
              <CalendarCheck2 className="w-4 h-4 text-teal-300" />
              <span>Schedule Appointment</span>
            </button>
            <button
              onClick={() => onOpenAction('createInvoice')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
            >
              <FileText className="w-4 h-4 text-teal-300" />
              <span>Generate Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Patients */}
        <div
          onClick={() => onNavigate('patients')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Patients
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{stats.totalPatients}</span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12% this mo
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex justify-between">
            <span>Admitted: {stats.admittedPatients}</span>
            <span>Outpatient: {stats.outpatients}</span>
          </div>
        </div>

        {/* Bed Occupancy */}
        <div
          onClick={() => onNavigate('beds')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bed Occupancy
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <Bed className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{stats.occupancyRate}%</span>
            <span className="text-xs font-semibold text-indigo-600">
              {stats.occupiedBeds} of {stats.totalBeds} Beds
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{ width: `${stats.occupancyRate}%` }}
            />
          </div>
        </div>

        {/* Collected Revenue in INR */}
        <div
          onClick={() => onNavigate('billing')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Collected Revenue (INR)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition font-bold text-lg">
              ₹
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">
              {formatINR(stats.totalRevenue)}
            </span>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +18.4%
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Pending Collections: <span className="font-semibold text-amber-600">{formatINR(stats.pendingRevenue)}</span>
          </p>
        </div>

        {/* Doctors & Appointments */}
        <div
          onClick={() => onNavigate('appointments')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Queued Appointments
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{stats.pendingAppointments}</span>
            <span className="text-xs font-semibold text-teal-600">
              {stats.availableDoctors} Doctors On Duty
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Low Stock Medicines:{' '}
            <span className={stats.lowStockMedicines > 0 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
              {stats.lowStockMedicines} items
            </span>
          </p>
        </div>
      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Patient & Revenue Trends Chart (Pure SVG) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Patient Inflow & Growth</h3>
              <p className="text-xs text-slate-400">Monthly patient volume and admission stats</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-teal-500 inline-block"></span>
                Inflow
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
                Admissions
              </span>
            </div>
          </div>

          {/* SVG Bar Chart with values */}
          <div className="h-64 flex items-end justify-between gap-4 pt-4 px-2 border-b border-slate-100">
            {monthlyTrends.map((trend, idx) => {
              const heightPercent = (trend.patients / maxPatients) * 100;
              const admissionPercent = (trend.admissions / maxPatients) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[11px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                    {trend.patients}
                  </div>
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1.5 h-full">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-1/2 bg-linear-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    />
                    <div
                      style={{ height: `${admissionPercent}%` }}
                      className="w-1/2 bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{trend.month}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>Average: 167 Patients / month</span>
            <span className="text-teal-600 font-semibold">98.4% Recovery & Discharge Rate</span>
          </div>
        </div>

        {/* Department Workload Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Department Workload</h3>
            <p className="text-xs text-slate-400">Active patients by medical division</p>

            <div className="mt-5 space-y-4">
              {departmentDistribution.map((dept, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept.department}</span>
                    <span className="text-slate-500 font-medium">{dept.count} cases ({dept.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0
                          ? 'bg-teal-500'
                          : idx === 1
                          ? 'bg-indigo-500'
                          : idx === 2
                          ? 'bg-sky-500'
                          : idx === 3
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${dept.percentage * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
            <span className="text-slate-500 font-medium">All Specialty Units</span>
            <span className="text-emerald-700 font-bold">100% Operational</span>
          </div>
        </div>
      </div>

      {/* Recent Activities & Audit Trail */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Hospital Live Activity Feed</h3>
          </div>
          <span className="text-xs text-slate-400">Real-time event log</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivities.slice(0, 6).map((activity) => (
            <div key={activity.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    activity.type === 'admission'
                      ? 'bg-teal-50 text-teal-600'
                      : activity.type === 'payment'
                      ? 'bg-emerald-50 text-emerald-600'
                      : activity.type === 'appointment'
                      ? 'bg-sky-50 text-sky-600'
                      : activity.type === 'pharmacy'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-indigo-50 text-indigo-600'
                  }`}
                >
                  {activity.type === 'payment' ? (
                    <span className="font-bold text-xs">₹</span>
                  ) : activity.type === 'appointment' ? (
                    <CalendarCheck2 className="w-3.5 h-3.5" />
                  ) : activity.type === 'pharmacy' ? (
                    <Pill className="w-3.5 h-3.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="text-slate-700 font-medium">{activity.description}</span>
              </div>
              <span className="text-slate-400 shrink-0 font-mono text-[11px]">
                {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'Just now'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
