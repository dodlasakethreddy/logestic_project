import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  UserCheck, 
  Clock, 
  Target, 
  Layers, 
  Database, 
  Cpu, 
  HelpCircle,
  AlertCircle 
} from 'lucide-react';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getModelMetrics } from '../services/api';

export default function ModelPerformance() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getModelMetrics();
      setMetrics(res);
    } catch (err) {
      console.error('Failed to load metrics:', err);
      setError(err.message || 'Failed to load model performance metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <LoadingSpinner message="Retrieving saved model evaluation artifacts..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[500px]">
        <ErrorMessage
          title="Model Metrics Not Found"
          message={`${error}\n\nMake sure backend/training/train.py has been executed to generate backend/models/metrics.joblib.`}
          onRetry={fetchMetrics}
        />
      </div>
    );
  }

  const cm = metrics?.confusion_matrix || [[0, 0], [0, 0]];
  const report = metrics?.classification_report || {};

  const precisionLeaves = metrics?.precision_leaves !== undefined ? metrics.precision_leaves : (report['Leaves (1)']?.precision || 0);
  const recallLeaves = metrics?.recall_leaves !== undefined ? metrics.recall_leaves : (report['Leaves (1)']?.recall || 0);
  const f1Leaves = metrics?.f1_leaves !== undefined ? metrics.f1_leaves : (report['Leaves (1)']?.['f1-score'] || 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Model Performance</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Evaluation metrics and validation results calculated on the held-out test dataset
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Accuracy"
          value={`${metrics?.accuracy_pct || ((metrics?.accuracy || 0) * 100).toFixed(2)}%`}
          subtitle="Overall test accuracy"
          icon={Eye}
          color="emerald"
        />
        <StatCard
          title="Precision (Leaves)"
          value={Number(precisionLeaves).toFixed(2)}
          subtitle="Positive predictive value"
          icon={UserCheck}
          color="blue"
        />
        <StatCard
          title="Recall (Leaves)"
          value={Number(recallLeaves).toFixed(2)}
          subtitle="Sensitivity on left employees"
          icon={Clock}
          color="purple"
        />
        <StatCard
          title="F1-Score (Leaves)"
          value={Number(f1Leaves).toFixed(2)}
          subtitle="Harmonic mean for attrition"
          icon={Target}
          color="orange"
        />
      </div>

      {/* Middle Section: Confusion Matrix & Classification Report */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Confusion Matrix</h2>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Test Set (N={metrics?.test_rows || 400})
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Comparing actual vs model predicted classes on unseen test samples.
            </p>

            {/* Visual 2x2 Matrix Grid */}
            <div className="max-w-xs mx-auto">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Header row */}
                <div></div>
                <div className="font-semibold text-slate-700 py-1">Pred: Stays (0)</div>
                <div className="font-semibold text-slate-700 py-1">Pred: Leaves (1)</div>

                {/* Actual Stays */}
                <div className="flex items-center justify-end font-semibold text-slate-700 pr-2">
                  Act: Stays (0)
                </div>
                <div className="bg-blue-600 text-white font-bold p-4 rounded-lg flex flex-col items-center justify-center shadow-xs">
                  <span className="text-lg">{cm[0]?.[0] ?? 0}</span>
                  <span className="text-[10px] font-normal opacity-80">True Negative</span>
                </div>
                <div className="bg-slate-100 text-slate-800 font-bold p-4 rounded-lg flex flex-col items-center justify-center border border-slate-200">
                  <span className="text-lg">{cm[0]?.[1] ?? 0}</span>
                  <span className="text-[10px] font-normal text-slate-500">False Positive</span>
                </div>

                {/* Actual Leaves */}
                <div className="flex items-center justify-end font-semibold text-slate-700 pr-2">
                  Act: Leaves (1)
                </div>
                <div className="bg-rose-50 text-rose-800 font-bold p-4 rounded-lg flex flex-col items-center justify-center border border-rose-200">
                  <span className="text-lg">{cm[1]?.[0] ?? 0}</span>
                  <span className="text-[10px] font-normal text-rose-600">False Negative</span>
                </div>
                <div className="bg-emerald-600 text-white font-bold p-4 rounded-lg flex flex-col items-center justify-center shadow-xs">
                  <span className="text-lg">{cm[1]?.[1] ?? 0}</span>
                  <span className="text-[10px] font-normal opacity-80">True Positive</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Darker cells represent correct predictions made by the Logistic Regression classifier.</span>
          </div>
        </div>

        {/* Classification Report Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">Classification Report</h2>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Stratified Split (80/20)
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Per-class breakdown of precision, recall, and harmonic F1 measure.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3 text-right">Precision</th>
                    <th className="py-2.5 px-3 text-right">Recall</th>
                    <th className="py-2.5 px-3 text-right">F1-Score</th>
                    <th className="py-2.5 px-3 text-right">Support</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Stays (0)</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['Stays (0)']?.precision || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['Stays (0)']?.recall || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['Stays (0)']?.['f1-score'] || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{report['Stays (0)']?.support || 0}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-rose-700">Leaves (1)</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-700">{(report['Leaves (1)']?.precision || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-700">{(report['Leaves (1)']?.recall || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-rose-700">{(report['Leaves (1)']?.['f1-score'] || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{report['Leaves (1)']?.support || 0}</td>
                  </tr>
                  <tr className="bg-slate-50/70 font-semibold text-slate-800">
                    <td className="py-2.5 px-3">Accuracy</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right">-</td>
                    <td className="py-2.5 px-3 text-right font-mono">{((metrics?.accuracy || 0)).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{metrics?.test_rows || 400}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 text-slate-600">
                    <td className="py-2.5 px-3">Macro Avg</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['macro avg']?.precision || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['macro avg']?.recall || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['macro avg']?.['f1-score'] || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{report['macro avg']?.support || 0}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 text-slate-600">
                    <td className="py-2.5 px-3">Weighted Avg</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['weighted avg']?.precision || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['weighted avg']?.recall || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{(report['weighted avg']?.['f1-score'] || 0).toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{report['weighted avg']?.support || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-amber-800">
              <strong>Class Imbalance Note:</strong> Since ~80% of employees stayed, high overall accuracy can be misleading. Monitoring the <em>Recall for Leaves</em> ensures the model flags at-risk employees rather than predicting everyone stays.
            </p>
          </div>
        </div>
      </div>

      {/* Dataset & Architecture Information Cards */}
      <div>
        <h2 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">
          Dataset & Pipeline Architecture
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Samples"
            value={metrics?.total_samples?.toLocaleString() || '2,000'}
            subtitle="Cleaned CSV rows"
            icon={Database}
            color="blue"
          />
          <StatCard
            title="Training Samples"
            value={metrics?.train_rows?.toLocaleString() || '1,600'}
            subtitle="80% Stratified Split"
            icon={Layers}
            color="indigo"
          />
          <StatCard
            title="Testing Samples"
            value={metrics?.test_rows?.toLocaleString() || '400'}
            subtitle="20% Held-out Evaluation"
            icon={Target}
            color="emerald"
          />
          <StatCard
            title="Features Processed"
            value={metrics?.feature_count?.toString() || '14'}
            subtitle="OneHotEncoded + Scaled"
            icon={Cpu}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}
