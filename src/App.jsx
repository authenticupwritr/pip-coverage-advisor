import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Info, Shield, DollarSign, Heart, Briefcase, Users, ChevronRight, RotateCcw } from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState({
    incomeSource: '',
    annualIncome: '',
    hasHealthInsurance: '',
    healthInsuranceType: '',
    needsIncomeContinuation: '',
    hasDisabilities: '',
    occupation: '',
    hasDependents: '',
    vehicleUse: ''
  });

  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const questions = [
    {
      id: 'incomeSource',
      question: 'What is your primary source of income?',
      icon: Briefcase,
      options: [
        { value: 'employed', label: 'Employed (W-2)' },
        { value: 'self-employed', label: 'Self-Employed' },
        { value: 'retired', label: 'Retired' },
        { value: 'none', label: 'No Current Income' }
      ]
    },
    {
      id: 'annualIncome',
      question: 'What is your approximate annual income?',
      icon: DollarSign,
      type: 'input',
      placeholder: 'Enter amount (e.g., 50000)'
    },
    {
      id: 'hasHealthInsurance',
      question: 'Do you have health insurance?',
      icon: Heart,
      options: [
        { value: 'yes', label: 'Yes, comprehensive coverage' },
        { value: 'limited', label: 'Yes, but limited coverage' },
        { value: 'no', label: 'No health insurance' }
      ]
    },
    {
      id: 'needsIncomeContinuation',
      question: 'Would losing income due to injury cause financial hardship?',
      icon: AlertCircle,
      options: [
        { value: 'yes', label: 'Yes, significantly' },
        { value: 'somewhat', label: 'Somewhat' },
        { value: 'no', label: 'No, I have savings/other income' }
      ]
    },
    {
      id: 'hasDependents',
      question: 'Do you have dependents (children, elderly parents, etc.)?',
      icon: Users,
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      id: 'occupation',
      question: 'What best describes your occupation?',
      icon: Briefcase,
      options: [
        { value: 'office', label: 'Office/Desk Work' },
        { value: 'physical', label: 'Physical/Manual Labor' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'homemaker', label: 'Homemaker' },
        { value: 'other', label: 'Other' }
      ]
    }
  ];

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
        description: 'Covers reasonable medical expenses up to $10,000 per person for injuries from auto accidents.',
        estimatedBenefit: 'Up to $10,000 per person',
        reason: formData.hasHealthInsurance === 'no' 
          ? 'You indicated no health insurance coverage - MEB is essential'
          : 'Limited health insurance may leave coverage gaps for accident-related injuries'
      });
    } else {
      recommendations.push({
        type: 'coverage',
        title: 'Medical Expense Benefits (MEB)',
        priority: 'medium',
        description: 'Covers reasonable medical expenses up to $10,000. Works alongside your health insurance.',
        estimatedBenefit: 'Up to $10,000 per person',
        reason: 'Even with health insurance, MEB covers deductibles and copays from accident injuries'
      });
    }

    // Work Loss Benefits (WLB)
    const income = parseFloat(formData.annualIncome) || 0;
    if (formData.incomeSource !== 'none' && formData.incomeSource !== 'retired' && income > 0) {
      const weeklyIncome = income / 52;
      const weeklyBenefit = Math.min(weeklyIncome * 0.8, 900);
      
      recommendations.push({
        type: 'coverage',
        title: 'Work Loss Benefits (WLB)',
        priority: formData.needsIncomeContinuation === 'yes' ? 'high' : 'medium',
        description: 'Replaces 80% of lost wages (up to $900/week) if you cannot work due to accident injuries. Benefits begin after a waiting period.',
        estimatedBenefit: `Estimated: $${weeklyBenefit.toFixed(0)}/week`,
        reason: formData.needsIncomeContinuation === 'yes'
          ? 'Income protection is critical based on your financial situation'
          : 'Provides income security during recovery from injuries'
      });

      // Extended Work Loss Benefits warning
      if (weeklyIncome > 900) {
        warnings.push({
          title: 'Income Exceeds Basic WLB Limits',
          message: `Your weekly income (~$${weeklyIncome.toFixed(0)}) exceeds the standard $900/week benefit cap.`,
          action: 'Consider Extended Work Loss Benefits for up to $1,500/week coverage'
        });
      }
    }

    // Replacement Services Expenses (RSE)
    if (formData.hasDependents === 'yes' || formData.occupation === 'homemaker') {
      recommendations.push({
        type: 'coverage',
        title: 'Replacement Services Expenses (RSE)',
        priority: 'medium',
        description: 'Covers up to $20/day for household services you cannot perform due to injury (cleaning, childcare, etc.).',
        estimatedBenefit: 'Up to $20/day',
        reason: formData.hasDependents === 'yes' 
          ? 'With dependents, you may need help with caregiving duties during recovery'
          : 'Covers costs to replace homemaking services during your recovery'
      });
    }

    // Survivors Loss Benefits
    info.push({
      title: 'Survivors Loss Benefits',
      message: 'PIP also includes $6,000 in survivors benefits paid to surviving dependents in case of death from auto accident.',
      details: 'This is automatically included in Michigan PIP coverage'
    });

    // Physical labor occupation warning
    if (formData.occupation === 'physical') {
      warnings.push({
        title: 'Higher Risk Occupation',
        message: 'Physical labor jobs may have longer recovery times from injuries.',
        action: 'Consider higher coverage limits and ensure adequate Work Loss Benefits'
      });
    }

    // General PIP info
    info.push({
      title: 'No-Fault Protection',
      message: 'PIP provides coverage regardless of who caused the accident.',
      details: 'Benefits cover you, family members in your household, and passengers in your vehicle'
    });

    info.push({
      title: 'Coordination of Benefits',
      message: 'PIP works with your other insurance (health, disability) to maximize your coverage.',
      details: 'Your insurer can explain how benefits coordinate with your existing policies'
    });

    return { recommendations, warnings, info };
  };

  const results = showResults ? calculateRecommendations() : null;

  const resetForm = () => {
    setFormData({
      incomeSource: '',
      annualIncome: '',
      hasHealthInsurance: '',
      healthInsuranceType: '',
      needsIncomeContinuation: '',
      hasDisabilities: '',
      occupation: '',
      hasDependents: '',
      vehicleUse: ''
    });
    setShowResults(false);
    setCurrentStep(0);
  };

  const canProceed = () => {
    const currentQuestion = questions[currentStep];
    const value = formData[currentQuestion.id];
    if (currentQuestion.type === 'input') {
      return value && !isNaN(parseFloat(value));
    }
    return value !== '';
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-50 border-rose-200 text-rose-800';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'bg-rose-500 text-white';
      case 'medium': return 'bg-amber-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">PIP Coverage Advisor</h1>
              <p className="text-slate-400 text-sm">Personal Injury Protection Recommendations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!showResults ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            {/* Progress bar */}
            <div className="bg-slate-900/50 px-6 py-4 border-b border-slate-700/50">
              <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                <span>Question {currentStep + 1} of {questions.length}</span>
                <span>{Math.round(((currentStep + 1) / questions.length) * 100)}% complete</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="p-8">
              {(() => {
                const q = questions[currentStep];
                const Icon = q.icon;
                return (
                  <div key={q.id} className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-emerald-500/20 rounded-xl">
                        <Icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-white pt-2">{q.question}</h2>
                    </div>

                    {q.type === 'input' ? (
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                          type="number"
                          value={formData[q.id]}
                          onChange={(e) => handleInputChange(q.id, e.target.value)}
                          placeholder={q.placeholder}
                          className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {q.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleInputChange(q.id, option.value)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              formData[q.id] === option.value
                                ? 'bg-emerald-500/20 border-emerald-500 text-white'
                                : 'bg-slate-900/30 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-900/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{option.label}</span>
                              {formData[q.id] === option.value && (
                                <CheckCircle className="w-5 h-5 text-emerald-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-700/50">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    currentStep === 0
                      ? 'text-slate-600 cursor-not-allowed'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    canProceed()
                      ? 'bg-emerald-500 text-white hover:bg-emerald-400'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {currentStep === questions.length - 1 ? 'Get Recommendations' : 'Continue'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Your PIP Recommendations</h2>
                  <p className="text-slate-400 mt-1">Based on your responses, here's what we recommend</p>
                </div>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Recommended Coverage
              </h3>
              {results.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-6 ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg">{rec.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority} priority
                    </span>
                  </div>
                  <p className="text-sm opacity-90 mb-3">{rec.description}</p>
                  {rec.estimatedBenefit && (
                    <div className="flex items-center gap-2 text-sm font-semibold mb-2">
                      <DollarSign className="w-4 h-4" />
                      {rec.estimatedBenefit}
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-t border-current/20 text-sm opacity-75">
                    <strong>Why:</strong> {rec.reason}
                  </div>
                </div>
              ))}
            </div>

            {/* Warnings */}
            {results.warnings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  Important Considerations
                </h3>
                {results.warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6"
                  >
                    <h4 className="font-bold text-amber-200 mb-2">{warning.title}</h4>
                    <p className="text-amber-100/80 text-sm mb-3">{warning.message}</p>
                    <div className="flex items-center gap-2 text-amber-300 text-sm font-medium">
                      <ChevronRight className="w-4 h-4" />
                      {warning.action}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-400" />
                Good to Know
              </h3>
              {results.info.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-600/50 bg-slate-800/30 p-6"
                >
                  <h4 className="font-semibold text-slate-200 mb-2">{item.title}</h4>
                  <p className="text-slate-400 text-sm mb-2">{item.message}</p>
                  <p className="text-slate-500 text-xs">{item.details}</p>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
              <p className="text-slate-500 text-xs leading-relaxed">
                <strong className="text-slate-400">Disclaimer:</strong> This tool provides general guidance only and is not a substitute for professional insurance advice. Coverage options, limits, and availability vary by state and insurer. Please consult with a licensed insurance professional to determine the best coverage for your specific situation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
