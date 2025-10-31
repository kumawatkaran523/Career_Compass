career_coach/
│
├── frontend/                      # Next.js 15 Application
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── components/
│   │   │   ├── UserSync.tsx       # User synchronization component
│   │   │   └── Navbar.tsx         # Navigation component
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── careerPaths/
│   │   │   │   ├── page.tsx       # Roadmap generator
│   │   │   │   └── roadmapView/
│   │   │   │       └── [id]/
│   │   │   │           └── page.tsx
│   │   │   └── resume-analyze/
│   │   │       ├── page.tsx       # Upload interface
│   │   │       └── results/
│   │   │           └── page.tsx   # Analysis results
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── public/
│   ├── .env.local
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                       # Express.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controller.ts
│   │   │   ├── roadmap.controller.ts
│   │   │   └── resumeAnalysis.controller.ts
│   │   ├── services/
│   │   │   ├── user.service.ts
│   │   │   ├── roadmap.service.ts
│   │   │   └── resumeAnalysis.service.ts
│   │   ├── routes/
│   │   │   ├── user.routes.ts
│   │   │   ├── roadmap.routes.ts
│   │   │   └── analysis.routes.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── lib/
│   │   │   └── prisma.ts          # Prisma client
│   │   ├── utils/
│   │   │   └── response.util.ts
│   │   └── index.ts               # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/
│   ├── .env
│   └── package.json
│
└── ml_service/                    # FastAPI ML Service
    ├── main.py                    # FastAPI app
    ├── requirements.txt           # Python dependencies
    ├── .env
    └── models/                    # Downloaded pre-trained models
        └── en_core_web_sm/
