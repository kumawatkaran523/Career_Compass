"""
Named Entity Recognition using spaCy
Extracts structured information from unstructured resume text
"""

import spacy
import re
from typing import Dict, List
from app.models import ExtractedEntity


# Load spaCy English model (small, fast, CPU-friendly)
# This model is pre-trained on web text and can identify:
# - PERSON: Names
# - ORG: Organizations/Companies  
# - GPE/LOC: Locations
# - DATE: Dates
try:
    nlp = spacy.load("en_core_web_sm")
    print("✓ spaCy model loaded successfully")
except OSError:
    print("Downloading spaCy model...")
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
    
    Indian numbers: Start with 6-9, followed by 9 digits
    
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


def extract_entities(text: str) -> ExtractedEntity:
    """
    Extract all structured information using spaCy NER + regex
    
    This combines:
    1. spaCy NER for names, organizations, locations, dates
    2. Regex for email and phone (more reliable than NER)
    
    Args:
        text: Full resume text
        
    Returns:
        ExtractedEntity object with all found information
    """
    
    # Process text with spaCy NLP pipeline
    # This tokenizes, tags parts of speech, and identifies entities
    doc = nlp(text)
    
    # Initialize empty entity object
    entities = ExtractedEntity()
    
    # Extract email and phone using regex (more accurate than NER)
    entities.email = extract_email(text)
    entities.phone = extract_phone(text)
    
    # Use sets to avoid duplicates
    seen_orgs = set()
    seen_locs = set()
    
    # Iterate through all entities found by spaCy
    for ent in doc.ents:
        
        # Extract person name (usually candidate's name)
        # Only take first PERSON entity with full name (2+ words)
        if ent.label_ == "PERSON" and entities.name is None:
            if len(ent.text.split()) >= 2:  # Ensure it's a full name
                entities.name = ent.text
        
        # Extract organizations (companies, universities)
        elif ent.label_ == "ORG":
            org = ent.text.strip()
            if org and org not in seen_orgs:
                entities.organizations.append(org)
                seen_orgs.add(org)
        
        # Extract locations (cities, countries)
        elif ent.label_ in ["GPE", "LOC"]:
            loc = ent.text.strip()
            if loc and loc not in seen_locs:
                entities.locations.append(loc)
                seen_locs.add(loc)
        
        # Extract dates (work duration, graduation dates)
        elif ent.label_ == "DATE":
            date = ent.text.strip()
            if date and len(date) > 3:  # Filter out noise like "Q1", "FY"
                entities.dates.append(date)
    
    # Limit results to avoid clutter
    entities.organizations = entities.organizations[:5]  # Top 5 companies
    entities.locations = entities.locations[:3]          # Top 3 locations
    entities.dates = entities.dates[:10]                 # Top 10 dates
    
    return entities
