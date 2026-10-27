const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Fetch dashboard aggregated KPIs and chart distribution data
 */
export async function getDashboard() {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Failed to fetch dashboard data (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Fetch paginated, filtered, and sorted employee records
 * @param {Object} params { limit, offset, department, attrition, overtime, search, sortBy, sortOrder }
 */
export async function getEmployees(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all" && value !== "All") {
      query.append(key, value);
    }
  });

  const response = await fetch(`${API_BASE_URL}/api/employees?${query.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Failed to fetch employees (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Submit employee features to predict attrition probability
 * @param {Object} employeeData 9 feature fields
 */
export async function predictAttrition(employeeData) {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(employeeData)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.detail || `Prediction failed (HTTP ${response.status})`);
  }
  return data;
}

/**
 * Fetch genuine model evaluation metrics saved during training
 */
export async function getModelMetrics() {
  const response = await fetch(`${API_BASE_URL}/api/metrics`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.detail || `Failed to fetch model metrics (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Check connectivity and status of backend and ML service
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(3000)
    });
    if (!response.ok) return { healthy: false, status: response.status };
    const data = await response.json();
    return { healthy: true, ...data };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}
