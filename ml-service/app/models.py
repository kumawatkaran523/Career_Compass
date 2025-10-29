"""
Pydantic models for request/response validation
These ensure type safety and automatic API documentation
"""

from pydantic import BaseModel
from typing import List, Optional, Dict


class ExtractedEntity(BaseModel):
    """
    Structured information extracted from resume using spaCy NER
    """
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    organizations: List[str] = []
    locations: List[str] = []
    dates: List[str] = []


class Skill(BaseModel):
    """
    Single skill extracted using Sentence-BERT semantic matching
    """
    skill: str                  # Skill name (e.g., "Python")
    confidence: float           # Similarity score (0.0 to 1.0)
    context: str               # Where in resume it was found


class CareerRecommendation(BaseModel):
    """
    Single career path recommendation from Gemini
    """
    role: str                  # Job title (e.g., "Full Stack Developer")
    match_score: int           # How well skills match (0-100)
    reasoning: str             # Why this role fits


class SalaryPrediction(BaseModel):
    """
    Salary range prediction for recommended roles
    """
    min: int                   # Minimum salary
    max: int                   # Maximum salary
    currency: str = "INR"      # Currency (default Indian Rupees)


class GeminiAnalysis(BaseModel):
    """
    Complete analysis from Google Gemini 1.5 Flash
    Renamed from GPTAnalysis to reflect we're using Gemini
    """
    career_recommendations: List[CareerRecommendation]
    ats_score: int
    ats_feedback: str
    missing_skills: List[str]
    quick_wins: List[str]
    salary_prediction: SalaryPrediction
    summary: str


class ResumeAnalysisResponse(BaseModel):
    """
    Final API response containing all analysis results
    """
    status: str
    processing_time: float
    extracted_info: ExtractedEntity
    skills: List[Skill]
    analysis: GeminiAnalysis      # Changed from GPTAnalysis
    technologies_used: Dict[str, str]
