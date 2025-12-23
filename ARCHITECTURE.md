# Healthcare Management System - Architecture & Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                         │
│              (http://localhost:5173)                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │ (Axios)
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    REACT FRONTEND                           │
│                  (Port 5173 - Vite)                         │
├─────────────────────────────────────────────────────────────┤
│ App.jsx (Main Component)                                    │
│  ├── Header                                                 │
│  ├── Navigation (4 Tabs)                                    │
│  ├── Content Area                                           │
│  │   ├── PatientForm.jsx                                    │
│  │   ├── PatientList.jsx                                    │
│  │   ├── AppointmentForm.jsx                                │
│  │   └── AppointmentList.jsx                                │
│  ├── Services                                               │
│  │   └── apiService.js (Axios Client)                       │
│  └── Footer                                                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │ API Calls (JSON)
                             │ GET /patients
                             │ POST /patients
                             │ GET /appointments
                             │ POST /appointments
                             │
┌────────────────────────────▼────────────────────────────────┐
│                   EXPRESS.JS BACKEND                        │
│                  (Port 3001)                                │
├─────────────────────────────────────────────────────────────┤
│ Server.ts                                                   │
│  ├── /patients (GET, POST)                                  │
│  │   └── patientRoutes.ts                                   │
│  │       ├── getAllPatients()                               │
│  │       └── createPatient()                                │
│  │                                                          │
│  ├── /appointments (GET, POST)                              │
│  │   └── appointmentRoutes.ts                               │
│  │       ├── getAllAppointments()                           │
│  │       └── createAppointment()                            │
│  │                                                          │
│  └── Data Storage                                           │
│      └── Store.ts (In-memory database)                      │
│          ├── patients[] array                               │
│          └── appointments[] array                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

### Patient Registration Flow

```
User fills form
     │
     ▼
PatientForm validates input
     │
     ├─► If invalid: Show error
     │
     └─► If valid: POST /patients
            │
            ▼
         Express Backend
            │
            ├─► Store in memory
            │
            ├─► Generate ID
            │
            └─► Return success
                   │
                   ▼
              Frontend shows success
                   │
                   ▼
              PatientList refreshes
                   │
                   ▼
              GET /patients
                   │
                   ▼
              Display updated table
```

### Appointment Booking Flow

```
AppointmentForm loads
     │
     ├─► GET /patients (fill dropdown)
     │
User selects patient
     │
     ▼
User enters date & reason
     │
     ▼
Form validates
     │
     ├─► If invalid: Show error
     │
     └─► If valid: POST /appointments
            │
            ▼
         Express Backend
            │
            ├─► Check if patient exists
            │
            ├─► If not found: Return 404
            │
            └─► If found: Create appointment
                   │
                   └─► Return success
                       │
                       ▼
                  Frontend shows success
                       │
                       ▼
              AppointmentList refreshes
                       │
                       ├─► GET /appointments
                       │
                       └─► GET /patients
                           │
                           ▼
                    Join data & display
```

---

## Component Communication

```
┌─────────────────────────────────────┐
│           App Component             │
│  - activeTab state                  │
│  - patientRefresh trigger           │
│  - appointmentRefresh trigger       │
└─────────────────────────────────────┘
           │       │       │       │
     ┌─────┘       │       │       └─────┐
     │             │       │             │
     ▼             ▼       ▼             ▼
┌──────────┐  ┌──────────┐  ┌────────────┐  ┌──────────────┐
│Patient   │  │Patient   │  │Appointment │  │Appointment   │
│Form      │  │List      │  │Form        │  │List          │
│          │  │          │  │            │  │              │
│onPatient │  │refresh   │  │onAppointm  │  │refresh       │
│Added()   │  │Trigger   │  │Booked()    │  │Trigger       │
└──────────┘  └──────────┘  └────────────┘  └──────────────┘
     │             │             │             │
     └─────────────┴─────────────┴─────────────┘
                   │
                   ▼
            ┌─────────────────┐
            │ API Service     │
            │ (apiService.js) │
            └────────┬────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Express Backend      │
         │  (Port 3001)          │
         └───────────────────────┘
```

---

## State Management Flow

```
App Component State
│
├── activeTab: "patient-register" | "patient-list" | "appointment-form" | "appointment-list"
│
├── patientRefresh: number (incremented to trigger refresh)
│   │
│   └─► PatientList useEffect dependency
│        └─► fetchPatients()
│            └─► GET /patients
│
└── appointmentRefresh: number (incremented to trigger refresh)
    │
    └─► AppointmentList useEffect dependency
         └─► fetchData()
             ├─► GET /appointments
             └─► GET /patients
```

---

## Data Model Structure

```
Backend Storage (Store.ts)
│
├── patients Array
│   └─ Patient {
│       pId: number (auto-increment)
│       name: string
│       gender: string
│       age: number
│       email: string
│       add: string (address)
│   }
│
└── appointments Array
    └─ Appointment {
        aId: number (auto-increment)
        pId: number (Foreign Key → Patient.pId)
        date: string (ISO datetime)
        reason: string
    }
```

---

## HTTP Request/Response Examples

### Register Patient

```
REQUEST:
POST /patients HTTP/1.1
Content-Type: application/json

{
  "name": "John Doe",
  "gender": "Male",
  "age": 30,
  "email": "john@example.com",
  "add": "123 Main St"
}

RESPONSE:
200 OK
{
  "pId": 1,
  "name": "John Doe",
  "gender": "Male",
  "age": 30,
  "email": "john@example.com",
  "add": "123 Main St"
}
```

### Get All Patients

```
REQUEST:
GET /patients HTTP/1.1

RESPONSE:
200 OK
[
  {
    "pId": 1,
    "name": "John Doe",
    "gender": "Male",
    "age": 30,
    "email": "john@example.com",
    "add": "123 Main St"
  },
  ...
]
```

### Book Appointment

```
REQUEST:
POST /appointments HTTP/1.1
Content-Type: application/json

{
  "pId": 1,
  "date": "2025-12-24T10:30:00",
  "reason": "Regular Checkup"
}

RESPONSE:
200 OK
{
  "status": 200,
  "respond": "Appoinment created sucessfully"
}

OR (if patient not found):
200 OK
{
  "status": 404,
  "respond": "Patient Not Found"
}
```

### Get All Appointments

```
REQUEST:
GET /appointments HTTP/1.1

RESPONSE:
200 OK
[
  {
    "aId": 1,
    "pId": 1,
    "date": "2025-12-24T10:30:00",
    "reason": "Regular Checkup"
  },
  ...
]
```

---

## User Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   USER WORKFLOW                             │
└─────────────────────────────────────────────────────────────┘

START
  │
  ▼
1️⃣ OPEN APP (http://localhost:5173)
  │
  ├─► See 4 buttons: Register | View | Book | View
  │
  ▼
2️⃣ REGISTER PATIENT
  │
  ├─► Click "Register Patient"
  │
  ├─► Fill form (Name, Gender, Age, Email, Address)
  │
  ├─► Click "Register Patient" button
  │
  └─► See success message ✅
      │
      └─► Auto-refresh happens internally
  │
  ▼
3️⃣ VIEW PATIENTS
  │
  ├─► Click "View Patients"
  │
  └─► See table with all registered patients
  │
  ▼
4️⃣ BOOK APPOINTMENT
  │
  ├─► Click "Book Appointment"
  │
  ├─► Select patient from dropdown
  │
  ├─► Pick date and time
  │
  ├─► Enter reason for visit
  │
  ├─► Click "Book Appointment"
  │
  └─► See success message ✅
  │
  ▼
5️⃣ VIEW APPOINTMENTS
  │
  ├─► Click "View Appointments"
  │
  └─► See table with appointments and patient names
  │
  ▼
END
```

---

## Technology Stack

```
FRONTEND STACK
├── React 19.2.0
│   └── Hooks (useState, useEffect)
├── JavaScript (ES6+)
├── Axios (HTTP Client)
├── CSS3 (Styling)
└── Vite (Build Tool)

BACKEND STACK
├── Express.js 5.2.1
├── TypeScript 5.9.3
├── Node.js
└── In-Memory Storage (Arrays)
```

---

## Performance Considerations

```
Frontend Optimizations:
├── Component-level state management
├── Conditional rendering
├── Efficient event handlers
├── CSS transitions for smooth UX
└── Error boundary patterns

Backend Optimizations:
├── Middleware for JSON parsing
├── Route-based organization
├── Error handling
├── In-memory array operations (fast)
└── Data validation
```

---

## Error Handling Flow

```
User Action
    │
    ▼
Form Validation
    │
    ├─► Invalid: Show error message ❌
    │
    └─► Valid: Submit to backend
        │
        ▼
    Backend Processing
        │
        ├─► Error: Return error response
        │   │
        │   └─► Frontend shows error ❌
        │
        └─► Success: Return success response
            │
            └─► Frontend shows success ✅
                │
                └─► Data refreshes automatically
```

---
