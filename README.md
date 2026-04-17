# 🏰 FreshBooking
> **India's Premium Real Estate Platform**  
> Discover luxurious properties across India's most sought-after locations. Buy, sell, or rent with confidence.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Python](https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python)
![MongoDB](https://img.shields.io/badge/MongoDB-GridFS-47A248?style=for-the-badge&logo=mongodb)

---

## ✨ Key Features

- **🌐 Advanced Quick Filtering:** Single-click chips mapping to dynamic backend filters (Buy, Rent, New Launches, Commercials, Plots).
- **🏙️ Popular Cities Exploration:** Image-rich visual discovery of properties segmented natively by cities (Mumbai, Bangalore, Delhi, Pune, etc).
- **🧮 Smart EMI Calculator:** Fully working UI component for predicting monthly installments with breakdown sliders.
- **🖼️ Native GridFS Image Storage:** Properties load their images natively from MongoDB GridFS through backend streaming.
- **💎 Royal Aesthetic Setup:** Cohesive custom CSS Modules enforcing a strict Royal Blue (`#1B3A6B`) and Gold (`#C9A84C`) aesthetic.

---

## 🏗️ Architecture & Tech Stack

### Frontend Architecture (`/frontend`)
- **Framework:** Next.js 14 (App Router)
- **Styling:** CSS Modules (`page.module.css` scoped styles)
- **State:** React Hooks & URL Search Params synchronization.
- **Images:** Dynamic serving fetched from backend or local public assets.

### Backend Architecture (`/backend`)
- **Server Environment:** Python (FastAPI/Flask)
- **Database:** MongoDB (`freshbooking` cluster)
- **Storage:** PyMongo `GridFS` configuration for handling native BLOB images (slider photos & cover graphics).
- **Tooling:** Automated `seed.py` payload generation script for populating city properties.

---

## 🚀 Quick Start / Installation

### Prerequisites
Make sure you have installed on your local environment:
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Database Server (running locally at `mongodb://localhost:27017` or through your specified URI configuration).

### 1. Database Setup / Seed Population
You can dynamically populate your database with dummy properties for 6 major Indian cities using the native seeder:
```bash
cd backend
python -m venv venv
# Activate the venv (Windows):
.\venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
# Run the DB seed (30 Random diverse properties)
python seed.py 
```

### 2. Backend API Runtime
Ensure your web server router is running:
```bash
cd backend
# Run your standard server
python run.py
```

### 3. Frontend Next.js Client
In a separate terminal, launch the web client:
```bash
cd frontend
npm install
npm run dev
```

Your premium Real Estate platform will inherently become available at [http://localhost:3000](http://localhost:3000)!

---

## 🛣️ Roadmap & Next Milestones

- [x] Initial UI Layout Strategy
- [x] Integrate Global Navigation and Footer 
- [x] Connect City Quick Filers and Backend Endpoint
- [x] Premium CSS Module Restructuring & Image Cards
- [ ] Admin Control Panel implementation
- [ ] User authentication logic wrapping (Sign-in/Sign-up)

---

## 🔒 Security Note
Ensure standard `.env` configuration keys (like MongoDB URI connections or hashing tokens) are kept out of this Git tree. The platform is designed strictly securely isolating backend routes.
