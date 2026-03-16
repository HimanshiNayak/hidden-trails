
# Hidden Trails India

Hidden Trails India is a full-stack tourism discovery platform that helps travelers explore both famous destinations and lesser-known hidden gems across India. The platform combines curated travel data stored in MongoDB with real-time information fetched from external travel APIs.

It aims to promote unexplored tourism locations while providing users with a simple and modern interface to discover destinations.

---

# Features

* Discover famous travel destinations across India
* Explore curated hidden gems stored in the database
* Search tourist attractions by city
* Fetch real-time location data using travel APIs
* Clean and responsive UI for easy exploration
* Scalable full-stack architecture

---

# Tech Stack

### Frontend

* Next.js
* React
* CSS / Tailwind

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### APIs

* OpenTripMap API
* Google Places API
* Geoapify API

---

# Project Architecture

```
Frontend (Next.js)
        ↓
Backend (Node.js + Express)
        ↓
MongoDB Atlas (Hidden Gems Data)
        ↓
External APIs
   ├── OpenTripMap
   ├── Google Places
   └── Geoapify
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/your-username/hidden-trails-india.git
```

Navigate into the project:

```bash
cd hidden-trails-india
```

---

# Backend Setup

```bash
cd tourism-backend
npm install
npm run dev
```

---

# Frontend Setup

```bash
cd tourism-frontend
npm install
npm run dev
```

Open in browser:

```
http://localhost:3000
```

---

# Environment Variables

Create a `.env` file in the backend with:

```
PORT=5001
MONGO_URI=your_mongodb_connection
GOOGLE_PLACES_API_KEY=your_key
OPENTRIPMAP_API_KEY=your_key
GEOAPIFY_API_KEY=your_key
```

---

# Future Improvements

* AI-powered travel itinerary planner
* Map-based exploration of destinations
* Hotel and accommodation suggestions
* Personalized travel recommendations

---

# Project Goal

The goal of Hidden Trails India is to promote sustainable tourism by helping travelers discover hidden destinations and support local communities.
