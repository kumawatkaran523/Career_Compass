"""
Document parsing module
Extracts text from PDF and DOCX files
"""

import fitz  # PyMuPDF - for PDF parsing
import docx2txt  # For DOCX parsing
import io


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extract text from PDF using PyMuPDF library
    
    PyMuPDF (fitz) is chosen because:
    - Handles both text-based and scanned PDFs
    - Fast processing
    - Good Unicode support
    - Works with complex layouts
    
    Args:
        file_bytes: PDF file as bytes
        
    Returns:
        Extracted text as string
        
    Raises:
        Exception: If PDF parsing fails
    """
    try:
        # Open PDF from bytes (not from file path)
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        
        # Iterate through all pages
        for page_num, page in enumerate(doc):
            # Extract text from current page
            page_text = page.get_text()
            text += page_text + "\n"
        
        # Close document to free memory
        doc.close()
        
        return text.strip()
    
    except Exception as e:
        raise Exception(f"PDF parsing error: {str(e)}")


def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extract text from DOCX using docx2txt library
    
    docx2txt is simple and reliable for Word documents
    Handles tables, headers, footers automatically
    
    Args:
        file_bytes: DOCX file as bytes
        
    Returns:
        Extracted text as string
        
    Raises:
        Exception: If DOCX parsing fails
    """
    try:
        # docx2txt needs file-like object, not raw bytes
        file_stream = io.BytesIO(file_bytes)
        
        # Process DOCX and extract all text
        text = docx2txt.process(file_stream)
        
        return text.strip()
    
    except Exception as e:
        raise Exception(f"DOCX parsing error: {str(e)}")


def extract_resume_text(file_bytes: bytes, filename: str) -> str:
    """
    Main router function - decides which parser to use
    based on file extension
    
    Args:
        file_bytes: File content as bytes
        filename: Original filename with extension
        
    Returns:
        Extracted text
        
    Raises:
        ValueError: If file type is not supported
    """
    filename_lower = filename.lower()
    
    if filename_lower.endswith('.pdf'):
        return extract_text_from_pdf(file_bytes)
    
    elif filename_lower.endswith('.docx'):
        return extract_text_from_docx(file_bytes)
    
    else:
        raise ValueError(
            f"Unsupported file format: {filename}. "
            "Only PDF and DOCX are supported."
        )
