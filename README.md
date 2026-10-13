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
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js       # Centralized REST API client
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Top navigation with live clock & role toggle
│   │   │   ├── Sidebar.jsx     # Navigation tabs & occupancy progress
│   │   │   ├── Modal.jsx       # Reusable accessible modal dialog
│   │   │   └── InvoiceReceiptModal.jsx # Official printable hospital receipt
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Analytics & KPI overview
│   │   │   ├── PatientsPage.jsx     # Patient directory & admissions
│   │   │   ├── DoctorsPage.jsx      # Specialists directory & duty status
│   │   │   ├── AppointmentsPage.jsx # Scheduling calendar & queues
│   │   │   ├── BedsPage.jsx         # Ward map & bed allocation
│   │   │   ├── PharmacyPage.jsx     # Drug inventory & dispensing
│   │   │   └── BillingPage.jsx      # Invoicing & claims management
│   │   ├── App.jsx             # Main application orchestrator
│   │   ├── index.css           # Tailwind CSS imports & print styles
│   │   └── main.jsx            # React root mount
│   ├── package.json
│   └── vite.config.js          # Vite config with API proxy
│
├── server/                     # Backend Express REST API
│   ├── data/
│   │   └── hospital_db.json    # File-backed database with initial sample data
│   ├── db.js                   # Database controller & activity logger
│   ├── server.js               # Express API endpoints & routes
│   └── package.json
│
├── .gitignore                  # Git ignore rules for node_modules & builds
├── package.json                # Root package for running client & server concurrently
└── README.md                   # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

### 1. Installation
Install all dependencies for root, server, and client:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Run in Development Mode
From the root directory, start both the backend server and frontend client simultaneously:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)

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

## 📤 Publishing to GitHub

Follow these steps to publish this repository to your GitHub account:

### Step 1: Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `medicare-hospital-management-system`).
3. Set visibility to **Public** or **Private**.
4. **Do NOT** initialize with a README, .gitignore, or license (we already created them).
5. Click **Create repository**.

### Step 2: Push your Local Code to GitHub
Open your terminal in the `MediCareHospital` directory and run:

```bash
# Initialize git (if not already done)
git init

# Stage all files
git add .

# Commit your initial code
git commit -m "feat: Initial commit of MediCare Hospital Management System"

# Rename current branch to main
git branch -M main

# Add your GitHub repository as remote origin (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/medicare-hospital-management-system.git

# Push code to GitHub
git push -u origin main
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
