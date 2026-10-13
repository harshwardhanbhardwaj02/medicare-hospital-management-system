const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Dashboard Analytics
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const data = db.getDashboardStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patients Routes
app.get('/api/patients', (req, res) => {
  try {
    res.json(db.getPatients());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/patients/:id', (req, res) => {
  try {
    const patient = db.getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/patients', (req, res) => {
  try {
    const newPatient = db.createPatient(req.body);
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/patients/:id', (req, res) => {
  try {
    const updated = db.updatePatient(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/patients/:id/discharge', (req, res) => {
  try {
    const updated = db.updatePatient(req.params.id, {
      admissionStatus: 'Discharged',
      roomBed: null
    });
    if (!updated) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient discharged successfully', patient: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/patients/:id', (req, res) => {
  try {
    const success = db.deletePatient(req.params.id);
    if (!success) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctors Routes
app.get('/api/doctors', (req, res) => {
  try {
    res.json(db.getDoctors());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/doctors', (req, res) => {
  try {
    const doctor = db.createDoctor(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/doctors/:id', (req, res) => {
  try {
    const updated = db.updateDoctor(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Doctor not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/doctors/:id', (req, res) => {
  try {
    const success = db.deleteDoctor(req.params.id);
    if (!success) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Appointments Routes
app.get('/api/appointments', (req, res) => {
  try {
    res.json(db.getAppointments());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/appointments', (req, res) => {
  try {
    const appointment = db.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/appointments/:id', (req, res) => {
  try {
    const updated = db.updateAppointment(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Appointment not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/appointments/:id', (req, res) => {
  try {
    const success = db.deleteAppointment(req.params.id);
    if (!success) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Beds Routes
app.get('/api/beds', (req, res) => {
  try {
    res.json(db.getBeds());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/beds/:id', (req, res) => {
  try {
    const updated = db.updateBed(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Bed not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Pharmacy Routes
app.get('/api/pharmacy', (req, res) => {
  try {
    res.json(db.getMedicines());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pharmacy', (req, res) => {
  try {
    const medicine = db.createMedicine(req.body);
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/pharmacy/:id', (req, res) => {
  try {
    const updated = db.updateMedicine(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Medicine not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/pharmacy/:id/dispense', (req, res) => {
  try {
    const { quantity, patientName } = req.body;
    const medicine = db.dispenseMedicine(req.params.id, quantity, patientName);
    res.json({ message: 'Medicine dispensed successfully', medicine });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Billing Routes
app.get('/api/billing', (req, res) => {
  try {
    res.json(db.getInvoices());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/billing/:id', (req, res) => {
  try {
    const invoice = db.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/billing', (req, res) => {
  try {
    const invoice = db.createInvoice(req.body);
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/billing/:id', (req, res) => {
  try {
    const updated = db.updateInvoice(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🏥 MediCare Hospital Management API running on port ${PORT}`);
});
