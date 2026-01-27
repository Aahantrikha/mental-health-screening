/**
 * Calculate risk level based on classifier predictions
 * @param {Array} predictions - [{label, score}]
 * @returns {string} - "High", "Moderate", or "Low"
 */
export function calculateRiskLevel(predictions) {
  if (!predictions || predictions.length === 0) {
    return 'Unknown';
  }

  // Get the top prediction
  const topPrediction = predictions.reduce((max, pred) => 
    pred.score > max.score ? pred : max
  , predictions[0]);

  const { label, score } = topPrediction;
  const normalizedLabel = label.toLowerCase();

  // High risk: Depression or Anxiety with high confidence
  if ((normalizedLabel.includes('depression') || normalizedLabel.includes('anxiety')) && score >= 0.75) {
    return 'High';
  }

  // Moderate risk: Depression/Anxiety with moderate confidence, or other concerning labels
  if ((normalizedLabel.includes('depression') || normalizedLabel.includes('anxiety')) && score >= 0.50) {
    return 'Moderate';
  }

  if (normalizedLabel.includes('stress') || normalizedLabel.includes('suicidal')) {
    return score >= 0.60 ? 'High' : 'Moderate';
  }

  // Low risk: Normal or low confidence on concerning labels
  return 'Low';
}

/**
 * Generate a screening report based on predictions and risk level
 * @param {Array} predictions - [{label, score}]
 * @param {string} riskLevel - "High", "Moderate", or "Low"
 * @returns {string} - Human-readable report
 */
export function generateReport(predictions, riskLevel) {
  if (!predictions || predictions.length === 0) {
    return 'Unable to generate report: No predictions available.';
  }

  const topPrediction = predictions[0];
  const { label, score } = topPrediction;
  const confidence = (score * 100).toFixed(1);

  let report = `Mental Health Screening Report\n\n`;
  report += `Primary Classification: ${label} (${confidence}% confidence)\n`;
  report += `Risk Level: ${riskLevel}\n\n`;

  // Risk-specific recommendations
  if (riskLevel === 'High') {
    report += `⚠️ HIGH RISK DETECTED\n\n`;
    report += `The analysis indicates significant signs of ${label.toLowerCase()}. `;
    report += `We strongly recommend:\n`;
    report += `• Speak with a mental health professional immediately\n`;
    report += `• Contact a crisis helpline if experiencing thoughts of self-harm\n`;
    report += `• Reach out to trusted friends or family members\n`;
    report += `• Avoid making major life decisions while in distress\n\n`;
    report += `Crisis Resources:\n`;
    report += `• National Suicide Prevention Lifeline: 988\n`;
    report += `• Crisis Text Line: Text HOME to 741741\n`;
  } else if (riskLevel === 'Moderate') {
    report += `⚠️ MODERATE RISK DETECTED\n\n`;
    report += `The analysis suggests some signs of ${label.toLowerCase()}. `;
    report += `Consider the following steps:\n`;
    report += `• Schedule an appointment with a mental health professional\n`;
    report += `• Practice self-care and stress management techniques\n`;
    report += `• Maintain regular sleep, exercise, and social connections\n`;
    report += `• Monitor your symptoms and seek help if they worsen\n`;
  } else {
    report += `✅ LOW RISK\n\n`;
    report += `The analysis indicates relatively low risk. Continue to:\n`;
    report += `• Maintain healthy lifestyle habits\n`;
    report += `• Stay connected with supportive relationships\n`;
    report += `• Practice stress management and self-care\n`;
    report += `• Seek help if you notice changes in your mental health\n`;
  }

  report += `\n⚠️ DISCLAIMER: This is a screening tool only and not a clinical diagnosis. `;
  report += `Please consult with a qualified mental health professional for proper evaluation and treatment.`;

  return report;
}

/**
 * Format predictions for chart visualization
 * @param {Array} predictions - [{label, score}]
 * @returns {Object} - {labels: [], scores: []}
 */
export function formatChartData(predictions) {
  if (!predictions || predictions.length === 0) {
    return { labels: [], scores: [] };
  }

  // Sort by score descending
  const sorted = [...predictions].sort((a, b) => b.score - a.score);

  return {
    labels: sorted.map(p => p.label),
    scores: sorted.map(p => parseFloat((p.score * 100).toFixed(2)))
  };
}

/**
 * Get color coding for risk level
 * @param {string} riskLevel
 * @returns {string} - Color hex code
 */
export function getRiskColor(riskLevel) {
  const colors = {
    'High': '#dc2626',      // red-600
    'Moderate': '#f59e0b',  // amber-500
    'Low': '#10b981',       // green-500
    'Unknown': '#6b7280'    // gray-500
  };
  return colors[riskLevel] || colors['Unknown'];
}