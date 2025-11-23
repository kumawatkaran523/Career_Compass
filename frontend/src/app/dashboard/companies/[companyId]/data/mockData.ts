import { Company, CollegeInsights, GlobalInsights, VisitHistory, Question, Experience } from '../types';

export const mockCompanyData = {
    company: {
        id: 'tcs',
        name: 'Tata Consultancy Services',
        logo: 'https://logo.clearbit.com/tcs.com',
        industry: 'IT Services',
        website: 'https://www.tcs.com',
        description: 'TCS is an IT services, consulting, and business solutions organization that has been partnering with many of the world\'s largest businesses in their transformation journeys for over 50 years.',
        headquarters: 'Mumbai, India',
        employeeCount: '500,000+',
    } as Company,
    collegeInsights: {
        totalExperiences: 12,
        avgDifficulty: 'MEDIUM',
        avgRating: 4.1,
        avgSalary: 3.8,
        successRate: 35.7,
        lastVisit: '2024-08-15',
        commonRoles: ['SDE', 'Business Analyst'],
        difficultyDistribution: { EASY: 2, MEDIUM: 7, HARD: 3 },
        outcomeDistribution: { SELECTED: 5, REJECTED: 6, WAITING: 1 },
    } as CollegeInsights,
    globalInsights: {
        totalExperiences: 234,
        avgDifficulty: 'MEDIUM',
        avgRating: 4.3,
        avgSalary: 4.2,
    } as GlobalInsights,
    visitHistory: [
        {
            year: 2025,
            visited: true,
            status: 'upcoming',
            visitDate: '2025-12-15',
            roles: ['SDE', 'Analyst'],
            studentsPlaced: null,
            ctcRange: '3.5-7 LPA'
        },
        {
            year: 2024,
            visited: true,
            status: 'completed',
            visitDate: '2024-08-15',
            roles: ['SDE', 'Business Analyst'],
            studentsPlaced: 12,
            ctcRange: '3.6-6.5 LPA'
        },
        {
            year: 2023,
            visited: true,
            status: 'completed',
            visitDate: '2023-09-10',
            roles: ['SDE', 'Consultant'],
            studentsPlaced: 15,
            ctcRange: '3.5-6 LPA'
        },
    ] as VisitHistory[],
};

export const mockQuestions: Question[] = [
    {
        id: '1',
        questionText: 'Implement LRU Cache with O(1) time complexity',
        questionType: 'CODING',
        difficulty: 'HARD',
        round: 'Round 2 - Technical',
        topic: 'Data Structures',
        askedCount: 8,
        upvotes: 25,
        isCollege: true,
        link: 'https://leetcode.com/problems/lru-cache/',
    },
    {
        id: '2',
        questionText: 'Find the longest substring without repeating characters',
        questionType: 'CODING',
        difficulty: 'MEDIUM',
        round: 'Round 1 - Online Test',
        topic: 'Strings',
        askedCount: 12,
        upvotes: 32,
        isCollege: true,
        link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    },
];

export const mockExperiences: Experience[] = [
    {
        id: '1',
        role: 'SDE',
        outcome: 'SELECTED',
        interviewDate: '2024-08-10',
        overallDifficulty: 'MEDIUM',
        overallRating: 4.5,
        reviewTitle: 'Smooth interview process with focus on DSA',
        reviewSnippet: 'The interview process was well-structured with three rounds...',
        salaryOffered: 3.6,
        user: { name: 'Anunay Tiwari', branch: 'CSE', graduationYear: 2022 },
        college: { name: 'JK Lakshmipat University' },
        upvotes: 15,
        isCollege: true,
    },
];
