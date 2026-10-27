import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

export default function PredictionResult({ result }) {
  if (!result) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800 mb-1">Awaiting Prediction</h3>
        <p className="text-xs text-slate-500 max-w-xs">
          Fill in the employee details on the left and click "Predict Attrition" to calculate the likelihood of retention or attrition.
        </p>
      </div>
    );
  }

  const isLeaving = result.prediction === 1 || String(result.prediction_label).toLowerCase() === 'leaves';
  const prob = Number(result.attrition_probability) || 0;
  const pct = (prob * 100).toFixed(2);

  // Status color styles
  const statusTheme = isLeaving
    ? {
        bg: 'bg-rose-50 border-rose-200 text-rose-800',
        badge: 'bg-rose-600 text-white',
        icon: AlertTriangle,
        bar: 'bg-rose-500',
        title: 'Likely to Leave'
      }
    : {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        badge: 'bg-emerald-600 text-white',
        icon: CheckCircle2,
        bar: 'bg-emerald-500',
        title: 'Likely to Stay'
      };

  const StatusIcon = statusTheme.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Prediction Result</h2>
          <p className="text-xs text-slate-500">ML inference output via Logistic Regression</p>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Live Model
        </span>
      </div>

      {/* Primary outcome card */}
      <div className={`p-4 rounded-xl border ${statusTheme.bg} flex items-center gap-3.5`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${statusTheme.badge}`}>
          <StatusIcon className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider block opacity-75">
            Prediction
          </span>
          <h3 className="text-lg font-bold leading-tight">{statusTheme.title}</h3>
        </div>
      </div>

      {/* Probability bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700">Attrition Probability</span>
          <span className="font-bold text-slate-900 text-sm">{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${statusTheme.bar}`}
            style={{ width: `${Math.min(Math.max(prob * 100, 2), 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500">
          This means the model estimates a <strong className="text-slate-700">{pct}%</strong> chance that this employee may leave the company.
        </p>
      </div>

      {/* Input summary grid */}
      {result.input_summary && (
        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wide">
            Input Summary
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div>
              <span className="text-slate-400">Age: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.Age}</span>
            </div>
            <div>
              <span className="text-slate-400">Department: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.Department}</span>
            </div>
            <div>
              <span className="text-slate-400">Monthly Income: </span>
              <span className="font-semibold text-slate-800">${Number(result.input_summary.MonthlyIncome).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400">Job Level: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.JobLevel}</span>
            </div>
            <div>
              <span className="text-slate-400">Job Satisfaction: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.JobSatisfaction} / 4</span>
            </div>
            <div>
              <span className="text-slate-400">OverTime: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.OverTime}</span>
            </div>
            <div>
              <span className="text-slate-400">Years At Company: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.YearsAtCompany}</span>
            </div>
            <div>
              <span className="text-slate-400">Work Life Balance: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.WorkLifeBalance} / 4</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400">Distance From Home: </span>
              <span className="font-semibold text-slate-800">{result.input_summary.DistanceFromHome} km</span>
            </div>
          </div>
        </div>
      )}

      {/* Note alert */}
      <div className="bg-blue-50/70 border border-blue-200/60 rounded-lg p-3 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-blue-900">
          This is a machine learning model prediction and not a certainty. It should be used as a supporting tool for HR decision-making.
        </p>
      </div>
    </div>
  );
}
