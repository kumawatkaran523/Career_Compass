-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('ON_CAMPUS', 'OFF_CAMPUS', 'REFERRAL');

-- CreateEnum
CREATE TYPE "OutcomeType" AS ENUM ('SELECTED', 'REJECTED', 'WAITING');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('CODING', 'TECHNICAL', 'BEHAVIORAL', 'APTITUDE', 'HR', 'SYSTEM_DESIGN');

-- CreateEnum
CREATE TYPE "VisitStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "collegeId" TEXT,
ADD COLUMN     "graduationYear" INTEGER;

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "industry" TEXT NOT NULL,
    "description" TEXT,
    "headquarters" TEXT,
    "employeeCount" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyExperience" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "interviewType" "InterviewType" NOT NULL,
    "interviewDate" TIMESTAMP(3) NOT NULL,
    "outcome" "OutcomeType" NOT NULL,
    "rounds" JSONB NOT NULL,
    "salaryOffered" DOUBLE PRECISION,
    "joiningBonus" DOUBLE PRECISION,
    "otherBenefits" TEXT,
    "overallDifficulty" "DifficultyLevel" NOT NULL,
    "overallRating" DOUBLE PRECISION NOT NULL,
    "reviewTitle" TEXT NOT NULL,
    "reviewText" TEXT NOT NULL,
    "applicationProcess" TEXT,
    "preparationTips" TEXT,
    "interviewerBehavior" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperienceVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceId" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PopularQuestion" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "collegeId" TEXT,
    "userId" TEXT,
    "questionText" TEXT NOT NULL,
    "questionType" "QuestionType" NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "round" TEXT NOT NULL,
    "topic" TEXT,
    "sampleAnswer" TEXT,
    "approach" TEXT,
    "questionLink" TEXT,
    "askedCount" INTEGER NOT NULL DEFAULT 1,
    "lastAskedDate" TIMESTAMP(3),
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopularQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyVisit" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL,
    "academicYear" TEXT NOT NULL,
    "rolesOffered" TEXT[],
    "ctcRange" TEXT NOT NULL,
    "eligibilityCriteria" JSONB NOT NULL,
    "totalApplied" INTEGER,
    "totalShortlisted" INTEGER,
    "totalSelected" INTEGER,
    "status" "VisitStatus" NOT NULL,
    "registrationOpen" BOOLEAN NOT NULL DEFAULT false,
    "registrationDeadline" TIMESTAMP(3),
    "jobDescription" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyVisit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_name_key" ON "College"("name");

-- CreateIndex
CREATE INDEX "College_name_idx" ON "College"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_industry_idx" ON "Company"("industry");

-- CreateIndex
CREATE INDEX "CompanyExperience_companyId_idx" ON "CompanyExperience"("companyId");

-- CreateIndex
CREATE INDEX "CompanyExperience_collegeId_idx" ON "CompanyExperience"("collegeId");

-- CreateIndex
CREATE INDEX "CompanyExperience_userId_idx" ON "CompanyExperience"("userId");

-- CreateIndex
CREATE INDEX "CompanyExperience_interviewType_outcome_idx" ON "CompanyExperience"("interviewType", "outcome");

-- CreateIndex
CREATE INDEX "CompanyExperience_interviewDate_idx" ON "CompanyExperience"("interviewDate");

-- CreateIndex
CREATE INDEX "CompanyExperience_createdAt_idx" ON "CompanyExperience"("createdAt");

-- CreateIndex
CREATE INDEX "ExperienceVote_experienceId_idx" ON "ExperienceVote"("experienceId");

-- CreateIndex
CREATE INDEX "ExperienceVote_userId_idx" ON "ExperienceVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceVote_userId_experienceId_key" ON "ExperienceVote"("userId", "experienceId");

-- CreateIndex
CREATE INDEX "PopularQuestion_companyId_collegeId_idx" ON "PopularQuestion"("companyId", "collegeId");

-- CreateIndex
CREATE INDEX "PopularQuestion_questionType_difficulty_idx" ON "PopularQuestion"("questionType", "difficulty");

-- CreateIndex
CREATE INDEX "PopularQuestion_topic_idx" ON "PopularQuestion"("topic");

-- CreateIndex
CREATE INDEX "QuestionVote_questionId_idx" ON "QuestionVote"("questionId");

-- CreateIndex
CREATE INDEX "QuestionVote_userId_idx" ON "QuestionVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionVote_userId_questionId_key" ON "QuestionVote"("userId", "questionId");

-- CreateIndex
CREATE INDEX "CompanyVisit_collegeId_companyId_idx" ON "CompanyVisit"("collegeId", "companyId");

-- CreateIndex
CREATE INDEX "CompanyVisit_visitDate_status_idx" ON "CompanyVisit"("visitDate", "status");

-- CreateIndex
CREATE INDEX "CompanyVisit_academicYear_idx" ON "CompanyVisit"("academicYear");

-- CreateIndex
CREATE INDEX "CompanyVisit_status_idx" ON "CompanyVisit"("status");

-- CreateIndex
CREATE INDEX "User_collegeId_idx" ON "User"("collegeId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyExperience" ADD CONSTRAINT "CompanyExperience_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyExperience" ADD CONSTRAINT "CompanyExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyExperience" ADD CONSTRAINT "CompanyExperience_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceVote" ADD CONSTRAINT "ExperienceVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperienceVote" ADD CONSTRAINT "ExperienceVote_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "CompanyExperience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PopularQuestion" ADD CONSTRAINT "PopularQuestion_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PopularQuestion" ADD CONSTRAINT "PopularQuestion_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PopularQuestion" ADD CONSTRAINT "PopularQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionVote" ADD CONSTRAINT "QuestionVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionVote" ADD CONSTRAINT "QuestionVote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PopularQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyVisit" ADD CONSTRAINT "CompanyVisit_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyVisit" ADD CONSTRAINT "CompanyVisit_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
