import pandas as pd
import numpy as np
import joblib
from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)

# --------------------------------------------------
# 1. Load dataset
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[1]

csv_path = (
    BASE_DIR
    / "data"
    / "employee_attrition_2000_10_columns (1).csv"
)

if not csv_path.exists():
    raise FileNotFoundError(f"Dataset not found at expected path: {csv_path}")

tr_data = pd.read_csv(csv_path)

print("Dataset shape:", tr_data.shape)
print("\nFirst five rows:")
print(tr_data.head())

# --------------------------------------------------
# 2. Clean and convert target labels
# --------------------------------------------------

# Remove rows where the target label is missing
tr_data = tr_data.dropna(subset=["Attrition"]).copy()

# Convert Yes/No labels to 1/0
tr_data["Attrition"] = tr_data["Attrition"].map({
    "Yes": 1,
    "No": 0
})

# Check for unexpected target values
if tr_data["Attrition"].isna().any():
    raise ValueError(
        "Attrition contains unexpected values. "
        "Expected only 'Yes' and 'No'."
    )

print("\nTarget distribution:")
print(tr_data["Attrition"].value_counts())

# --------------------------------------------------
# 3. Separate features (X) and target (y)
# --------------------------------------------------

X = tr_data.drop(columns=["Attrition"])
y = tr_data["Attrition"].astype(int)

num_cols = [
    "Age",
    "MonthlyIncome",
    "JobLevel",
    "JobSatisfaction",
    "YearsAtCompany",
    "WorkLifeBalance",
    "DistanceFromHome"
]

cat_cols = [
    "Department",
    "OverTime"
]

# --------------------------------------------------
# 4. Numerical preprocessing pipeline
# --------------------------------------------------

num_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaling", StandardScaler())
])

# --------------------------------------------------
# 5. Categorical preprocessing pipeline
# --------------------------------------------------

cat_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

# --------------------------------------------------
# 6. Combine with ColumnTransformer
# --------------------------------------------------

preprocessor = ColumnTransformer([
    ("num", num_pipeline, num_cols),
    ("cat", cat_pipeline, cat_cols)
])

# --------------------------------------------------
# 7. Split data BEFORE fitting preprocessing
# --------------------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print(f"\nTraining rows: {len(X_train)}")
print(f"Testing rows: {len(X_test)}")

# --------------------------------------------------
# 8. Fit preprocessing on training data only
# --------------------------------------------------

X_train_processed = preprocessor.fit_transform(X_train)
X_test_processed = preprocessor.transform(X_test)

print(f"\nProcessed training shape: {X_train_processed.shape}")
print(f"Processed testing shape: {X_test_processed.shape}")

# --------------------------------------------------
# 9. Create and train Logistic Regression
# --------------------------------------------------

model = LogisticRegression(max_iter=1000, random_state=42)
model.fit(X_train_processed, y_train)

print("\nModel training completed!")

# --------------------------------------------------
# 10. Make predictions and probabilities
# --------------------------------------------------

y_pred = model.predict(X_test_processed)
y_prob = model.predict_proba(X_test_processed)[:, 1]

# --------------------------------------------------
# 11. Evaluate model
# --------------------------------------------------

accuracy = float(accuracy_score(y_test, y_pred))
cm = confusion_matrix(y_test, y_pred).tolist()
report_dict = classification_report(
    y_test,
    y_pred,
    target_names=["Stays (0)", "Leaves (1)"],
    zero_division=0,
    output_dict=True
)

print("\n========== MODEL EVALUATION ==========")
print(f"Accuracy: {accuracy:.4f}")
print(f"Accuracy percentage: {accuracy * 100:.2f}%")
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))
print("\nClassification Report:")
print(classification_report(
    y_test,
    y_pred,
    target_names=["Stays (0)", "Leaves (1)"],
    zero_division=0
))

# --------------------------------------------------
# 12. Save model, preprocessor, and metrics
# --------------------------------------------------

model_dir = BASE_DIR / "models"
model_dir.mkdir(parents=True, exist_ok=True)

joblib.dump(model, model_dir / "attrition_model.joblib")
joblib.dump(preprocessor, model_dir / "preprocessor.joblib")

# Extract detailed class metrics
precision_leaves = float(report_dict.get("Leaves (1)", {}).get("precision", 0.0))
recall_leaves = float(report_dict.get("Leaves (1)", {}).get("recall", 0.0))
f1_leaves = float(report_dict.get("Leaves (1)", {}).get("f1-score", 0.0))

precision_stays = float(report_dict.get("Stays (0)", {}).get("precision", 0.0))
recall_stays = float(report_dict.get("Stays (0)", {}).get("recall", 0.0))
f1_stays = float(report_dict.get("Stays (0)", {}).get("f1-score", 0.0))

feature_names = [str(f) for f in preprocessor.get_feature_names_out()]

metrics = {
    "accuracy": round(accuracy, 4),
    "accuracy_pct": round(accuracy * 100, 2),
    "precision_leaves": round(precision_leaves, 4),
    "recall_leaves": round(recall_leaves, 4),
    "f1_leaves": round(f1_leaves, 4),
    "precision_stays": round(precision_stays, 4),
    "recall_stays": round(recall_stays, 4),
    "f1_stays": round(f1_stays, 4),
    "train_rows": len(X_train),
    "test_rows": len(X_test),
    "total_samples": len(tr_data),
    "feature_count": X_train_processed.shape[1],
    "feature_names": feature_names,
    "confusion_matrix": cm,
    "classification_report": report_dict,
    "algorithm": "Logistic Regression",
    "target_distribution": {
        "stays": int((y == 0).sum()),
        "leaves": int((y == 1).sum())
    }
}

joblib.dump(metrics, model_dir / "metrics.joblib")

print("\nModel saved to:", model_dir / "attrition_model.joblib")
print("Preprocessor saved to:", model_dir / "preprocessor.joblib")
print("Metrics saved to:", model_dir / "metrics.joblib")
