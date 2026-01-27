"""
Production-Ready FastAPI Mental Health Classifier Server
Model: dsuram/distilbert-mentalhealth-classifier
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import pipeline
import uvicorn
import logging
from typing import List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Mental Health Classifier API",
    description="DistilBERT-based mental health text classification",
    version="1.0.0"
)

# Enable CORS for Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Node.js server URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global classifier variable
classifier = None


class TextInput(BaseModel):
    text: str = Field(..., min_length=1, description="Text to classify")


class PredictionOutput(BaseModel):
    label: str
    score: float


@app.on_event("startup")
async def load_model():
    """Load the model on startup"""
    global classifier
    try:
        logger.info("Loading DistilBERT mental health classifier...")
        classifier = pipeline(
            "text-classification",
            model="dsuram/distilbert-mentalhealth-classifier",
            return_all_scores=True
        )
        logger.info("✅ Model loaded successfully!")
    except Exception as e:
        logger.error(f"❌ Failed to load model: {e}")
        raise


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Mental Health Classifier API",
        "model": "dsuram/distilbert-mentalhealth-classifier",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "predict": "/predict",
            "docs": "/docs"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": "dsuram/distilbert-mentalhealth-classifier",
        "model_loaded": classifier is not None
    }


@app.post("/predict", response_model=List[PredictionOutput])
async def predict(input_data: TextInput):
    """
    Classify mental health-related text
    
    Args:
        input_data: TextInput with 'text' field
        
    Returns:
        List of predictions with labels and scores, sorted by score descending
    """
    if classifier is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please wait and try again."
        )
    
    if not input_data.text or not input_data.text.strip():
        raise HTTPException(
            status_code=400,
            detail="Text cannot be empty"
        )
    
    try:
        # Get predictions
        logger.info(f"Classifying text: {input_data.text[:50]}...")
        raw_results = classifier(input_data.text)
        
        # Handle different output formats
        if isinstance(raw_results, list) and len(raw_results) > 0:
            if isinstance(raw_results[0], list):
                # Format: [[{label, score}, ...]]
                results = raw_results[0]
            else:
                # Format: [{label, score}, ...]
                results = raw_results
        else:
            results = raw_results
        
        # Sort by score descending
        results = sorted(results, key=lambda x: x['score'], reverse=True)
        
        # Convert to response format
        predictions = [
            PredictionOutput(label=r['label'], score=r['score'])
            for r in results
        ]
        
        logger.info(f"Prediction: {predictions[0].label} ({predictions[0].score:.3f})")
        return predictions
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


if __name__ == "__main__":
    print("\n" + "="*60)
    print("🚀 Starting Mental Health Classifier API")
    print("="*60)
    print("\n📊 Endpoints:")
    print("   GET  /          - API info")
    print("   GET  /health    - Health check")
    print("   POST /predict   - Classify text")
    print("\n🔗 Server URL: http://localhost:8000")
    print("📖 API Docs: http://localhost:8000/docs")
    print("\n⏳ Loading model (this may take 30-60 seconds)...")
    print("="*60 + "\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
