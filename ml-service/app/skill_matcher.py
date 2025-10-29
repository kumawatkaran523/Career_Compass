"""
Skill extraction using Sentence-BERT (Semantic matching)

This is NOT simple keyword matching!
It understands context and semantics.

Example:
- "experienced with React framework" → matches "React" skill
- "built apps using reactjs" → matches "React" skill
- "worked with spring" → matches "Spring" (not the season)
"""

from sentence_transformers import SentenceTransformer, util
import json
import torch
from typing import List
from app.models import Skill


# Load Sentence-BERT model (done once at startup)
# paraphrase-MiniLM-L3-v2 is chosen because:
# - Small size (60 MB)
# - Fast inference on CPU
# - Good accuracy for short texts
# - Works without GPU
print("📥 Loading Sentence-BERT model (paraphrase-MiniLM-L3-v2)...")
model = SentenceTransformer('paraphrase-MiniLM-L3-v2')
print("✓ Sentence-BERT model loaded successfully")


# Load skills database from JSON file
with open('skills_db.json', 'r') as f:
    SKILLS_DB = json.load(f)

print(f"📚 Loaded {len(SKILLS_DB)} skills from database")


# Pre-compute embeddings for all skills (done once)
# Embeddings are vector representations of text in high-dimensional space
# Similar meanings = similar vectors
print(f"🔢 Computing embeddings for {len(SKILLS_DB)} skills...")
skills_embeddings = model.encode(SKILLS_DB, convert_to_tensor=True)
print("✓ Skill embeddings ready!")


def extract_skills(resume_text: str, threshold: float = 0.55) -> List[Skill]:
    """
    Extract skills from resume using semantic similarity matching
    
    Process:
    1. Split resume into sentences/phrases (chunks)
    2. Convert each chunk to embedding vector
    3. Calculate cosine similarity with all skill embeddings
    4. Keep skills with similarity > threshold (0.55 = 55% match)
    5. Return top 25 skills sorted by confidence
    
    Args:
        resume_text: Full resume text
        threshold: Minimum similarity score (0.55 is balanced)
        
    Returns:
        List of Skill objects with confidence scores
    """
    
    # Split resume into meaningful chunks
    # Better than word-by-word because we need context
    sentences = []
    
    # Replace newlines with periods and split by periods
    temp_sentences = resume_text.replace('\n', '. ').split('. ')
    
    # Filter sentences: not too short, not too long
    for sent in temp_sentences:
        sent = sent.strip()
        # Keep sentences between 10 and 500 characters
        if len(sent) > 10 and len(sent) < 500:
            sentences.append(sent)
    
    # If no valid sentences found, return empty list
    if not sentences:
        print("⚠️  No valid text chunks found in resume")
        return []
    
    print(f"📝 Analyzing {len(sentences)} text sections from resume...")
    
    # Convert all resume sentences to embeddings
    # This is where the ML magic happens!
    resume_embeddings = model.encode(sentences, convert_to_tensor=True)
    
    # Dictionary to store matched skills (avoid duplicates)
    matched_skills = {}
    
    # Compare each resume sentence with all skills
    for idx, (sentence, sent_emb) in enumerate(zip(sentences, resume_embeddings)):
        
        # Calculate cosine similarity between sentence and all skills
        # Returns tensor of similarity scores (one per skill)
        similarities = util.cos_sim(sent_emb, skills_embeddings)[0]
        
        # Check each skill's similarity score
        for skill_idx, score in enumerate(similarities):
            score_value = float(score)  # Convert tensor to float
            
            # If similarity exceeds threshold, it's a match!
            if score_value > threshold:
                skill_name = SKILLS_DB[skill_idx]
                
                # Keep highest confidence match if skill already found
                if skill_name not in matched_skills or score_value > matched_skills[skill_name]["confidence"]:
                    matched_skills[skill_name] = {
                        "skill": skill_name,
                        "confidence": score_value,
                        "context": sentence[:150]  # First 150 chars of context
                    }
    
    # Convert dictionary to list of Skill objects
    skills_list = [Skill(**data) for data in matched_skills.values()]
    
    # Sort by confidence (highest first)
    skills_list.sort(key=lambda x: x.confidence, reverse=True)
    
    print(f"✓ Found {len(skills_list)} skills with confidence > {threshold}")
    
    # Return top 25 skills
    return skills_list[:25]
