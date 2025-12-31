import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, FileText, DollarSign } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    incomeSource: '',
    annualIncome: '',
    hasHealthInsurance: '',
    needsIncomeContinuation: '',
    hasDisabilities: '',
    occupation: '',
    hasDependents: ''
  });

  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateRecommendations = () => {
    const recommendations = [];
    const warnings = [];
    const info = [];

    // Medical Expense Benefits (MEB)
    if (formData.hasHealthInsurance === 'no' || formData.hasHealthInsurance === 'limited') {
      recommendations.push({
        type: 'coverage',
        title: 'Medical Expense Benefits (MEB)',
        priority: 'high',
        description: 'Covers reasonable medical expenses up to $10,000 per person.',
        reason: formData.hasHealthInsurance === 'no' 
          ? 'You indicated no health insurance coverage'
          : 'Limited health insurance may leave coverage gaps'
      });
    }

    // Work Loss Benefits (WLB)
    const income = parseFloat(formData.annualIncome) || 0;
    if (formData.incomeSource !== 'none' && income > 0) {
      const weeklyIncome = income / 52;
      const weeklyBenefit = Math.min(weeklyIncome * 0.8, 900);
      
      recommendations.push({
        type: 'coverage',
        title: 'Work Loss Benefits (WLB)',
        priority: formData.needsIncomeContinuation === 'yes' ? 'high' : 'medium',
        description: `Covers 80% of lost income (up to $900/week) after 30 days of work loss.`,
        estimatedBenefit: `Estimated weekly benefit: $${weeklyBenefit.toFixed(2)}`,
        reason: 'Based on your reported income'
      });
    }

    // Replacement Services Expenses (RSE)
    if (formData.hasDependents === 'yes' || formData.occupation === 'homemaker') {
      recommendations.push({
        type: 'coverage',
        title: 'Replacement Services Expenses (RSE)',
        priority: 'medium',
        description: 'Covers up to $20/day for household services you can\'t perform due to injury.',
        reason: formData.hasDependents === 'yes' 
          ? 'You have dependents who may need care'
          : 'Your homemaking duties may require replacement services'
      });
    }

    // Extended Work Loss Benefits
    if (income > 52000) {
      warnings.push({
        title: 'Consider Extended Work Loss Benefits',
        message: 'Your income exceeds basic coverage limits. Extended benefits can provide up to $1,500/week.',
        action: 'Contact your insurance agent about extended coverage options'
      });
    }

    // Disability considerations
    if (formData.hasDisabilities === 'yes') {
      info.push({
        title: 'Accommodation Services',
        message: 'PIP benefits can help cover costs for necessary accommodations and modifications.',
        details: 'Discuss specific needs with your insurance provider'
      });
    }

    // General info
    info.push({
      title: 'No-Fault Protection',
      message: 'PIP provides coverage regardless of who caused the accident.',
      details: 'Benefits are available for you, family members, and passengers in your vehicle'
    });

    return { recommendations, warnings, info };
  };

  const results = showResults ? calculateRecommendations() : null;

  const resetForm = () => {
    setFormData({
      incomeSource: '',
      annualIncome: '',
      hasHealthInsurance: '',
      needsIncomeContinuation: '',
      hasDisabilities: '',
      occupation: '',
      hasDependents: ''
    });
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">PIP Coverage Advisor</h1>
            <p className="text-gray-600">Get personalized recommendations for your Personal Injury Protection coverage</p>
          </div>

          {!showResults ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Primary Income Source
                </label>
                <select
                  value={formData.incomeSource}
                  onChange={(e) => handleInputChange('incomeSource', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="employment">Employment</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="retired">Retired</option>
                  <option value="none">No Income</option>
                </select>
              </div>

              {formData.incomeSource !== 'none' && formData.incomeSource !== '' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Annual Income
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                      type="number"
                      value={formData.annualIncome}
                      onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Do you have health insurance?
                </label>
                <select
                  value={formData.hasHealthInsurance}
                  onChange={(e) => handleInputChange('hasHealthInsurance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="yes">Yes, comprehensive coverage</option>
                  <option value="limited">Yes, but limited coverage</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Would loss of income create financial hardship?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needsIncome"
                      value="yes"
                      checked={formData.needsIncomeContinuation === 'yes'}
                      onChange={(e) => handleInputChange('needsIncomeContinuation', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>Yes, I rely on my income</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="needsIncome"
                      value="no"
                      checked={formData.needsIncomeContinuation === 'no'}
                      onChange={(e) => handleInputChange('needsIncomeContinuation', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>No, I have other income sources</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Do you have dependents (children, elderly parents, etc.)?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="dependents"
                      value="yes"
                      checked={formData.hasDependents === 'yes'}
                      onChange={(e) => handleInputChange('hasDependents', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="dependents"
                      value="no"
                      checked={formData.hasDependents === 'no'}
                      onChange={(e) => handleInputChange('hasDependents', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Occupation Type
                </label>
                <select
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  <option value="office">Office/Desk Work</option>
                  <option value="physical">Physical Labor</option>
                  <option value="professional">Professional Services</option>
                  <option value="homemaker">Homemaker</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Do you have any pre-existing disabilities or special needs?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="disabilities"
                      value="yes"
                      checked={formData.hasDisabilities === 'yes'}
                      onChange={(e) => handleInputChange('hasDisabilities', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="disabilities"
                      value="no"
                      checked={formData.hasDisabilities === 'no'}
                      onChange={(e) => handleInputChange('hasDisabilities', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setShowResults(true)}
                className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg mt-8"
              >
                Get My Recommendations
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {results.recommendations.filter(r => r.priority === 'high').length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="mr-2 text-red-600" />
                    Essential Coverage
                  </h2>
                  <div className="space-y-4">
                    {results.recommendations.filter(r => r.priority === 'high').map((rec, idx) => (
                      <div key={idx} className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{rec.title}</h3>
                        <p className="text-gray-700 mb-2">{rec.description}</p>
                        {rec.estimatedBenefit && (
                          <p className="text-sm font-semibold text-blue-600 mb-2">{rec.estimatedBenefit}</p>
                        )}
                        <p className="text-sm text-gray-600 italic">Why: {rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.recommendations.filter(r => r.priority === 'medium').length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <CheckCircle className="mr-2 text-green-600" />
                    Recommended Coverage
                  </h2>
                  <div className="space-y-4">
                    {results.recommendations.filter(r => r.priority === 'medium').map((rec, idx) => (
                      <div key={idx} className="bg-green-50 border-l-4 border-green-600 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{rec.title}</h3>
                        <p className="text-gray-700 mb-2">{rec.description}</p>
                        {rec.estimatedBenefit && (
                          <p className="text-sm font-semibold text-blue-600 mb-2">{rec.estimatedBenefit}</p>
                        )}
                        <p className="text-sm text-gray-600 italic">Why: {rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.warnings.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="mr-2 text-yellow-600" />
                    Important Considerations
                  </h2>
                  <div className="space-y-4">
                    {results.warnings.map((warning, idx) => (
                      <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{warning.title}</h3>
                        <p className="text-gray-700 mb-2">{warning.message}</p>
                        <p className="text-sm font-semibold text-blue-600">→ {warning.action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.info.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Info className="mr-2 text-blue-600" />
                    Good to Know
                  </h2>
                  <div className="space-y-4">
                    {results.info.map((item, idx) => (
                      <div key={idx} className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                        <p className="text-gray-700 mb-2">{item.message}</p>
                        {item.details && (
                          <p className="text-sm text-gray-600 italic">{item.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <FileText className="inline mr-1" size={16} />
                  <strong>Disclaimer:</strong> This tool provides general guidance only. PIP coverage requirements 
                  and benefits vary by state and insurance provider. Please consult with a licensed insurance agent 
                  or attorney for personalized advice specific to your situation.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="w-full bg-gray-600 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-600">
          <p className="text-sm">
            Need help? Contact a licensed insurance professional in your area.
          </p>
        </div>
      </div>
    </div>
  );
}
