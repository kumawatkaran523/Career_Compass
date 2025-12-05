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
  <td align="center" width="33%">
      <a href="https://github.com/kumawatkaran523">
        <img src="https://images.weserv.nl/?url=github.com/kumawatkaran523.png&h=150&w=150&fit=cover&mask=circle&maxage=7d" alt="Karan Kumawat"/>
      </a>
      <br />
      <h3>Karan Kumawat</h3>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/anunay07">
        <img src="https://images.weserv.nl/?url=github.com/anunay07.png&h=150&w=150&fit=cover&mask=circle&maxage=7d" alt="Anunay Tiwari"/>
      </a>
      <br />
      <h3>Anunay Tiwari</h3>
      <br />
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/rahulsyadav24">
        <img src="https://images.weserv.nl/?url=github.com/rahulsyadav24.png&h=150&w=150&fit=cover&mask=circle&maxage=7d" alt="Rahul Yadav"/>
      </a>
      <br />
      <h3>Rahul Yadav</h3>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/gauravraj11">
                <img src="https://images.weserv.nl/?url=github.com/gauravraj11.png&h=150&w=150&fit=cover&mask=circle&maxage=7d" alt="Rahul Yadav"/>
      </a>
      <br />
      <h3>Gaurav Raj</h3>
    </td>
  </tr>
</table>
</div>

## 🎯 About CareerCompass

**CareerCompass** is an intelligent web-based platform designed to solve the critical challenge of career planning and skill development in the rapidly evolving technology landscape. It combines cutting-edge AI/ML technologies to provide:

- 🗺️ **Personalized Learning Roadmaps** - AI-generated, week-by-week study plans tailored to your goals
- 📄 **Intelligent Resume Analysis** - Multi-model ML pipeline providing ATS scores, skill gaps, and salary predictions
- 🏢 **Placement Insights** - Company-wise interview experiences and salary trends
- 📈 **Progress Tracking** - Monitor your learning journey with visual progress indicators

### Problem Statement

The absence of personalized, AI-driven career guidance tools that can simultaneously generate structured learning roadmaps and provide comprehensive resume analysis with actionable insights.

### Solution

CareerCompass integrates multiple pre-trained AI models (Google Gemini 2.5, spaCy NER, Sentence-BERT) in a unified platform, offering both diagnostic (resume analysis) and prescriptive (roadmap generation) career guidance.

---

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

#### Database

DATABASE_URL="postgresql://username:password@localhost:5432/careercompass"

#### Server

PORT=5000
NODE_ENV=development

#### Clerk

CLERK_SECRET_KEY=sk_test_your_secret_here

#### Google Gemini API

GEMINI_API_KEY=your_gemini_api_key_here

### 6. Setup Database

#### Generate Prisma Client

npx prisma generate

#### Run migrations

npx prisma migrate dev --name init

#### (Optional) Seed database

npx prisma db seed

### 7. Setup ML Service

cd ../ml-service
python -m venv venv

#### Activate virtual environment

#### Windows:

venv\Scripts\activate

#### macOS/Linux:

source venv/bin/activate

#### Install dependencies

pip install -r requirements.txt

### 8. Create `.env`:

GEMINI_API_KEY=your_gemini_api_key_here

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
