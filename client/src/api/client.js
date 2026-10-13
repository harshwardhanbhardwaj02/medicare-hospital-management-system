const API_BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Health
  getHealth: () => fetch(`${API_BASE}/health`).then(handleResponse),

  // Dashboard
  getDashboardStats: () => fetch(`${API_BASE}/dashboard/stats`).then(handleResponse),

  // Patients
  getPatients: () => fetch(`${API_BASE}/patients`).then(handleResponse),
  getPatientById: (id) => fetch(`${API_BASE}/patients/${id}`).then(handleResponse),
  createPatient: (data) =>
    fetch(`${API_BASE}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updatePatient: (id, data) =>
    fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  dischargePatient: (id) =>
    fetch(`${API_BASE}/patients/${id}/discharge`, {
      method: 'POST',
    }).then(handleResponse),
  deletePatient: (id) =>
    fetch(`${API_BASE}/patients/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Doctors
  getDoctors: () => fetch(`${API_BASE}/doctors`).then(handleResponse),
  createDoctor: (data) =>
    fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateDoctor: (id, data) =>
    fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteDoctor: (id) =>
    fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Appointments
  getAppointments: () => fetch(`${API_BASE}/appointments`).then(handleResponse),
  createAppointment: (data) =>
    fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateAppointment: (id, data) =>
    fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  deleteAppointment: (id) =>
    fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
    }).then(handleResponse),

  // Beds
  getBeds: () => fetch(`${API_BASE}/beds`).then(handleResponse),
  updateBed: (id, data) =>
    fetch(`${API_BASE}/beds/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),

  // Pharmacy
  getMedicines: () => fetch(`${API_BASE}/pharmacy`).then(handleResponse),
  createMedicine: (data) =>
    fetch(`${API_BASE}/pharmacy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateMedicine: (id, data) =>
    fetch(`${API_BASE}/pharmacy/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  dispenseMedicine: (id, payload) =>
    fetch(`${API_BASE}/pharmacy/${id}/dispense`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),

  // Billing
  getInvoices: () => fetch(`${API_BASE}/billing`).then(handleResponse),
  getInvoiceById: (id) => fetch(`${API_BASE}/billing/${id}`).then(handleResponse),
  createInvoice: (data) =>
    fetch(`${API_BASE}/billing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
  updateInvoice: (id, data) =>
    fetch(`${API_BASE}/billing/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(handleResponse),
};
