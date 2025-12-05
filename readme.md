# 🧭 CareerCompass

<div align="center">

![CareerCompass Logo](./frontend/public/image.png)

**Smart Career Recommendation And Upskilling Platform**

_An AI-powered platform providing personalized career guidance through intelligent roadmap generation and comprehensive resume analysis_

</div>

---

<div align="center">


### 💡 Meet the CareerCompass Team

<table>
  <tr>
    <td align="center" width="25%">
      <a href="https://github.com/kumawatkaran523">
        <img src="https://images.weserv.nl/?url=github.com/kumawatkaran523.png&h=100&w=100&fit=cover&mask=circle&maxage=7d" alt="Karan Kumawat"/>
      </a>
      <br />
      <h3>Karan Kumawat</h3>
    </td>
    <td align="center" width="25%">
      <a href="https://github.com/anunay07">
        <img src="https://images.weserv.nl/?url=github.com/anunay07.png&h=100&w=100&fit=cover&mask=circle&maxage=7d" alt="Anunay Tiwari"/>
      </a>
      <br />
      <h3>Anunay Tiwari</h3>
    </td>
    <td align="center" width="25%">
      <a href="https://github.com/rahulsyadav24">
        <img src="https://images.weserv.nl/?url=github.com/rahulsyadav24.png&h=100&w=100&fit=cover&mask=circle&maxage=7d" alt="Rahul Yadav"/>
      </a>
      <br />
      <h3>Rahul Yadav</h3>
    </td>
    <td align="center" width="25%">
      <a href="https://github.com/gauravraj11">
        <img src="https://images.weserv.nl/?url=github.com/gauravraj11.png&h=100&w=100&fit=cover&mask=circle&maxage=7d" alt="Gaurav Raj"/>
      </a>
      <br />
      <h3>Gaurav Raj</h3>
    </td>
  </tr>
</table>

</div>

## About CareerCompass

In today's fast-paced tech industry, students and professionals struggle to navigate countless career paths and stay relevant. We built CareerCompass as your personal AI-powered career advisor that understands both where you are and where you want to be.

### What We Offer

**Personalized Learning Roadmaps**  
Our AI creates week-by-week study plans tailored to your skills, available time, and career goals—no more generic recommendations.

**Intelligent Resume Analysis**  
Get genuine insights on ATS compatibility, skill gaps, and realistic salary expectations through our multi-model machine learning pipeline.

**Real Placement Insights**  
Access authentic interview experiences, company-specific questions, and salary data from real students and professionals.

**Progress Tracking**  
Stay motivated with visual tracking of your learning journey.

### The Problem We're Solving

Career planning today feels overwhelming. Endless online resources exist, but there's no clear guidance on what matters for your specific goals. Traditional counseling lacks personalization and real-time data.

### Our Approach

CareerCompass combines three powerful AI technologies—Google Gemini, spaCy, and Sentence-BERT—into one cohesive platform that offers both diagnosis (where you stand) and prescription (what to do next). Clear, actionable guidance backed by artificial intelligence and real student data.

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.0 (React 18)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.4
- **Authentication**: Clerk
- **Icons**: Lucide React
- **UI Components**: Radix UI

### Backend

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.0
- **Validation**: Zod

### ML Service

- **Language**: Python 3.9+
- **Framework**: FastAPI 0.104
- **NLP**: spaCy 3.7 (en_core_web_sm)
- **Embeddings**: Sentence-Transformers 2.2 (paraphrase-MiniLM-L3-v2)
- **LLM**: Google Gemini API 2.5
- **PDF Processing**: PyMuPDF (fitz) 1.23

---

## 🏗️ System Architecture

![alt text](./frontend/public/architecture.png)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **Python** 3.9 or higher ([Download](https://www.python.org/))
- **PostgreSQL** 15.x or higher ([Download](https://www.postgresql.org/))
- **Git** ([Download](https://git-scm.com/))
- **npm** or **yarn** (comes with Node.js)

### API Keys Required

- **Google Gemini API Key** - [Get it here](https://ai.google.dev/)
- **Clerk Account** - [Sign up here](https://clerk.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```sh
git clone https://github.com/kumawatkaran523/Career_Compass.git
cd Career_Compass
```

### 2. Setup Frontend

```sh
cd frontend
npm install
```

### 3. Create `.env`:

```sh
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here

# Backend URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# ML Service URL
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
```

### 4. Setup Backend

```sh
cd ../backend
npm install
```

### 5. Create `.env`:
```sh
#Database
DATABASE_URL="postgresql://username:password@localhost:5432/careercompass"
#Server
PORT=5000
NODE_ENV=development
#Clerk
CLERK_SECRET_KEY=sk_test_your_secret_here
#Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Setup Database
```sh
#Generate Prisma Client
npx prisma generate
#Run migrations
npx prisma migrate dev --name init

#(Optional) Seed database
npx prisma db seed
```

### 7. Setup ML Service
```sh
cd ../ml-service
python -m venv venv

#Activate virtual environment
#Windows:
venv\Scripts\activate
#macOS/Linux:
source venv/bin/activate
#Install dependencies
pip install -r requirements.txt
```

### 8. Create `.env`:
```sh
GEMINI_API_KEY=your_gemini_api_key_here
```
---

## 🎮 Usage

### Start All Services

You'll need **3 terminal windows**:

#### Terminal 1: Frontend (Port 3000)

```sh
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

#### Terminal 2: Backend (Port 5000)

```sh
cd backend
npm run dev
```

API available at [http://localhost:5000](http://localhost:5000)

#### Terminal 3: ML Service (Port 8000)

```sh
cd ml-service
source venv/bin/activate # or venv\Scripts\activate on Windows
python -m app.main
```
