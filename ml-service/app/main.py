"""
FastAPI Main Server
This is the entry point for the ML service

Architecture:
- FastAPI handles HTTP requests
- CORS enabled for Next.js frontend communication
- Async processing for better performance
- Comprehensive error handling
- Detailed logging for debugging

Endpoints:
- GET / : Health check and service info
- POST /analyze-resume : Main resume analysis endpoint
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import time

# Import our custom modules
from app.parsers import extract_resume_text
from app.ner_extractor import extract_entities
from app.skill_matcher import extract_skills
from app.gemini_analyzer import analyze_with_gemini
from app.models import ResumeAnalysisResponse

# Initialize FastAPI application
app = FastAPI(
    title="Resume Analyzer ML Service",
    description="AI-powered resume analysis using spaCy, Sentence-BERT, and Google Gemini",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - Health check and service information"""
    return {
        "status": "healthy",
        "service": "Resume Analyzer ML Service",
        "version": "1.0.0",
        "technologies": {
            "pdf_parser": "PyMuPDF (fitz)",
            "docx_parser": "docx2txt",
            "ner": "spaCy en_core_web_sm",
            "skill_extraction": "Sentence-BERT (paraphrase-MiniLM-L3-v2)",
            "career_analysis": "Google Gemini 2.5 Flash Lite"  # FIXED
        },
        "endpoints": {
            "analyze": "/analyze-resume (POST)",
            "docs": "/docs",
            "health": "/"
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    health_status = {
        "status": "healthy",
        "checks": {}
    }
    
    # Check spaCy
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        health_status["checks"]["spacy"] = "✓ Loaded"
    except Exception as e:
        health_status["checks"]["spacy"] = f"✗ Error: {str(e)}"
        health_status["status"] = "degraded"
    
    # Check Sentence-BERT
    try:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
        health_status["checks"]["sentence_bert"] = "✓ Loaded"
    except Exception as e:
        health_status["checks"]["sentence_bert"] = f"✗ Error: {str(e)}"
        health_status["status"] = "degraded"
    
    # Check Gemini (FIXED for new SDK)
    try:
        from google import genai  # FIXED
        import os
        if os.getenv("GEMINI_API_KEY"):
            health_status["checks"]["gemini"] = "✓ API key configured"
        else:
            health_status["checks"]["gemini"] = "✗ API key missing"
            health_status["status"] = "degraded"
    except Exception as e:
        health_status["checks"]["gemini"] = f"✗ Error: {str(e)}"
        health_status["status"] = "degraded"
    
    return health_status

@app.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(file: UploadFile = File(...)):
    """
    Main endpoint: Analyze uploaded resume
    
    Process Flow:
    1. Extract text using PyMuPDF/docx2txt
    2. Extract entities using spaCy NER
    3. Extract skills using Sentence-BERT
    4. Analyze with Google Gemini
    5. Return comprehensive analysis
    """
    
    start_time = time.time()
    
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Only PDF and DOCX files are supported."
            )
        
        print(f"\n{'='*60}")
        print(f"📄 Processing Resume: {file.filename}")
        print(f"{'='*60}")
        
        # STEP 1: Read file
        print("\n[1/5] 📖 Reading uploaded file...")
        file_bytes = await file.read()
        file_size_mb = len(file_bytes) / (1024 * 1024)
        print(f"  ✓ File size: {file_size_mb:.2f} MB")
        print(f"  ✓ File type: {file.content_type}")
        
        # STEP 2: Extract text
        print("\n[2/5] 📝 Extracting text from document...")
        text = extract_resume_text(file_bytes, file.filename)
        text_length = len(text)
        word_count = len(text.split())
        print(f"  ✓ Extracted {text_length} characters")
        print(f"  ✓ Word count: {word_count}")
        
        if text_length < 100:
            raise HTTPException(
                status_code=400,
                detail="Resume text too short. Please upload a complete resume."
            )
        
        # STEP 3: Extract entities
        print("\n[3/5] 🔍 Extracting entities with spaCy NER...")
        entities = extract_entities(text)
        print(f"  ✓ Name: {entities.name or 'Not found'}")
        print(f"  ✓ Email: {entities.email or 'Not found'}")
        print(f"  ✓ Phone: {entities.phone or 'Not found'}")
        print(f"  ✓ Companies: {len(entities.organizations)} found")
        print(f"  ✓ Locations: {len(entities.locations)} found")
        
        # STEP 4: Extract skills
        print("\n[4/5] 🎯 Extracting skills with Sentence-BERT...")
        skills = extract_skills(text)
        print(f"  ✓ Found {len(skills)} skills")
        if skills:
            top_skills = [s.skill for s in skills[:5]]
            print(f"  ✓ Top 5 skills: {', '.join(top_skills)}")
        
        # STEP 5: Gemini analysis
        print("\n[5/5] 🤖 Analyzing with Google Gemini 2.5 Flash Lite...")
        gemini_analysis = analyze_with_gemini(
            resume_text=text,
            extracted_skills=[
                {"skill": s.skill, "confidence": s.confidence} 
                for s in skills
            ],
            entities=entities.model_dump()
        )
        print(f"  ✓ ATS Score: {gemini_analysis.ats_score}/100")
        if gemini_analysis.career_recommendations:
            top_role = gemini_analysis.career_recommendations[0].role
            top_score = gemini_analysis.career_recommendations[0].match_score
            print(f"  ✓ Top recommendation: {top_role} ({top_score}% match)")
        
        # Calculate processing time
        processing_time = round(time.time() - start_time, 2)
        print(f"\n{'='*60}")
        print(f"⏱️  Total processing time: {processing_time} seconds")
        print(f"{'='*60}\n")
        
        # Build response
        response = ResumeAnalysisResponse(
            status="success",
            processing_time=processing_time,
            extracted_info=entities,
            skills=skills,
            analysis=gemini_analysis,
            technologies_used={
                "pdf_parser": "PyMuPDF" if file.filename.endswith('.pdf') else "docx2txt",
                "ner": "spaCy en_core_web_sm v3.7.0",
                "skill_extraction": "Sentence-BERT paraphrase-MiniLM-L3-v2",
                "career_analysis": "Google Gemini 2.5 Flash Lite"  # FIXED
            }
        )
        
        return response
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"\n{'='*60}")
        print(f"❌ ERROR: {str(e)}")
        print(f"{'='*60}\n")
        
        raise HTTPException(
            status_code=500,
            detail=f"Resume analysis failed: {str(e)}"
        )

# Run server when executed directly
if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*70)
    print("🚀 Starting Resume Analyzer ML Service...")
    print("="*70)
    print("\n📍 Server will run at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("📖 Alternative docs: http://localhost:8000/redoc")
    print("\n💡 Press CTRL+C to stop the server\n")
    print("="*70 + "\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
