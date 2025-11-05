# Social Welfare Index (SWI) — Student Activity Tracker

The **Social Welfare Index (SWI)** is a full-stack web application that helps universities and students track extracurricular and social welfare activities.  
Each student has a personalized dashboard showing their activities, points, and a computed Social Welfare Index (SWI) out of 100.

---

## Features

 **Secure Authentication**
- Student signup and login system.
- Only students with emails ending in `@rtu.ac.in` can register.
- Passwords securely hashed using `werkzeug.security`.

 **Student Dashboard**
- Displays all student activities in a beautiful responsive UI.
- Shows profile card with name, roll number, mobile, and total stats.
- Calculates Social Welfare Index (SWI) based on participation & points.

 **Add New Activity**
- Students can add new activities (Social, Technical, Sports, Cultural, NCC).
- Upload certificate proofs (image or PDF).
- Activities are auto-marked as “Pending”.

 **Upcoming Events**
- Sidebar showing upcoming college or club events.

 **Modern UI**
- React + Tailwind CSS frontend for a clean, dynamic interface.

---

##  SWI (Social Welfare Index) Formula

The Social Welfare Index (SWI) measures a student’s engagement and contribution in social activities.

\[
SWI = 100 \times (0.5 \times \frac{P_s}{P_t} + 0.25 \times \frac{V_s}{N_s} + 0.15 \times D + 0.1 \times \frac{N_s}{N_t})
\]

Where:
- \( P_s \): Points from social activities  
- \( P_t \): Total points  
- \( V_s \): Verified social activities  
- \( N_s \): Total social activities  
- \( N_t \): Total activities  
- \( D \): Diversity score (unique categories / total categories)

---

##  Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Tailwind CSS |
| **Backend** | Flask (Python) |
| **Database** | SQLite (via SQLAlchemy) |
| **Auth & Security** | werkzeug.security (hashed passwords) |
| **Styling** | Tailwind CSS |
| **API Communication** | REST (fetch / Axios) |
| **File Uploads** | Flask File Upload handling |

---
##  Installation & Setup

###  Prerequisites
Make sure you have installed:
- Python 3.10+
- React.js
- npm or yarn
- Git

---

###  Backend Setup (Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # (on Windows)
source venv/bin/activate  # (on macOS/Linux)

pip install -r requirements.txt
python seed.py   # (optional) add sample student
python app.py
```
### Frontend Setup (React)
```bash
cd frontend
npm install
npm start ```
