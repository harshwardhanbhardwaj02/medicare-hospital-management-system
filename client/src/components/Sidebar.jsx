import React from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck2,
  Bed,
  Pill,
  Receipt,
  HeartPulse,
  Sparkles,
  GitBranch
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users, badge: null },
  { id: 'doctors', label: 'Doctors & Staff', icon: Stethoscope, badge: null },
  { id: 'appointments', label: 'Appointments', icon: CalendarCheck2, badge: null },
  { id: 'beds', label: 'Beds & Wards', icon: Bed, badge: null },
  { id: 'pharmacy', label: 'Pharmacy Store', icon: Pill, badge: null },
  { id: 'billing', label: 'Billing & Invoices', icon: Receipt, badge: null },
];

export default function Sidebar({ currentTab, setCurrentTab, stats }) {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800 select-none no-print">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              MediCare <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-teal-500/20 text-teal-400 border border-teal-500/30">HMS</span>
            </h1>
            <p className="text-[11px] text-slate-400">Hospital Center v1.0</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Management
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-teal-500/20 to-teal-500/5 text-teal-400 border border-teal-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'appointments' && stats?.pendingAppointments > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    {stats.pendingAppointments}
                  </span>
                )}
                {item.id === 'beds' && stats?.occupancyRate !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300">
                    {stats.occupancyRate}%
                  </span>
                )}
                {item.id === 'pharmacy' && stats?.lowStockMedicines > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {stats.lowStockMedicines}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bed Occupancy Quick Card & Git Footer */}
      <div className="p-4 space-y-3 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Beds Capacity</span>
            <span className="text-teal-400 font-bold">
              {stats?.occupiedBeds || 0} / {stats?.totalBeds || 0}
            </span>
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-linear-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats?.occupancyRate || 0}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 flex items-center justify-between">
            <span>{stats?.availableBeds || 0} beds available</span>
            <span>{stats?.occupancyRate || 0}% full</span>
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-teal-400" />
            <span>Git Ready</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
            main
          </span>
        </div>
      </div>
    </aside>
  );
}
