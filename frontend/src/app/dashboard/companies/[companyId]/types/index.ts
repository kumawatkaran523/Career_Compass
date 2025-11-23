export interface Company {
    id: string;
    name: string;
    logo: string;
    industry: string;
    website: string;
    description: string;
    headquarters: string;
    employeeCount: string;
}

export interface CollegeInsights {
    totalExperiences: number;
    avgDifficulty: string;
    avgRating: number;
    avgSalary: number;
    successRate: number;
    lastVisit: string;
    commonRoles: string[];
    difficultyDistribution: Record<string, number>;
    outcomeDistribution: Record<string, number>;
}

export interface GlobalInsights {
    totalExperiences: number;
    avgDifficulty: string;
    avgRating: number;
    avgSalary: number;
}

export interface VisitHistory {
    year: number;
    visited: boolean;
    status: string;
    visitDate?: string;
    roles?: string[];
    studentsPlaced?: number;
    ctcRange?: string;
    reason?: string;
}

export interface Question {
    id: string;
    questionText: string;
    questionType: string;
    difficulty: string;
    round: string;
    topic: string;
    askedCount: number;
    upvotes: number;
    isCollege: boolean;
    link?: string;
}

export interface Experience {
    id: string;
    role: string;
    outcome: string;
    interviewDate: string;
    overallDifficulty: string;
    overallRating: number;
    reviewTitle: string;
    reviewSnippet: string;
    salaryOffered: number | null;
    user: {
        name: string;
        branch: string;
        graduationYear: number;
    };
    college: {
        name: string;
    };
    upvotes: number;
    isCollege: boolean;
}
