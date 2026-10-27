import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import ErrorMessage from '../components/ErrorMessage';
import { predictAttrition } from '../services/api';

export default function Prediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (employeeData) => {
    try {
      setLoading(true);
      setError(null);
      const predictionResponse = await predictAttrition(employeeData);
      setResult(predictionResponse);
    } catch (err) {
      console.error('Prediction failed:', err);
      setError(err.message || 'Error occurred during model inference');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Employee Attrition Prediction
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Enter employee attributes to evaluate retention risk and predict likelihood of departure using Machine Learning
        </p>
      </div>

      {/* Error banner if inference fails */}
      {error && (
        <ErrorMessage
          title="Prediction Request Failed"
          message={`${error}\n\nEnsure that the Python ML API (FastAPI) is running on port 8000 and the Node.js server is proxying requests.`}
          onRetry={null}
        />
      )}

      {/* 2-Column responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        </div>
        <div className="lg:col-span-5">
          <PredictionResult result={result} />
        </div>
      </div>
    </div>
  );
}
