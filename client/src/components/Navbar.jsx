import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  Activity,
  PhoneCall,
  ShieldCheck,
  User,
  Clock
} from 'lucide-react';

export default function Navbar({ activeRole, setActiveRole, searchQuery, setSearchQuery }) {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3.5 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      {/* Search Bar */}
      <div className="flex items-center gap-3 w-96 max-w-full">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients, doctors, records, medicines..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-xl border border-transparent focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Live Clock & ER Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/60">
          <Clock className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
          <span>IST: {time}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>ER Ready</span>
        </div>

        {/* Emergency Hotline */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200/60">
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span>Emergency Ambulance: 108 / 102</span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70 text-xs">
          {['Admin', 'Doctor', 'Reception'].map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeRole === role
                  ? 'bg-white text-teal-700 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Indian User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-teal-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-white">
            HV
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">Dr. Harsh Vardhan</p>
            <p className="text-[11px] text-slate-400 capitalize">{activeRole} Portal</p>
          </div>
        </div>
      </div>
    </header>
  );
}
