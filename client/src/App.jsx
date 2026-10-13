import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import InvoiceReceiptModal from './components/InvoiceReceiptModal';

import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import DoctorsPage from './pages/DoctorsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import BedsPage from './pages/BedsPage';
import PharmacyPage from './pages/PharmacyPage';
import BillingPage from './pages/BillingPage';

import { api } from './api/client';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [activeRole, setActiveRole] = useState('Admin');
  const [searchQuery, setSearchQuery] = useState('');

  const [statsData, setStatsData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [beds, setBeds] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [selectedInvoiceReceipt, setSelectedInvoiceReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Show Toast
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        patientsRes,
        doctorsRes,
        appointmentsRes,
        bedsRes,
        medicinesRes,
        invoicesRes
      ] = await Promise.all([
        api.getDashboardStats(),
        api.getPatients(),
        api.getDoctors(),
        api.getAppointments(),
        api.getBeds(),
        api.getMedicines(),
        api.getInvoices()
      ]);

      setStatsData(statsRes);
      setPatients(patientsRes);
      setDoctors(doctorsRes);
      setAppointments(appointmentsRes);
      setBeds(bedsRes);
      setMedicines(medicinesRes);
      setInvoices(invoicesRes);
    } catch (err) {
      console.error('Failed to load data:', err);
      showToast('Error connecting to MediCare server: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers for Patients
  const handleAddPatient = async (data) => {
    try {
      const created = await api.createPatient(data);
      setPatients([created, ...patients]);
      showToast(`Patient ${created.name} registered successfully`);
      fetchData(); // refresh stats & bed statuses
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDischargePatient = async (id) => {
    try {
      const res = await api.dischargePatient(id);
      setPatients(patients.map((p) => (p.id === id ? res.patient : p)));
      showToast('Patient successfully discharged and bed vacated');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient record?')) return;
    try {
      await api.deletePatient(id);
      setPatients(patients.filter((p) => p.id !== id));
      showToast('Patient record deleted');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handlers for Doctors
  const handleAddDoctor = async (data) => {
    try {
      const created = await api.createDoctor(data);
      setDoctors([created, ...doctors]);
      showToast(`Dr. ${created.name} added to hospital roster`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleDoctorAvailability = async (id, isAvailable) => {
    try {
      const updated = await api.updateDoctor(id, { isAvailable });
      setDoctors(doctors.map((d) => (d.id === id ? updated : d)));
      showToast(`Doctor status updated to ${isAvailable ? 'On Duty' : 'Off Duty'}`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handlers for Appointments
  const handleAddAppointment = async (data) => {
    try {
      const created = await api.createAppointment(data);
      setAppointments([created, ...appointments]);
      showToast(`Appointment booked for ${created.patientName}`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      const updated = await api.updateAppointment(id, { status });
      setAppointments(appointments.map((a) => (a.id === id ? updated : a)));
      showToast(`Appointment status updated to ${status}`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      await api.deleteAppointment(id);
      setAppointments(appointments.filter((a) => a.id !== id));
      showToast('Appointment removed');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handlers for Beds
  const handleUpdateBed = async (id, data) => {
    try {
      const updated = await api.updateBed(id, data);
      setBeds(beds.map((b) => (b.id === id ? updated : b)));
      showToast(`Bed ${updated.ward} - ${updated.bedNumber} updated`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handlers for Pharmacy
  const handleAddMedicine = async (data) => {
    try {
      const created = await api.createMedicine(data);
      setMedicines([created, ...medicines]);
      showToast(`${created.name} added to pharmacy inventory`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateMedicine = async (id, data) => {
    try {
      const updated = await api.updateMedicine(id, data);
      setMedicines(medicines.map((m) => (m.id === id ? updated : m)));
      showToast(`Medicine ${updated.name} updated`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDispenseMedicine = async (id, payload) => {
    try {
      const res = await api.dispenseMedicine(id, payload);
      setMedicines(medicines.map((m) => (m.id === id ? res.medicine : m)));
      showToast(`Dispensed ${payload.quantity}x of ${res.medicine.name}`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handlers for Billing
  const handleCreateInvoice = async (data) => {
    try {
      const created = await api.createInvoice(data);
      setInvoices([created, ...invoices]);
      showToast(`Invoice ${created.id} issued for ${created.patientName}`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleUpdateInvoice = async (id, data) => {
    try {
      const updated = await api.updateInvoice(id, data);
      setInvoices(invoices.map((i) => (i.id === id ? updated : i)));
      if (selectedInvoiceReceipt?.id === id) {
        setSelectedInvoiceReceipt(updated);
      }
      showToast(`Invoice ${updated.id} updated`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Quick Action Handler from Dashboard
  const handleOpenAction = (action) => {
    if (action === 'addPatient') setCurrentTab('patients');
    if (action === 'bookAppointment') setCurrentTab('appointments');
    if (action === 'createInvoice') setCurrentTab('billing');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        stats={statsData?.stats}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeRole={activeRole}
          setActiveRole={setActiveRole}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
              <p className="font-semibold text-slate-600 text-sm">
                Connecting to MediCare Hospital Central Database...
              </p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardPage
                  statsData={statsData}
                  onNavigate={setCurrentTab}
                  onOpenAction={handleOpenAction}
                />
              )}

              {currentTab === 'patients' && (
                <PatientsPage
                  patients={patients}
                  doctors={doctors}
                  beds={beds}
                  onAddPatient={handleAddPatient}
                  onDischargePatient={handleDischargePatient}
                  onDeletePatient={handleDeletePatient}
                />
              )}

              {currentTab === 'doctors' && (
                <DoctorsPage
                  doctors={doctors}
                  onAddDoctor={handleAddDoctor}
                  onToggleAvailability={handleToggleDoctorAvailability}
                />
              )}

              {currentTab === 'appointments' && (
                <AppointmentsPage
                  appointments={appointments}
                  patients={patients}
                  doctors={doctors}
                  onAddAppointment={handleAddAppointment}
                  onUpdateStatus={handleUpdateAppointmentStatus}
                  onDeleteAppointment={handleDeleteAppointment}
                />
              )}

              {currentTab === 'beds' && (
                <BedsPage
                  beds={beds}
                  patients={patients}
                  onUpdateBed={handleUpdateBed}
                />
              )}

              {currentTab === 'pharmacy' && (
                <PharmacyPage
                  medicines={medicines}
                  patients={patients}
                  onAddMedicine={handleAddMedicine}
                  onUpdateMedicine={handleUpdateMedicine}
                  onDispenseMedicine={handleDispenseMedicine}
                />
              )}

              {currentTab === 'billing' && (
                <BillingPage
                  invoices={invoices}
                  patients={patients}
                  onCreateInvoice={handleCreateInvoice}
                  onUpdateInvoice={handleUpdateInvoice}
                  onViewReceipt={setSelectedInvoiceReceipt}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Official Printable Invoice Receipt Modal */}
      <InvoiceReceiptModal
        invoice={selectedInvoiceReceipt}
        isOpen={Boolean(selectedInvoiceReceipt)}
        onClose={() => setSelectedInvoiceReceipt(null)}
        onMarkPaid={(id) => handleUpdateInvoice(id, { status: 'Paid' })}
      />

      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom duration-300 no-print ${
            toast.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-900 text-teal-300 border border-teal-500/30'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-white" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
