# 🏥 MediCare - Hospital Management System (HMS)

> A modern, responsive, full-stack Hospital Management System built with **React**, **Tailwind CSS**, and **Node.js/Express**. Designed for streamlined clinical workflows, inpatient & outpatient management, doctor scheduling, ward bed allocations, pharmacy formulary tracking, and itemized medical billing with printable official receipts.

---

## 🌟 Key Features

### 1. 📊 Central Analytics & Executive Dashboard
- **Real-time KPI metrics**: Total patient count, bed occupancy percentage, collected revenue, queued appointments, on-duty doctors, and low-stock drug alerts.
- **Visual Trends**: Interactive charts showing monthly patient inflow, admissions, and financial growth.
- **Department Workload**: Real-time breakdown across Cardiology, Neurology, Orthopedics, Pulmonology, and Pediatrics.
- **Live Activity Feed**: Real-time audit trail of admissions, payments, appointments, and pharmacy dispensing.

### 2. 🧑‍⚕️ Patient Management & Triage
- **Inpatient & Outpatient Tracking**: Registration with full demographic details, blood group, emergency contact, and clinical diagnosis.
- **Clinical Vitals Ribbon**: Live vital tracking (Blood Pressure, Heart Rate, Temperature, SpO2).
- **Ward Bed Assignment**: Direct bed allocation during admission.
- **Discharge Workflow**: One-click discharge that automatically vacates the assigned bed and logs the activity.

### 3. 🩺 Medical Specialists & Staff Roster
- **Physician Directory**: Specialty credentials, qualifications, experience, consultation fees, and patient ratings.
- **Duty Roster**: Quick toggle between **On Duty** and **Off Duty**.
- **Clinic Schedules**: Clear consultation hours and direct email/phone contacts.

### 4. 📅 Appointment Scheduling & Queue Management
- **Booking Engine**: Schedule consultations by selecting patients, physicians, and visit type (Consultation, Routine Checkup, Follow-up, Emergency).
- **Status Lifecycle**: Filter and track appointments (`Scheduled`, `Completed`, `Cancelled`).
- **Clinical Notes**: Maintain reason for visit and special physician instructions.

### 5. 🛏️ Bed & Ward Occupancy Map
- **Visual Wards**: Real-time bed map covering **ICU**, **General Ward A**, **General Ward B**, and **Emergency Bays**.
- **Bed Status Indicators**: Color-coded indicators for *Available* (Emerald), *Occupied* (Rose), and *Maintenance* (Amber).
- **One-Click Actions**: Assign patients directly to empty beds or vacate beds upon patient discharge.

### 6. 💊 Pharmacy Store & Medication Formulary
- **Drug Catalog**: Brand name, generic formulation, therapeutic category, dosage, unit price, and expiration dates.
- **Stock Tracking & Alerts**: Automatic visual badges for *In Stock*, *Low Stock*, and *Out of Stock*.
- **Dispensing Station**: Dispense medications directly to inpatients or walk-in outpatients with instant inventory deduction.
- **Quick Restock**: Instant unit restocking dialog.

### 7. 🧾 Billing, Claims & Printable Official Invoices
- **Financial Analytics**: Total billed charges, cleared revenue, and pending collections.
- **Multi-Item Invoice Builder**: Itemized charges for consultations, lab tests, ICU/ward stays, and pharmacy prescriptions.
- **Printable Hospital Receipt**: Dedicated print view formatted with hospital letterhead, patient ID, breakdown table, taxes, discounts, and authorized signature. Supports printing (`Ctrl+P` / `Cmd+P`) and PDF export.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [CORS](https://www.npmjs.com/package/cors)
- **Database / Store**: Embedded JSON storage with auto-persistence (zero external database configuration required to get started)
- **Tooling**: Concurrently for single-command full-stack development

---

## 📁 Project Structure

```
MediCareHospital/
├── client/                  
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       
│   │   ├── components/
│   │   │   ├── Navbar.jsx     
│   │   │   ├── Sidebar.jsx    
│   │   │   ├── Modal.jsx      
│   │   │   └── InvoiceReceiptModal.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    
│   │   │   ├── PatientsPage.jsx   
│   │   │   ├── DoctorsPage.jsx     
│   │   │   ├── AppointmentsPage.jsx 
│   │   │   ├── BedsPage.jsx        
│   │   │   ├── PharmacyPage.jsx     
│   │   │   └── BillingPage.jsx    
│   │   ├── App.jsx            
│   │   ├── index.css           
│   │   └── main.jsx            
│   ├── package.json
│   └── vite.config.js         
│
├── server/                     
│   ├── data/
│   │   └── hospital_db.json    
│   ├── db.js                  
│   ├── server.js              
│   └── package.json
│
├── .gitignore                 
├── package.json                
└── README.md                   
```

---
---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/dashboard/stats` | Aggregated dashboard KPI stats & charts |
| `GET` | `/api/patients` | Retrieve all patients |
| `POST` | `/api/patients` | Register / admit a new patient |
| `PUT` | `/api/patients/:id` | Update patient records |
| `POST` | `/api/patients/:id/discharge` | Discharge patient and release bed |
| `DELETE` | `/api/patients/:id` | Delete patient record |
| `GET` | `/api/doctors` | Retrieve all doctors & medical staff |
| `POST` | `/api/doctors` | Add a new doctor profile |
| `PUT` | `/api/doctors/:id` | Update doctor details or duty status |
| `GET` | `/api/appointments` | Retrieve scheduled appointments |
| `POST` | `/api/appointments` | Book a new consultation appointment |
| `PUT` | `/api/appointments/:id` | Update appointment status |
| `GET` | `/api/beds` | Retrieve all ward beds & occupancy |
| `PUT` | `/api/beds/:id` | Assign patient or update bed status |
| `GET` | `/api/pharmacy` | Retrieve medicine inventory |
| `POST` | `/api/pharmacy` | Add new medicine to formulary |
| `POST` | `/api/pharmacy/:id/dispense` | Dispense medication to patient |
| `GET` | `/api/billing` | Retrieve all hospital invoices |
| `POST` | `/api/billing` | Generate a new itemized invoice |
| `PUT` | `/api/billing/:id` | Update invoice (e.g., mark as Paid) |

---


## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
