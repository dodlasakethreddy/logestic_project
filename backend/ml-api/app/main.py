import os
from pathlib import Path
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from .schemas import PredictionRequest, PredictionResponse, HealthResponse

app = FastAPI(
    title="Employee Attrition Prediction ML API",
    description="FastAPI service for predicting employee attrition and retrieving model evaluation metrics",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve model artifact paths
BASE_DIR = Path(__file__).resolve().parents[2]
MODELS_DIR = BASE_DIR / "models"

MODEL_PATH = MODELS_DIR / "attrition_model.joblib"
PREPROCESSOR_PATH = MODELS_DIR / "preprocessor.joblib"
METRICS_PATH = MODELS_DIR / "metrics.joblib"

# Global references for loaded artifacts
model = None
preprocessor = None
cached_metrics = None

def load_artifacts():
    global model, preprocessor, cached_metrics
    try:
        if MODEL_PATH.exists():
            model = joblib.load(MODEL_PATH)
        else:
            model = None

        if PREPROCESSOR_PATH.exists():
            preprocessor = joblib.load(PREPROCESSOR_PATH)
        else:
            preprocessor = None

        if METRICS_PATH.exists():
            cached_metrics = joblib.load(METRICS_PATH)
        else:
            cached_metrics = None
    except Exception as e:
        print(f"Error loading model artifacts: {e}")

# Load artifacts upon startup
load_artifacts()

@app.on_event("startup")
async def on_startup():
    load_artifacts()

@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint reporting API and model readiness."""
    artifacts_ready = model is not None and preprocessor is not None
    return HealthResponse(
        status="healthy" if artifacts_ready else "degraded",
        service="Employee Attrition Prediction ML API",
        model_loaded=artifacts_ready,
        version="1.0.0"
    )

@app.get("/metrics")
def get_metrics() -> Dict[str, Any]:
    """Retrieve genuine evaluation metrics saved from held-out test data."""
    global cached_metrics
    if cached_metrics is None and METRICS_PATH.exists():
        cached_metrics = joblib.load(METRICS_PATH)

    if cached_metrics is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Model metrics not found. Please run the training script first."
        )
    return cached_metrics

@app.post("/predict", response_model=PredictionResponse)
def predict_attrition(payload: PredictionRequest):
    """
    Predict whether an employee is likely to stay or leave using the trained Logistic Regression model.
    Transforms features with the fitted ColumnTransformer preprocessor.
    """
    global model, preprocessor

    # Ensure artifacts are loaded
    if model is None or preprocessor is None:
        load_artifacts()

    if model is None or preprocessor is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Machine learning model or preprocessor artifact is not available. Please ensure model training has been completed."
        )

    try:
        # Construct DataFrame maintaining exact feature order
        feature_order = [
            "Age",
            "Department",
            "MonthlyIncome",
            "JobLevel",
            "JobSatisfaction",
            "OverTime",
            "YearsAtCompany",
            "WorkLifeBalance",
            "DistanceFromHome"
        ]

        data_dict = {
            "Age": [payload.Age],
            "Department": [payload.Department],
            "MonthlyIncome": [payload.MonthlyIncome],
            "JobLevel": [payload.JobLevel],
            "JobSatisfaction": [payload.JobSatisfaction],
            "OverTime": [payload.OverTime],
            "YearsAtCompany": [payload.YearsAtCompany],
            "WorkLifeBalance": [payload.WorkLifeBalance],
            "DistanceFromHome": [payload.DistanceFromHome]
        }

        input_df = pd.DataFrame(data_dict, columns=feature_order)

        # Transform features using the fitted preprocessor
        transformed_features = preprocessor.transform(input_df)

        # Generate model prediction and probability
        raw_pred = int(model.predict(transformed_features)[0])
        probabilities = model.predict_proba(transformed_features)[0]
        attrition_prob = float(probabilities[1])

        # Determine label and risk tier
        prediction_label = "Leaves" if raw_pred == 1 else "Stays"

        if attrition_prob >= 0.60:
            risk_level = "High"
        elif attrition_prob >= 0.35:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        formatted_pct = f"{attrition_prob * 100:.2f}%"

        input_summary = {
            "Age": payload.Age,
            "Department": payload.Department,
            "MonthlyIncome": payload.MonthlyIncome,
            "JobLevel": payload.JobLevel,
            "JobSatisfaction": payload.JobSatisfaction,
            "OverTime": payload.OverTime,
            "YearsAtCompany": payload.YearsAtCompany,
            "WorkLifeBalance": payload.WorkLifeBalance,
            "DistanceFromHome": payload.DistanceFromHome
        }

        return PredictionResponse(
            prediction=raw_pred,
            prediction_label=prediction_label,
            attrition_probability=round(attrition_prob, 4),
            attrition_percentage=formatted_pct,
            risk_level=risk_level,
            input_summary=input_summary
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error during prediction: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "127.0.0.1")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
