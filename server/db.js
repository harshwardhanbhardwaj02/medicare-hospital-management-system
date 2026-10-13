const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'hospital_db.json');

class Database {
  constructor() {
    this.data = {
      patients: [],
      doctors: [],
      appointments: [],
      beds: [],
      medicines: [],
      invoices: [],
      activities: []
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading database file:', err);
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database file:', err);
    }
  }

  logActivity(type, description) {
    const activity = {
      id: `ACT-${Date.now()}`,
      type,
      description,
      timestamp: new Date().toISOString()
    };
    this.data.activities = [activity, ...(this.data.activities || [])].slice(0, 30);
    this.save();
  }

  // Patients
  getPatients() {
    return this.data.patients;
  }

  getPatientById(id) {
    return this.data.patients.find(p => p.id === id);
  }

  createPatient(patientData) {
    const id = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient = {
      id,
      ...patientData,
      admissionDate: patientData.admissionDate || new Date().toISOString().split('T')[0],
      admissionStatus: patientData.admissionStatus || 'Outpatient',
      vitals: patientData.vitals || {
        bp: '120/80 mmHg',
        heartRate: '72 bpm',
        temp: '98.6 °F',
        spO2: '98%'
      }
    };
    this.data.patients.unshift(newPatient);

    // If bed is assigned, update bed
    if (newPatient.roomBed && newPatient.admissionStatus === 'Admitted') {
      const bed = this.data.beds.find(b => `${b.ward} - ${b.bedNumber}` === newPatient.roomBed || b.id === newPatient.roomBed);
      if (bed) {
        bed.status = 'Occupied';
        bed.patientId = newPatient.id;
        bed.patientName = newPatient.name;
        bed.admittedSince = newPatient.admissionDate;
      }
    }

    this.logActivity('admission', `New patient registered: ${newPatient.name} (${newPatient.admissionStatus})`);
    this.save();
    return newPatient;
  }

  updatePatient(id, updates) {
    const idx = this.data.patients.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const old = this.data.patients[idx];

    // If discharging
    if (updates.admissionStatus === 'Discharged' && old.admissionStatus === 'Admitted') {
      const bed = this.data.beds.find(b => b.patientId === id);
      if (bed) {
        bed.status = 'Available';
        bed.patientId = null;
        bed.patientName = null;
        bed.admittedSince = null;
      }
      updates.roomBed = null;
      this.logActivity('discharge', `Patient ${old.name} successfully discharged`);
    }

    this.data.patients[idx] = { ...old, ...updates };
    this.save();
    return this.data.patients[idx];
  }

  deletePatient(id) {
    const idx = this.data.patients.findIndex(p => p.id === id);
    if (idx === -1) return false;
    const [removed] = this.data.patients.splice(idx, 1);
    const bed = this.data.beds.find(b => b.patientId === id);
    if (bed) {
      bed.status = 'Available';
      bed.patientId = null;
      bed.patientName = null;
      bed.admittedSince = null;
    }
    this.logActivity('patient', `Patient record removed: ${removed.name}`);
    this.save();
    return true;
  }

  // Doctors
  getDoctors() {
    return this.data.doctors;
  }

  createDoctor(doctorData) {
    const id = `DOC-${Math.floor(200 + Math.random() * 800)}`;
    const newDoctor = {
      id,
      rating: 5.0,
      activePatientsCount: 0,
      isAvailable: true,
      consultationFee: Number(doctorData.consultationFee) || 1200,
      ...doctorData
    };
    this.data.doctors.unshift(newDoctor);
    this.logActivity('doctor', `Dr. ${newDoctor.name} joined ${newDoctor.department} team`);
    this.save();
    return newDoctor;
  }

  updateDoctor(id, updates) {
    const idx = this.data.doctors.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.data.doctors[idx] = { ...this.data.doctors[idx], ...updates };
    this.save();
    return this.data.doctors[idx];
  }

  deleteDoctor(id) {
    const idx = this.data.doctors.findIndex(d => d.id === id);
    if (idx === -1) return false;
    this.data.doctors.splice(idx, 1);
    this.save();
    return true;
  }

  // Appointments
  getAppointments() {
    return this.data.appointments;
  }

  createAppointment(aptData) {
    const id = `APT-${Math.floor(500 + Math.random() * 500)}`;
    const newApt = {
      id,
      status: 'Scheduled',
      ...aptData
    };
    this.data.appointments.unshift(newApt);
    this.logActivity('appointment', `Appointment scheduled for ${newApt.patientName} with ${newApt.doctorName}`);
    this.save();
    return newApt;
  }

  updateAppointment(id, updates) {
    const idx = this.data.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.appointments[idx] = { ...this.data.appointments[idx], ...updates };
    this.save();
    return this.data.appointments[idx];
  }

  deleteAppointment(id) {
    const idx = this.data.appointments.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.data.appointments.splice(idx, 1);
    this.save();
    return true;
  }

  // Beds
  getBeds() {
    return this.data.beds;
  }

  updateBed(id, updates) {
    const idx = this.data.beds.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.beds[idx] = { ...this.data.beds[idx], ...updates };
    this.save();
    return this.data.beds[idx];
  }

  // Pharmacy
  getMedicines() {
    return this.data.medicines;
  }

  createMedicine(medData) {
    const id = `MED-${Math.floor(300 + Math.random() * 700)}`;
    const stock = Number(medData.stock) || 0;
    const minThreshold = Number(medData.minThreshold) || 30;
    const status = stock <= 0 ? 'Out of Stock' : (stock <= minThreshold ? 'Low Stock' : 'In Stock');

    const newMed = {
      id,
      ...medData,
      stock,
      minThreshold,
      unitPrice: Number(medData.unitPrice) || 80,
      status
    };
    this.data.medicines.unshift(newMed);
    this.logActivity('pharmacy', `Added formulary stock: ${newMed.name} (${newMed.stock} units)`);
    this.save();
    return newMed;
  }

  updateMedicine(id, updates) {
    const idx = this.data.medicines.findIndex(m => m.id === id);
    if (idx === -1) return null;
    const current = this.data.medicines[idx];
    const updated = { ...current, ...updates };

    if (updates.stock !== undefined) {
      updated.stock = Number(updates.stock);
      const min = updated.minThreshold || 30;
      updated.status = updated.stock <= 0 ? 'Out of Stock' : (updated.stock <= min ? 'Low Stock' : 'In Stock');
    }

    this.data.medicines[idx] = updated;
    this.save();
    return this.data.medicines[idx];
  }

  dispenseMedicine(id, quantity, patientName) {
    const idx = this.data.medicines.findIndex(m => m.id === id);
    if (idx === -1) return null;
    const med = this.data.medicines[idx];
    const qty = Number(quantity) || 1;
    if (med.stock < qty) {
      throw new Error(`Insufficient stock. Current available: ${med.stock}`);
    }
    med.stock -= qty;
    med.status = med.stock <= 0 ? 'Out of Stock' : (med.stock <= med.minThreshold ? 'Low Stock' : 'In Stock');
    this.logActivity('pharmacy', `Dispensed ${qty}x ${med.name} to ${patientName || 'Walk-in Patient'}`);
    this.save();
    return med;
  }

  // Billing
  getInvoices() {
    return this.data.invoices;
  }

  getInvoiceById(id) {
    return this.data.invoices.find(inv => inv.id === id);
  }

  createInvoice(invData) {
    const id = `INV-${Math.floor(9000 + Math.random() * 1000)}`;
    const items = invData.items || [];
    const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const discount = Number(invData.discount) || 0;
    const total = Math.round((subtotal + tax - discount) * 100) / 100;

    const newInvoice = {
      id,
      patientId: invData.patientId || 'N/A',
      patientName: invData.patientName,
      invoiceDate: invData.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: invData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      status: invData.status || 'Pending',
      paymentMethod: invData.paymentMethod || 'UPI / Online',
      items,
      subtotal,
      tax,
      discount,
      total
    };
    this.data.invoices.unshift(newInvoice);
    this.logActivity('billing', `Generated invoice ${newInvoice.id} for ${newInvoice.patientName} (₹${newInvoice.total.toLocaleString('en-IN')})`);
    this.save();
    return newInvoice;
  }

  updateInvoice(id, updates) {
    const idx = this.data.invoices.findIndex(inv => inv.id === id);
    if (idx === -1) return null;
    const current = this.data.invoices[idx];

    if (updates.status === 'Paid' && current.status !== 'Paid') {
      this.logActivity('payment', `Invoice ${current.id} (₹${current.total.toLocaleString('en-IN')}) received and marked as Paid`);
    }

    this.data.invoices[idx] = { ...current, ...updates };
    this.save();
    return this.data.invoices[idx];
  }

  // Dashboard Stats
  getDashboardStats() {
    const totalPatients = this.data.patients.length;
    const admittedPatients = this.data.patients.filter(p => p.admissionStatus === 'Admitted').length;
    const outpatients = this.data.patients.filter(p => p.admissionStatus === 'Outpatient').length;
    const totalDoctors = this.data.doctors.length;
    const availableDoctors = this.data.doctors.filter(d => d.isAvailable).length;

    const totalBeds = this.data.beds.length;
    const occupiedBeds = this.data.beds.filter(b => b.status === 'Occupied').length;
    const availableBeds = this.data.beds.filter(b => b.status === 'Available').length;
    const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    const pendingAppointments = this.data.appointments.filter(a => a.status === 'Scheduled').length;
    const totalInvoices = this.data.invoices.length;
    const totalRevenue = this.data.invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0);
    const pendingRevenue = this.data.invoices
      .filter(i => i.status === 'Pending')
      .reduce((sum, i) => sum + (Number(i.total) || 0), 0);

    const lowStockMedicines = this.data.medicines.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length;

    // Monthly Indian Rupee Trends (₹ in INR)
    const monthlyTrends = [
      { month: 'May', patients: 120, revenue: 384000, admissions: 42 },
      { month: 'Jun', patients: 145, revenue: 452000, admissions: 50 },
      { month: 'Jul', patients: 170, revenue: 560000, admissions: 64 },
      { month: 'Aug', patients: 160, revenue: 510000, admissions: 58 },
      { month: 'Sep', patients: 195, revenue: 635000, admissions: 72 },
      { month: 'Oct', patients: 210, revenue: 718000, admissions: 79 }
    ];

    const departmentDistribution = [
      { department: 'Cardiology', count: 32, percentage: 30 },
      { department: 'Neurology', count: 24, percentage: 22 },
      { department: 'Orthopedics', count: 21, percentage: 20 },
      { department: 'Pulmonology', count: 18, percentage: 17 },
      { department: 'Pediatrics', count: 12, percentage: 11 }
    ];

    return {
      stats: {
        totalPatients,
        admittedPatients,
        outpatients,
        totalDoctors,
        availableDoctors,
        totalBeds,
        occupiedBeds,
        availableBeds,
        occupancyRate,
        pendingAppointments,
        totalInvoices,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingRevenue: Math.round(pendingRevenue * 100) / 100,
        lowStockMedicines
      },
      monthlyTrends,
      departmentDistribution,
      recentActivities: this.data.activities || []
    };
  }
}

module.exports = new Database();
