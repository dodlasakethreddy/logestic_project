# Employee Attrition Prediction & HR Analytics System

A comprehensive, full-stack Enterprise HR Analytics and Machine Learning web application designed to help organizations analyze workforce patterns, evaluate employee retention factors, and predict individual employee attrition risk using trained Machine Learning models.

![Dashboard Preview](file:///C:/Users/saketh%20reddy/.gemini/antigravity-ide/brain/54577071-6e8b-4003-a8ec-8f4408e90164/dashboard_page_1793131706476.png)

---

## 1. Project Overview

Employee turnover can impose substantial costs on organizations through recruitment expenses, loss of institutional knowledge, and operational disruption. This system provides human resource professionals, executives, and department leads with an end-to-end analytical platform:

1. **Executive Dashboard**: Delivers key workforce metrics (total headcount, attrition rates, average tenure, compensation, and satisfaction) alongside multi-dimensional visual distribution breakdowns.
2. **Workforce Directory**: A searchable, filterable, and paginated employee directory that enables HR teams to review historical workforce records.
3. **Interactive Prediction Suite**: An inference interface powered by a trained **Logistic Regression** model and fitted scikit-learn preprocessing pipeline, providing probability estimates and risk categories.
4. **Model Performance Hub**: Genuine, transparent evaluation statistics calculated on held-out test data (accuracy, precision, recall, F1-score, confusion matrix, and classification report) acknowledging real-world class imbalance.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Recharts, Lucide React, Axios / Fetch API |
| **Backend (Node.js)** | Node.js (v20+), Express.js, CORS, Dotenv, CSV-Parser |
| **Machine Learning API** | Python (3.10+ / 3.14), FastAPI, Uvicorn, Pydantic v2 |
| **Data Science & ML** | pandas, NumPy, scikit-learn (ColumnTransformer, StandardScaler, OneHotEncoder, LogisticRegression), joblib |

---

## 3. Architecture Diagram

```
+---------------------------------------------------------------------------------------+
|                                    React + Vite Frontend                              |
|   (Dashboard, Employees Directory, Attrition Predictor, Model Performance Hub)        |
|                                       Port: 5173                                      |
+-------------------------------------------+-------------------------------------------+
                                            |
                                 HTTP / JSON REST API calls
                                            v
+---------------------------------------------------------------------------------------+
|                                  Node.js + Express API                                |
|  - Aggregates CSV metrics for Dashboard                                               |
|  - Manages Search, Multi-Filter, Sorting & Pagination for Employees                   |
|  - Proxies inference requests & schema validation                                     |
|                                       Port: 5000                                      |
+-----------------------+-----------------------------------+---------------------------+
                        |                                   |
         Direct File Read                           HTTP / REST Proxy
                        v                                   v
+-------------------------------+   +---------------------------------------------------+
|       Data Warehouse          |   |                 Python FastAPI Service            |
| employee_attrition_2000.csv   |   |  - Loads saved preprocessor & Logistic Regression |
|                               |   |  - Executes preprocessor.transform()              |
|                               |   |  - Computes model.predict_proba()                 |
|                               |   |  - Serves genuine test evaluation metrics         |
|                               |   |                    Port: 8000                     |
+-------------------------------+   +---------------------------------------------------+
                                                            |
                                               Reads Saved Artifacts
                                                            v
                                            +-------------------------------+
                                            |         backend/models/       |
                                            |  - attrition_model.joblib     |
                                            |  - preprocessor.joblib        |
                                            |  - metrics.joblib             |
                                            +-------------------------------+
```

---

## 4. Repository Structure

```text
employee_attrition_prediction/
├── backend/
│   ├── backend-node/                 # Express.js REST API
│   │   ├── routes/
│   │   │   ├── dashboard.js          # Aggregated KPI and chart metrics
│   │   │   ├── employees.js          # Search, pagination, filter endpoints
│   │   │   ├── metrics.js            # Proxy to ML model metrics
│   │   │   └── predict.js            # Validation and ML prediction proxy
│   │   ├── .env                      # Node environment variables (PORT=5000)
│   │   ├── package.json
│   │   └── server.js                 # Express server bootstrap
│   ├── data/
│   │   └── employee_attrition_2000_10_columns (1).csv  # 2,000 workforce records
│   ├── ml-api/                       # Python FastAPI prediction service
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── main.py               # FastAPI endpoints (/health, /predict, /metrics)
│   │   │   └── schemas.py            # Pydantic schemas and input validators
│   │   ├── .env                      # Python API environment variables (PORT=8000)
│   │   └── requirements.txt
│   ├── models/                       # Serialized machine learning artifacts
│   │   ├── attrition_model.joblib    # Trained Logistic Regression model
│   │   ├── preprocessor.joblib       # Fitted ColumnTransformer (scaling & encoding)
│   │   └── metrics.joblib            # Genuine evaluation metrics from test split
│   └── training/
│       └── train.py                  # Reproducible ML training pipeline
├── frontend/                         # React 18 + Vite SPA
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── AttritionChart.jsx    # Donut chart for attrition proportion
│   │   │   ├── ChartCard.jsx         # Card container for charts
│   │   │   ├── DepartmentChart.jsx   # Grouped bar chart by department
│   │   │   ├── EmployeeTable.jsx     # Sortable table with status badges
│   │   │   ├── ErrorMessage.jsx      # Recoverable error alert component
│   │   │   ├── FilterPanel.jsx       # Multi-select dropdown and search bar
│   │   │   ├── LoadingSpinner.jsx    # Animated loading spinner
│   │   │   ├── Navbar.jsx            # Top bar with user profile & search
│   │   │   ├── Pagination.jsx        # Smart pagination controls
│   │   │   ├── PredictionForm.jsx    # Validated 9-feature input form
│   │   │   ├── PredictionResult.jsx  # Probability bar and risk breakdown
│   │   │   ├── SearchBar.jsx         # Search input component
│   │   │   ├── Sidebar.jsx           # Enterprise navy navigation drawer
│   │   │   └── StatCard.jsx          # KPI metric cards
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Executive analytics view
│   │   │   ├── Employees.jsx         # Workforce directory view
│   │   │   ├── ModelPerformance.jsx  # Accuracy, confusion matrix, report
│   │   │   └── Prediction.jsx        # Live inference test view
│   │   ├── services/
│   │   │   └── api.js                # Centralized API service functions
│   │   ├── App.jsx                   # Router layout
│   │   ├── index.css                 # Tailwind directives & design tokens
│   │   └── main.jsx                  # React DOM mount point
│   ├── .env                          # Frontend API base URL (VITE_API_BASE_URL)
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 5. Dataset Specifications

The system utilizes the dataset stored at `backend/data/employee_attrition_2000_10_columns (1).csv`:

- **Total Records**: 2,000 employees
- **Target Feature**: `Attrition` (`Yes` or `No`)
- **Features Used for Prediction (9 total)**:
  1. `Age` (Numerical: 18 - 100)
  2. `Department` (Categorical: Finance, Human Resources, IT, Research & Development, Sales)
  3. `MonthlyIncome` (Numerical: positive currency value)
  4. `JobLevel` (Ordinal: 1 to 5)
  5. `JobSatisfaction` (Ordinal: 1 to 4)
  6. `OverTime` (Categorical: 'Yes' or 'No')
  7. `YearsAtCompany` (Numerical: 0 to 60)
  8. `WorkLifeBalance` (Ordinal: 1 to 4)
  9. `DistanceFromHome` (Numerical: 0 to 200 km)

---

## 6. Installation & Setup (Windows PowerShell)

### Prerequisites
- **Node.js**: v18.0.0 or higher (`node -v`)
- **Python**: v3.10 or higher (`python --version`)
- **Git**

### Step 1: Clone or Navigate to the Workspace
```powershell
cd "c:\Users\saketh reddy\OneDrive\Desktop\ML\employee_attrition_prediction"
```

### Step 2: Set Up Python Dependencies & Train Model
```powershell
# Install Python packages
pip install -r backend/ml-api/requirements.txt

# Run model training pipeline to generate artifacts in backend/models/
python backend/training/train.py
```

### Step 3: Set Up Node.js Backend
```powershell
cd backend/backend-node
npm install
cd ../..
```

### Step 4: Set Up React Frontend
```powershell
cd frontend
npm install
cd ..
```

---

## 7. Starting the Services

Open three separate Windows PowerShell windows or run each service in the background:

### Terminal 1: Python ML API (FastAPI)
```powershell
cd "c:\Users\saketh reddy\OneDrive\Desktop\ML\employee_attrition_prediction\backend\ml-api"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Health Check*: `http://127.0.0.1:8000/health`  
*API Docs*: `http://127.0.0.1:8000/docs`

### Terminal 2: Node.js Backend API (Express)
```powershell
cd "c:\Users\saketh reddy\OneDrive\Desktop\ML\employee_attrition_prediction\backend\backend-node"
npm start
```
*Health Check*: `http://localhost:5000/api/health`

### Terminal 3: React Frontend (Vite)
```powershell
cd "c:\Users\saketh reddy\OneDrive\Desktop\ML\employee_attrition_prediction\frontend"
npm run dev
```
*Application Access*: Open `http://localhost:5173/` in your browser.

---

## 8. API Endpoint Documentation

### Node.js Backend (`http://localhost:5000`)

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & ML API connection check | None |
| `GET` | `/api/dashboard` | Aggregated KPIs and distribution data | None |
| `GET` | `/api/employees` | Searchable, filtered, paginated employee records | `limit`, `offset`, `department`, `attrition`, `overtime`, `search`, `sortBy`, `sortOrder` |
| `GET` | `/api/metrics` | Fetches saved model performance metrics | None |
| `POST` | `/api/predict` | Validates features and proxies to Python ML API | JSON with 9 employee features |

### Prediction Request Example:
```json
POST /api/predict
Content-Type: application/json

{
  "Age": 35,
  "Department": "Sales",
  "MonthlyIncome": 5000,
  "JobLevel": 2,
  "JobSatisfaction": 3,
  "OverTime": "Yes",
  "YearsAtCompany": 5,
  "WorkLifeBalance": 3,
  "DistanceFromHome": 10
}
```

### Prediction Response Example:
```json
{
  "prediction": 0,
  "prediction_label": "Stays",
  "attrition_probability": 0.2432,
  "attrition_percentage": "24.32%",
  "risk_level": "Low",
  "input_summary": {
    "Age": 35,
    "Department": "Sales",
    "MonthlyIncome": 5000,
    "JobLevel": 2,
    "JobSatisfaction": 3,
    "OverTime": "Yes",
    "YearsAtCompany": 5,
    "WorkLifeBalance": 3,
    "DistanceFromHome": 10
  },
  "disclaimer": "This prediction is a probabilistic estimate generated by a machine learning model. It should be used as a decision-support aid and never as the sole basis for employment decisions."
}
```

---

## 9. Machine Learning Training & Evaluation Details

- **Algorithm**: Logistic Regression (`max_iter=1000`, `random_state=42`)
- **Preprocessing Pipeline**:
  - `num_cols`: SimpleImputer (`median`) -> `StandardScaler`
  - `cat_cols`: SimpleImputer (`most_frequent`) -> `OneHotEncoder(handle_unknown="ignore")`
  - Encapsulated within `ColumnTransformer`
- **Data Splitting**: Stratified 80/20 train/test split (1,600 training samples, 400 test samples).
- **Evaluation on Held-Out Test Set**:
  - **Accuracy**: 80.50%
  - **Precision (Leaves)**: 0.50
  - **Recall (Leaves)**: 0.09
  - **F1-Score (Leaves)**: 0.15
  - **Confusion Matrix**:
    - True Negatives (Stays): 315
    - False Positives: 7
    - False Negatives: 71
    - True Positives (Leaves): 7

### Understanding Class Imbalance
In the dataset, approximately 80.5% (1,610) of employees remained with the company, while 19.5% (390) left. Because of this natural class imbalance, high raw accuracy can be deceptive. The application highlights **Recall for Leaves** to emphasize that the model acts as an exploratory triage tool rather than a deterministic judge.

---

## 10. Deployment Guidelines

### 1. Frontend (Static Hosting - Vercel / Netlify / Cloudflare Pages)
- Run `npm run build` inside `frontend/` to produce the optimized production bundle in `frontend/dist/`.
- Configure `VITE_API_BASE_URL` to point to the production Node.js API domain (e.g., `https://api.yourdomain.com`).

### 2. Node.js Express API (Node Host - Render / Railway / AWS EC2)
- Configure environment variables:
  ```env
  PORT=5000
  FRONTEND_URL=https://your-frontend-domain.com
  ML_API_URL=https://your-ml-api-domain.com
  ```
- Command to run: `npm start`

### 3. Python ML API (Python Host - Render / Railway / Google Cloud Run / AWS ECS)
- Include `backend/models/` artifacts alongside the application image.
- Set environment variables:
  ```env
  PORT=8000
  HOST=0.0.0.0
  ```
- Start command:
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port 8000
  ```

---

## 11. Ethical Considerations & Limitations

- **Probabilistic Support Only**: Attrition predictions indicate statistical correlation based on historical data. They must never be used as the unilateral basis for compensation, promotion, termination, or hiring decisions.
- **Data Representation**: If specific demographic segments are underrepresented in the dataset, predictions may reflect historical biases.
- **Privacy Assurance**: No private identifiable personal information (PII) is displayed or exported.
#   l o g e s t i c _ p r o j e c t  
 