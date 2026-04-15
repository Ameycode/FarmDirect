# FarmDirect 🌱

A zero-budget, modern, mobile-first hyperlocal marketplace connecting local farmers directly with buyers. Reduces middleman markups and guarantees fresh produce.

## 🛠️ Technology Stack
- **Frontend**: Next.js 14 (App Router), TailwindCSS, React Query, Zustand, LeafletJS.
- **Backend**: Django 5, Django REST Framework, SimpleJWT Auth, SQLite (PostgreSQL/PostGIS ready).
- **Authentication**: Phone-based (prepared for Firebase OTP).

## 🚀 Quick Setup Guide

### 1. Backend (Django)
Open a new terminal and run:

```bash
cd f:\market\backend

# 1. Install dependencies
pip install -r requirements.txt

# 2. Run migrations
python manage.py migrate

# 3. Seed the database with sample farmers and products
python seed.py

# 4. Start the development server
python manage.py runserver 8000
```
*The backend API will run on http://localhost:8000*

### 2. Frontend (Next.js)
Open a second terminal and run:

```bash
cd f:\market\frontend

# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```
*The web app will run on http://localhost:3000*

## 📱 Testing the App
1. Go to `http://localhost:3000`
2. Click **Join Now** or **Get Started**
3. Log in using the seeded test buyer account:
   - Phone `1234567890`
4. Or log in as a seeded Farmer account:
   - Phone `+919876543210` (Ramesh Patil)
   - Phone `+919765432100` (Sunita Deshmukh)
   - Phone `+918765432100` (Arjun Shinde)

