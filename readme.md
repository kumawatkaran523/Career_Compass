career-platform/
├── frontend/                          # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/
│   │   │   │   │   └── [[...sign-in]]/page.tsx
│   │   │   │   └── sign-up/
│   │   │   │       └── [[...sign-up]]/page.tsx
│   │   │   ├── (dashboard)/          # Authenticated area
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── resume/page.tsx
│   │   │   │   ├── recommendations/page.tsx
│   │   │   │   ├── assessments/page.tsx
│   │   │   │   └── upskilling/page.tsx
│   │   │   ├── api/webhooks/clerk/route.ts  # Clerk webhook endpoint
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/               # UI + layout
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── layout/               # Navbar, Sidebar
│   │   │   └── dashboard/            # Stats cards, widgets
│   │   ├── lib/
│   │   │   ├── prisma.ts              # Prisma client
│   │   │   ├── redis.ts               # Redis client
│   │   │   └── utils.ts
│   │   └── types/
│   │       └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── public/
│   │   └── images/
│   ├── .env.local
│   ├── middleware.ts                  # Clerk middleware
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
└── backend/                           # Node.js API + Python NLP
    ├── api/                           # Express backend
    │   ├── routes/
    │   │   ├── user.js
    │   │   ├── quiz.js
    │   │   └── recommendation.js
    │   ├── controllers/
    │   │   ├── userController.js
    │   │   ├── quizController.js
    │   │   └── recommendationController.js
    │   ├── services/
    │   │   ├── nlpService.js         # Call Python FastAPI
    │   │   └── redisService.js
    │   ├── config/
    │   │   ├── db.js                 # Prisma / Neon setup
    │   │   ├── redis.js              # Redis setup
    │   │   └── env.js
    │   ├── index.js                  # Express entry point
    │   ├── .env
    │   └── package.json
    │
    └── nlp-service/                   # Python FastAPI NLP microservice
        ├── main.py                    # FastAPI app
        ├── services/
        │   ├── resume_parser.py
        │   └── skill_matcher.py
        ├── models/                    # Pre-trained models
        ├── requirements.txt
        └── Dockerfile