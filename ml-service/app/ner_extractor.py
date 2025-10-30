"""
Named Entity Recognition using spaCy
Extracts structured information from unstructured resume text
Filters out noise and validates extracted entities
"""

import spacy
import re
from typing import Dict, List
from app.models import ExtractedEntity

# Load spaCy English model (small, fast, CPU-friendly)
try:
    nlp = spacy.load("en_core_web_sm")
    print("✓ spaCy model loaded successfully")
except OSError:
    print("⚠  Downloading spaCy model...")
    import os
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")


def extract_email(text: str) -> str:
    """
    Extract email address using regex pattern
    
    Pattern matches: username@domain.com
    Handles dots, underscores, hyphens in username
    
    Args:
        text: Full resume text
        
    Returns:
        First email found, or None
    """
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text)
    return emails[0] if emails else None


def extract_phone(text: str) -> str:
    """
    Extract Indian phone number using regex
    
    Handles formats:
    - +91-9876543210
    - +919876543210
    - 9876543210
    
    Args:
        text: Full resume text
        
    Returns:
        First phone number found, or None
    """
    phone_patterns = [
        r'\+91[\-\s]?[6-9]\d{9}',  # +91-9876543210 or +91 9876543210
        r'\b[6-9]\d{9}\b',          # 9876543210
    ]
    
    for pattern in phone_patterns:
        phones = re.findall(pattern, text)
        if phones:
            return phones[0]
    
    return None


def is_valid_organization(org: str, email: str = None) -> bool:
    """
    Validate if extracted text is actually an organization
    
    Filters out:
    - Email addresses  
    - Generic section headers
    - Programs/fellowships/competitions (not actual orgs)
    - Common resume noise
    """
    org = org.strip()
    
    # Filter email-related text
    if '@' in org or '.com' in org.lower() or '.in' in org.lower():
        return False
    
    if email and org.lower() in email.lower():
        return False
    
    # Filter PROGRAMS, not organizations
    program_keywords = {
        'google summer', 'summer of code', 'gsoc',
        'mlh fellowship', 'github campus expert',
        'microsoft learn', 'hackathon', 'competition',
        'program', 'fellowship', 'internship program'
    }
    if any(keyword in org.lower() for keyword in program_keywords):
        return False
    
    # Filter generic section headers
    generic_terms = {
        'education', 'skills', 'experience', 'projects', 'work experience',
        'professional experience', 'technical skills', 'achievements',
        'certifications', 'summary', 'objective', 'references', 'profile',
        'contact', 'about', 'interests', 'hobbies', 'personal', 'work'
    }
    if org.lower() in generic_terms:
        return False
    
    # Filter too short
    if len(org) < 3:
        return False
    
    # Filter tech terms
    tech_noise = {'html', 'css', 'js', 'api', 'sql', 'aws', 'gcp', 'node', 'react'}
    if org.lower() in tech_noise:
        return False
    
    return True


def extract_entities(text: str) -> ExtractedEntity:
    """
    Extract all structured information using spaCy NER + regex
    
    Combines:
    1. spaCy NER for names, organizations, locations, dates
    2. Regex for email and phone (more reliable)
    3. Validation to filter out noise
    
    Args:
        text: Full resume text
        
    Returns:
        ExtractedEntity object with validated information
    """
    
    # Process text with spaCy NLP pipeline
    doc = nlp(text)
    
    # Initialize empty entity object
    entities = ExtractedEntity()
    
    # Extract email and phone first (needed for validation)
    entities.email = extract_email(text)
    entities.phone = extract_phone(text)
    
    # Use sets to avoid duplicates
    seen_orgs = set()
    seen_locs = set()
    seen_dates = set()
    
    # Iterate through all entities found by spaCy
    for ent in doc.ents:
        
        # Extract person name (candidate's name)
        # Only take first PERSON entity with full name (2+ words)
        if ent.label_ == "PERSON" and entities.name is None:
            name_parts = ent.text.split()
            if len(name_parts) >= 2:  # Ensure full name
                # Avoid common mistakes (e.g., "Google Summer")
                if not any(word.lower() in ['university', 'college', 'school', 'institute'] for word in name_parts):
                    entities.name = ent.text.strip()
        
        # Extract organizations with validation
        elif ent.label_ == "ORG":
            org = ent.text.strip()
            
            # Apply validation
            if org and is_valid_organization(org, entities.email):
                if org not in seen_orgs:
                    entities.organizations.append(org)
                    seen_orgs.add(org)
        
        # Extract locations (cities, states, countries)
        elif ent.label_ in ["GPE", "LOC"]:
            loc = ent.text.strip()
            
            # Filter out tech terms mistaken as locations
            tech_terms = {'linkedin', 'github', 'tailwindcss', 'nodejs', 'reactjs'}
            if loc and loc.lower() not in tech_terms:
                if loc not in seen_locs:
                    entities.locations.append(loc)
                    seen_locs.add(loc)
        
        # Extract dates (work duration, graduation)
        elif ent.label_ == "DATE":
            date = ent.text.strip()
            
            # Filter out noise dates
            if date and len(date) > 3:  # Skip "Q1", "FY", etc.
                # Skip generic words
                if not date.lower() in ['present', 'current', 'ongoing', 'now']:
                    if date not in seen_dates:
                        entities.dates.append(date)
                        seen_dates.add(date)
    
    # Limit results to avoid clutter
    entities.organizations = entities.organizations[:5]
    entities.locations = entities.locations[:3]
    entities.dates = entities.dates[:10]
    
    return entities