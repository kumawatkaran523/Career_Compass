FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies for PyMuPDF and compilation
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    make \
    libmupdf-dev \
    libfreetype6-dev \
    libjpeg-dev \
    libopenjp2-7-dev \
    libjbig2dec0-dev \
    libharfbuzz-dev \
    swig \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for Docker layer caching)
COPY requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Download spaCy model via pip
RUN pip install --no-cache-dir https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.7.1/en_core_web_sm-3.7.1-py3-none-any.whl

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start command - FIXED FOR YOUR STRUCTURE
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
