import React, { useState } from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Plus, Trash2, FileText, HelpCircle, Shield, Users, ClipboardList, Heart, Printer, Download } from 'lucide-react';

const TOOLTIPS = {
  medicareAB: "Medicare Parts A & B together provide hospital and medical coverage. Part A alone is NOT sufficient. Medicare Advantage plans that cover both A & B services qualify.",
  qhc: "Qualified Health Coverage (QHC) must: (1) NOT exclude or limit coverage for auto accident injuries, AND (2) have an annual individual deductible of $6,579 or less. IMPORTANT: Medicaid and health care sharing ministries are NOT QHC.",
  qhcVsCoord: "QHC eligibility and coordination are DIFFERENT questions. QHC determines if you CAN reduce PIP. Coordination determines who pays FIRST when you have a claim. A plan can be QHC even if it pays secondary.",
  medicaid: "Medicaid coverage must be current and verifiable. Proof can be a current Medicaid ID card or letter from Michigan DHHS. Coverage must be verified at EVERY renewal. Note: Medicaid is NOT the same as Qualified Health Coverage.",
  gaps: "PIP covers things health insurance often doesn't: transportation to appointments, vehicle modifications, case management, residential treatment, long-term custodial care, and attendant care."
};

const MEDICAID_PLANS = [
  "Aetna Better Health of Michigan",
  "Blue Cross Complete of Michigan", 
  "HAP CareSource",
  "McLaren Health Plan",
  "Meridian Health Plan of Michigan",
  "Molina Healthcare of Michigan",
  "Priority Health Choice",
  "UnitedHealthcare Community Plan",
  "Upper Peninsula Health Plan"
];

const PIP_OPTIONS = {
  1: { limit: "Unlimited", description: "No dollar cap on PIP medical benefits", premium: "Highest" },
  2: { limit: "$500,000", description: "Per person, per accident", premium: "Lower than unlimited" },
  3: { limit: "$250,000", description: "Per person, per accident", premium: "Lower than $500K" },
  4: { limit: "$250,000 with Exclusions", description: "Named persons excluded from PIP medical entirely", premium: "Lower than standard $250K" },
  5: { limit: "$50,000", description: "Per person, per accident (Medicaid option)", premium: "Lowest limited option" },
  6: { limit: "Opt-Out (No PIP Medical)", description: "No PIP medical coverage at all", premium: "No PIP medical premium" }
};

const Tooltip = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <span className="inline-flex items-center cursor-help text-blue-600" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
        {children}
        <HelpCircle className="w-4 h-4 ml-1" />
      </span>
      {show && (
        <div className="absolute z-50 w-72 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg -top-2 left-full ml-2">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-4" />
        </div>
      )}
    </span>
  );
};

const WarningBox = ({ type = "warning", title, children }) => {
  const styles = {
    warning: { bg: "bg-amber-50", border: "border-amber-400", icon: <AlertTriangle className="w-5 h-5 text-amber-600" /> },
    info: { bg: "bg-blue-50", border: "border-blue-400", icon: <Info className="w-5 h-5 text-blue-600" /> },
    danger: { bg: "bg-red-50", border: "border-red-400", icon: <XCircle className="w-5 h-5 text-red-600" /> },
    success: { bg: "bg-green-50", border: "border-green-400", icon: <CheckCircle className="w-5 h-5 text-green-600" /> }
  };
  const s = styles[type];
  return (
    <div className={`${s.bg} ${s.border} border-l-4 p-4 rounded-r-lg mb-4`}>
      <div className="flex items-start gap-3">
        {s.icon}
        <div>
          {title && <div className="font-semibold mb-1">{title}</div>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-between mb-8 px-2 overflow-x-auto">
    {steps.map((step, idx) => (
      <React.Fragment key={idx}>
        <div className="flex flex-col items-center min-w-fit">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
            ${idx < currentStep ? 'bg-green-500 text-white' : idx === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            {idx < currentStep ? '✓' : idx + 1}
          </div>
          <span className={`text-xs mt-1 text-center max-w-20 ${idx === currentStep ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>{step}</span>
        </div>
        {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-1 min-w-4 ${idx < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />}
      </React.Fragment>
    ))}
  </div>
);

const RadioGroup = ({ name, value, onChange, options }) => (
  <div className="space-y-2">
    {options.map(opt => (
      <label key={opt.value} className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all
        ${value === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
        <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} className="mt-1 mr-3" />
        <div>
          <div className="font-medium">{opt.label}</div>
          {opt.description && <div className="text-sm text-gray-600 mt-1">{opt.description}</div>}
        </div>
      </label>
    ))}
  </div>
);

const MedicareInterstitial = ({ onContinue, onGoBack }) => (
  <div className="space-y-6">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <Heart className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Important: Medicare vs. PIP Coverage</h2>
      <p className="text-gray-600 mt-2">Before you proceed, please understand these critical differences.</p>
    </div>

    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
      <h3 className="font-bold text-red-800 text-lg mb-4">What Medicare Does NOT Cover That PIP Does:</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { item: "Transportation", desc: "Mileage and transport to/from medical appointments" },
          { item: "Vehicle Modifications", desc: "Wheelchair lifts, hand controls, adapted vehicles" },
          { item: "Attendant Care", desc: "Help with bathing, dressing, meals, daily activities" },
          { item: "Family-Provided Care", desc: "Compensation for family members providing care (up to 56 hrs/wk)" },
          { item: "Long-term Custodial Care", desc: "Extended nursing home or residential care" },
          { item: "Case Management", desc: "Coordination of your overall care and recovery" },
          { item: "Home Modifications", desc: "Ramps, bathroom modifications, accessibility changes" },
          { item: "Residential Treatment", desc: "Specialized recovery and rehabilitation programs" }
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-red-800">{item.item}</span>
              <p className="text-sm text-red-700">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
      <h3 className="font-bold text-amber-800 text-lg mb-3">Real-World Scenario:</h3>
      <p className="text-amber-900">A 68-year-old with Medicare opts out of PIP. They're seriously injured in an auto accident, requiring 6 months of rehabilitation, daily attendant care, and home modifications.</p>
      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <div className="font-semibold text-green-700 mb-2">With Unlimited PIP:</div>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✓ All medical expenses covered</li>
            <li>✓ Attendant care: $50,000+/year covered</li>
            <li>✓ Home modifications: $30,000 covered</li>
            <li className="font-semibold text-green-700">Out of pocket: Minimal</li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <div className="font-semibold text-red-700 mb-2">With Medicare Only (Opt-Out):</div>
          <ul className="text-sm space-y-1 text-gray-700">
            <li>✓ Hospital and doctor visits covered</li>
            <li>✗ Attendant care: NOT covered</li>
            <li>✗ Home modifications: NOT covered</li>
            <li className="font-semibold text-red-700">Out of pocket: $80,000+</li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
      <h3 className="font-bold text-blue-800 mb-2">The Premium Savings vs. Risk Question:</h3>
      <p className="text-blue-900 text-sm">Opting out saves a few hundred dollars per year. A single serious accident could cost tens or hundreds of thousands in uncovered expenses. This is not about agent commission—it's about protection from catastrophic financial loss.</p>
    </div>

    <div className="flex justify-between pt-4">
      <button onClick={onGoBack} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">← Go Back</button>
      <button onClick={onContinue} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">I Understand, Continue →</button>
    </div>
  </div>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [showMedicareInterstitial, setShowMedicareInterstitial] = useState(false);
  const [medicareAcknowledged, setMedicareAcknowledged] = useState(false);
  const [namedInsured, setNamedInsured] = useState({
    name: '', dob: '', hasMedicareA: null, hasMedicareB: null, hasMedicaid: null, medicaidPlan: '',
    hasOtherHealth: null, otherHealthIsQHC: null, otherHealthDeductible: null, wantsCoordinated: null
  });
  const [hasHouseholdMembers, setHasHouseholdMembers] = useState(null);
  const [householdMembers, setHouseholdMembers] = useState([]);
  const [allSameHealth, setAllSameHealth] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [excludedPersons, setExcludedPersons] = useState([]);

  const steps = ['Insured', 'Household', 'Eligibility', 'Selection', 'Summary'];

  const niHasMedicare = namedInsured.hasMedicareA === 'yes' && namedInsured.hasMedicareB === 'yes';
  const niHasMedicaid = namedInsured.hasMedicaid === 'yes';
  const niHasQHC = namedInsured.hasOtherHealth === 'yes' && namedInsured.otherHealthIsQHC === 'yes' && namedInsured.otherHealthDeductible === 'under';

  const getEffectiveHouseholdMembers = () => {
    if (allSameHealth === true) {
      return householdMembers.map(m => ({
        ...m,
        hasMedicareA: namedInsured.hasMedicareA,
        hasMedicareB: namedInsured.hasMedicareB,
        hasMedicaid: namedInsured.hasMedicaid,
        hasOtherHealth: namedInsured.hasOtherHealth,
        otherHealthIsQHC: namedInsured.otherHealthIsQHC,
        hasAutoPolicy: 'no'
      }));
    }
    return householdMembers;
  };

  const determineEligibility = () => {
    const eligible = { 1: true, 2: true, 3: true, 4: false, 5: false, 6: false };
    const reasons = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    const effectiveMembers = getEffectiveHouseholdMembers();
    
    if (niHasQHC && !niHasMedicare) {
      eligible[4] = true;
      reasons[4].push("Named insured has QHC (non-Medicare) with deductible ≤$6,579");
    } else if (niHasMedicare) {
      reasons[4].push("Cannot use Medicare as QHC for exclusions—Medicare is only valid for Option 6");
    } else if (namedInsured.hasOtherHealth === 'yes' && namedInsured.otherHealthDeductible === 'over') {
      reasons[4].push("Health plan deductible exceeds $6,579—does not qualify as QHC");
    } else {
      reasons[4].push("Named insured must have QHC (non-Medicare) to use exclusions");
    }
    
    if (niHasMedicaid) {
      const allHouseholdCovered = effectiveMembers.every(m => 
        m.hasAutoPolicy === 'yes' || m.hasMedicaid === 'yes' || 
        (m.hasOtherHealth === 'yes' && m.otherHealthIsQHC === 'yes') ||
        (m.hasMedicareA === 'yes' && m.hasMedicareB === 'yes')
      );
      if (allHouseholdCovered || effectiveMembers.length === 0) {
        eligible[5] = true;
        reasons[5].push("Named insured enrolled in Medicaid");
        if (effectiveMembers.length > 0) reasons[5].push("All household members have QHC, Medicaid, or other auto policy");
      } else {
        reasons[5].push("Named insured has Medicaid, but not all household members have required coverage");
      }
    } else {
      reasons[5].push("Named insured must be enrolled in Medicaid");
    }
    
    if (niHasMedicare) {
      const allHouseholdQualified = effectiveMembers.every(m => {
        const mHasMedicare = m.hasMedicareA === 'yes' && m.hasMedicareB === 'yes';
        const mHasQHC = m.hasOtherHealth === 'yes' && m.otherHealthIsQHC === 'yes';
        return m.hasAutoPolicy === 'yes' || mHasMedicare || mHasQHC;
      });
      if (allHouseholdQualified || effectiveMembers.length === 0) {
        eligible[6] = true;
        reasons[6].push("Named insured has Medicare Parts A & B");
        if (effectiveMembers.length > 0) reasons[6].push("All household members have QHC or other auto policy with PIP");
      } else {
        reasons[6].push("Not all household members have QHC or other auto coverage");
      }
    } else {
      reasons[6].push("Named insured must have BOTH Medicare Parts A & B");
    }
    
    return { eligible, reasons };
  };

  const getRequiredDocs = () => {
    const docs = [];
    if (!selectedOption) return docs;
    const effectiveMembers = getEffectiveHouseholdMembers();
    
    if (selectedOption === 4) {
      docs.push({ doc: "QHC Letter for Named Insured", desc: "Letter confirming coverage qualifies as QHC (non-Medicare, deductible ≤$6,579, no auto exclusions)", person: namedInsured.name });
      excludedPersons.forEach(p => {
        if (p !== namedInsured.name) {
          docs.push({ doc: `QHC Letter for ${p}`, desc: "Each excluded person needs their own QHC documentation", person: p });
        }
      });
    }
    if (selectedOption === 5) {
      docs.push({ doc: "Medicaid ID Card or DHHS Letter", desc: "Current proof of Medicaid enrollment for named insured", person: namedInsured.name });
    }
    if (selectedOption === 6) {
      docs.push({ doc: "Medicare Card (Parts A & B)", desc: "Or Medicare Advantage plan documentation covering A & B services", person: namedInsured.name });
      effectiveMembers.forEach(m => {
        if (m.hasOtherHealth === 'yes' && m.otherHealthIsQHC === 'yes') {
          docs.push({ doc: `QHC Letter for ${m.name || 'household member'}`, desc: "Documentation of qualified health coverage", person: m.name });
        }
        if (m.hasMedicareA === 'yes' && m.hasMedicareB === 'yes') {
          docs.push({ doc: `Medicare Card for ${m.name || 'household member'}`, desc: "Medicare Parts A & B documentation", person: m.name });
        }
      });
    }
    if ([2, 3, 4].includes(selectedOption) && namedInsured.wantsCoordinated === 'yes') {
      docs.push({ doc: "Coordination of Benefits Letter", desc: "Letter from health insurer confirming coordination with auto insurance", person: namedInsured.name });
    }
    
    return docs;
  };

  const addHouseholdMember = () => {
    setHouseholdMembers([...householdMembers, {
      id: Date.now(), name: '', dob: '', relationship: '',
      hasMedicareA: null, hasMedicareB: null, hasMedicaid: null,
      hasOtherHealth: null, otherHealthIsQHC: null, hasAutoPolicy: null
    }]);
  };

  const updateHouseholdMember = (id, field, value) => {
    setHouseholdMembers(householdMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeHouseholdMember = (id) => {
    setHouseholdMembers(householdMembers.filter(m => m.id !== id));
  };

  const handleNextStep = () => {
    if (step === 0 && niHasMedicare && !medicareAcknowledged) {
      setShowMedicareInterstitial(true);
      return;
    }
    setStep(step + 1);
  };

  const handleMedicareInterstitialContinue = () => {
    setMedicareAcknowledged(true);
    setShowMedicareInterstitial(false);
    setStep(1);
  };

  const renderStep = () => {
    if (showMedicareInterstitial) {
      return <MedicareInterstitial onContinue={handleMedicareInterstitialContinue} onGoBack={() => setShowMedicareInterstitial(false)} />;
    }

    switch(step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Named Insured Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2">Full Name</label>
                <input type="text" className="w-full p-3 border rounded-lg" value={namedInsured.name}
                  onChange={e => setNamedInsured({...namedInsured, name: e.target.value})} placeholder="As it appears on documents" />
              </div>
              <div>
                <label className="block font-medium mb-2">Date of Birth</label>
                <input type="date" className="w-full p-3 border rounded-lg" value={namedInsured.dob}
                  onChange={e => setNamedInsured({...namedInsured, dob: e.target.value})} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3"><Tooltip content={TOOLTIPS.medicareAB}>Medicare Coverage</Tooltip></h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Medicare Part A (Hospital)?</label>
                  <RadioGroup name="medicareA" value={namedInsured.hasMedicareA}
                    onChange={v => setNamedInsured({...namedInsured, hasMedicareA: v})}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Medicare Part B (Medical)?</label>
                  <RadioGroup name="medicareB" value={namedInsured.hasMedicareB}
                    onChange={v => setNamedInsured({...namedInsured, hasMedicareB: v})}
                    options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
                </div>
              </div>
              {namedInsured.hasMedicareA === 'yes' && namedInsured.hasMedicareB === 'no' && (
                <WarningBox type="warning" title="Part A Alone Is Not Sufficient">
                  You need BOTH Parts A & B to qualify for the Medicare opt-out option.
                </WarningBox>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3"><Tooltip content={TOOLTIPS.medicaid}>Medicaid Coverage</Tooltip></h3>
              <label className="block text-sm font-medium mb-2">Enrolled in Michigan Medicaid?</label>
              <RadioGroup name="medicaid" value={namedInsured.hasMedicaid}
                onChange={v => setNamedInsured({...namedInsured, hasMedicaid: v})}
                options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              {namedInsured.hasMedicaid === 'yes' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Medicaid Plan</label>
                  <select className="w-full p-3 border rounded-lg" value={namedInsured.medicaidPlan}
                    onChange={e => setNamedInsured({...namedInsured, medicaidPlan: e.target.value})}>
                    <option value="">Select plan...</option>
                    {MEDICAID_PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="mihealth">Standard mihealth card</option>
                  </select>
                  <WarningBox type="info" title="Medicaid ≠ QHC">
                    Medicaid allows the $50,000 option (Option 5), but is NOT Qualified Health Coverage for Options 4 or 6.
                  </WarningBox>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3"><Tooltip content={TOOLTIPS.qhc}>Other Health Insurance</Tooltip></h3>
              <label className="block text-sm font-medium mb-2">Other health insurance (employer, individual, TRICARE)?</label>
              <RadioGroup name="otherHealth" value={namedInsured.hasOtherHealth}
                onChange={v => setNamedInsured({...namedInsured, hasOtherHealth: v, otherHealthIsQHC: null, otherHealthDeductible: null})}
                options={[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]} />
              
              {namedInsured.hasOtherHealth === 'yes' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Does it cover auto accident injuries without exclusions?</label>
                    <RadioGroup name="qhc" value={namedInsured.otherHealthIsQHC}
                      onChange={v => setNamedInsured({...namedInsured, otherHealthIsQHC: v})}
                      options={[
                        { value: 'yes', label: 'Yes - No exclusions' },
                        { value: 'no', label: 'No - Excludes auto accidents' },
                        { value: 'unsure', label: 'Unsure' }
                      ]} />
                  </div>
                  
                  {namedInsured.otherHealthIsQHC === 'yes' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Annual individual deductible?</label>
                      <RadioGroup name="deductible" value={namedInsured.otherHealthDeductible}
                        onChange={v => setNamedInsured({...namedInsured, otherHealthDeductible: v})}
                        options={[
                          { value: 'under', label: '$6,579 or less', description: 'Qualifies as QHC' },
                          { value: 'over', label: 'More than $6,579', description: 'Does NOT qualify as QHC' }
                        ]} />
                    </div>
                  )}
                  
                  {namedInsured.otherHealthIsQHC === 'yes' && namedInsured.otherHealthDeductible === 'under' && (
                    <WarningBox type="success" title="Qualifies as QHC">This coverage meets the QHC definition.</WarningBox>
                  )}
                  {namedInsured.otherHealthDeductible === 'over' && (
                    <WarningBox type="warning" title="Does Not Qualify">Deductible over $6,579 does not meet QHC requirements.</WarningBox>
                  )}
                  {namedInsured.otherHealthIsQHC === 'unsure' && (
                    <WarningBox type="warning" title="Action Required">Contact your health insurer for a QHC determination letter.</WarningBox>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Household Members</h2>
            </div>
            
            <WarningBox type="info" title="Who counts?">
              Spouse and resident relatives (related by blood, marriage, or adoption living in the same household). NOT unrelated roommates.
            </WarningBox>

            <div>
              <label className="block font-medium mb-2">Are there other household members?</label>
              <RadioGroup name="hasHousehold" value={hasHouseholdMembers}
                onChange={v => {
                  setHasHouseholdMembers(v);
                  if (v === 'no') {
                    setHouseholdMembers([]);
                    setAllSameHealth(null);
                  } else if (householdMembers.length === 0) {
                    addHouseholdMember();
                  }
                }}
                options={[
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No - Named insured only' }
                ]} />
            </div>

            {hasHouseholdMembers === 'yes' && (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Household Members</h3>
                    <button onClick={addHouseholdMember}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm">
                      <Plus className="w-4 h-4" /> Add Member
                    </button>
                  </div>
                  
                  {householdMembers.map((member, idx) => (
                    <div key={member.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium">Member {idx + 1}</h4>
                        <button onClick={() => removeHouseholdMember(member.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div>
                          <label className="block text-xs font-medium mb-1">Name</label>
                          <input type="text" className="w-full p-2 border rounded text-sm" value={member.name}
                            onChange={e => updateHouseholdMember(member.id, 'name', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">DOB</label>
                          <input type="date" className="w-full p-2 border rounded text-sm" value={member.dob}
                            onChange={e => updateHouseholdMember(member.id, 'dob', e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1">Relationship</label>
                          <select className="w-full p-2 border rounded text-sm" value={member.relationship}
                            onChange={e => updateHouseholdMember(member.id, 'relationship', e.target.value)}>
                            <option value="">Select...</option>
                            <option value="spouse">Spouse</option>
                            <option value="child">Child</option>
                            <option value="parent">Parent</option>
                            <option value="other">Other Relative</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {householdMembers.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block font-medium mb-2">
                      Do ALL household members have the same health coverage as {namedInsured.name || 'the named insured'}?
                    </label>
                    <RadioGroup name="sameHealth" value={allSameHealth}
                      onChange={v => setAllSameHealth(v)}
                      options={[
                        { value: true, label: 'Yes - Same coverage for everyone', description: 'Same employer plan, Medicare status, etc.' },
                        { value: false, label: 'No - Coverage varies by person' }
                      ]} />
                  </div>
                )}

                {allSameHealth === false && householdMembers.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Individual Coverage Details</h3>
                    {householdMembers.map((member, idx) => (
                      <div key={member.id} className="bg-gray-50 p-4 rounded-lg border">
                        <h4 className="font-medium mb-3">{member.name || `Member ${idx + 1}`}</h4>
                        <div className="space-y-2">
                          <label className="block text-xs font-medium">Coverage (check all that apply):</label>
                          <div className="grid grid-cols-2 gap-2">
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={member.hasMedicareA === 'yes' && member.hasMedicareB === 'yes'}
                                onChange={e => {
                                  updateHouseholdMember(member.id, 'hasMedicareA', e.target.checked ? 'yes' : 'no');
                                  updateHouseholdMember(member.id, 'hasMedicareB', e.target.checked ? 'yes' : 'no');
                                }} />
                              Medicare A & B
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={member.hasMedicaid === 'yes'}
                                onChange={e => updateHouseholdMember(member.id, 'hasMedicaid', e.target.checked ? 'yes' : 'no')} />
                              Medicaid
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={member.hasOtherHealth === 'yes'}
                                onChange={e => updateHouseholdMember(member.id, 'hasOtherHealth', e.target.checked ? 'yes' : 'no')} />
                              Other Health (QHC)
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" checked={member.hasAutoPolicy === 'yes'}
                                onChange={e => updateHouseholdMember(member.id, 'hasAutoPolicy', e.target.checked ? 'yes' : 'no')} />
                              Own Auto Policy
                            </label>
                          </div>
                          {member.hasOtherHealth === 'yes' && (
                            <label className="flex items-center gap-2 text-sm mt-2">
                              <input type="checkbox" checked={member.otherHealthIsQHC === 'yes'}
                                onChange={e => updateHouseholdMember(member.id, 'otherHealthIsQHC', e.target.checked ? 'yes' : 'no')} />
                              Confirmed as QHC (no auto exclusions, deductible ≤$6,579)
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 2:
        const { eligible, reasons } = determineEligibility();
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Eligible PIP Options</h2>
            </div>

            <WarningBox type="info" title="Eligibility ≠ Recommendation">
              This shows legally available options. The next step helps you understand trade-offs.
            </WarningBox>

            <div className="space-y-3">
              {Object.entries(PIP_OPTIONS).map(([num, opt]) => {
                const n = parseInt(num);
                const isEligible = eligible[n];
                return (
                  <div key={num} className={`p-4 rounded-lg border-2 ${isEligible ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                    <div className="flex items-start gap-3">
                      {isEligible ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <XCircle className="w-5 h-5 text-gray-400 mt-0.5" />}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <span className={`font-semibold ${isEligible ? 'text-green-800' : 'text-gray-500'}`}>Option {num}: {opt.limit}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${isEligible ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                            {isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                          </span>
                        </div>
                        <p className={`text-sm ${isEligible ? 'text-green-700' : 'text-gray-500'}`}>{opt.description}</p>
                        {reasons[n].length > 0 && (
                          <div className={`mt-2 text-xs ${isEligible ? 'text-green-600' : 'text-gray-500'}`}>
                            {reasons[n].map((r, i) => <div key={i}>• {r}</div>)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        const eligibility = determineEligibility();
        const eligibleOptions = Object.entries(PIP_OPTIONS).filter(([num]) => eligibility.eligible[parseInt(num)]);
        const effectiveMembers = getEffectiveHouseholdMembers();
        
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold">Select PIP Coverage</h2>
            </div>

            <WarningBox type="warning" title="Coverage Gaps">{TOOLTIPS.gaps}</WarningBox>

            <div className="space-y-3">
              {eligibleOptions.map(([num, opt]) => {
                const n = parseInt(num);
                return (
                  <label key={num} className={`block p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedOption === n ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-start gap-3">
                      <input type="radio" name="pipOption" checked={selectedOption === n} onChange={() => setSelectedOption(n)} className="mt-1" />
                      <div className="flex-1">
                        <div className="font-bold">Option {num}: {opt.limit}</div>
                        <div className="text-sm text-gray-600">{opt.description}</div>
                        
                        {n === 1 && <div className="text-sm bg-green-100 p-2 rounded mt-2"><strong>Maximum protection.</strong> No risk of exhausting coverage.</div>}
                        {n === 2 && <div className="text-sm bg-blue-100 p-2 rounded mt-2"><strong>Consider:</strong> $500K can be exhausted in severe cases.</div>}
                        {n === 3 && <div className="text-sm bg-amber-100 p-2 rounded mt-2"><strong>Consider:</strong> Attendant care alone can cost $50K-$100K+/year.</div>}
                        {n === 4 && <div className="text-sm bg-red-100 p-2 rounded mt-2"><strong>⚠️ EXCLUSION:</strong> Excluded persons have ZERO PIP medical coverage.</div>}
                        {n === 5 && <div className="text-sm bg-amber-100 p-2 rounded mt-2"><strong>⚠️ MEDICAID:</strong> $50K is the lowest limit. Gap risk if eligibility ends.</div>}
                        {n === 6 && <div className="text-sm bg-red-100 p-2 rounded mt-2"><strong>⚠️ NO PIP:</strong> You accept costs Medicare doesn't cover.</div>}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {selectedOption === 4 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Who should be EXCLUDED?</h3>
                <p className="text-sm text-red-600 mb-3">⚠️ EXCLUDED = NO PIP MEDICAL COVERAGE</p>
                <div className="space-y-2">
                  {niHasQHC && (
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={excludedPersons.includes(namedInsured.name || 'Named Insured')}
                        onChange={e => {
                          const name = namedInsured.name || 'Named Insured';
                          setExcludedPersons(e.target.checked ? [...excludedPersons, name] : excludedPersons.filter(p => p !== name));
                        }} />
                      {namedInsured.name || 'Named Insured'}
                    </label>
                  )}
                  {effectiveMembers.map(m => {
                    const canExclude = m.hasOtherHealth === 'yes' && m.otherHealthIsQHC === 'yes';
                    return (
                      <label key={m.id} className={`flex items-center gap-2 ${!canExclude ? 'opacity-50' : ''}`}>
                        <input type="checkbox" checked={excludedPersons.includes(m.name)} disabled={!canExclude}
                          onChange={e => setExcludedPersons(e.target.checked ? [...excludedPersons, m.name] : excludedPersons.filter(p => p !== m.name))} />
                        {m.name || 'Household Member'}
                        {!canExclude && <span className="text-red-500 text-xs">(No QHC)</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {[2, 3, 4].includes(selectedOption) && niHasQHC && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2"><Tooltip content={TOOLTIPS.qhcVsCoord}>Coordination of Benefits</Tooltip></h3>
                <p className="text-sm text-gray-600 mb-3">Should health insurance pay PRIMARY for auto injuries?</p>
                <RadioGroup name="coordinated" value={namedInsured.wantsCoordinated}
                  onChange={v => setNamedInsured({...namedInsured, wantsCoordinated: v})}
                  options={[
                    { value: 'yes', label: 'Yes - Coordinated', description: 'Health pays first (requires letter)' },
                    { value: 'no', label: 'No - PIP pays first (standard)' }
                  ]} />
              </div>
            )}
          </div>
        );

      case 4:
        const docs = getRequiredDocs();
        const { eligible: elig, reasons: rsns } = determineEligibility();
        const effMembers = getEffectiveHouseholdMembers();
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold">PIP Coverage Summary</h2>
              </div>
              <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm no-print">
                <Printer className="w-4 h-4" /> Print Summary
              </button>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 border-b pb-2">Applicant Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Named Insured:</span>
                  <div className="font-medium">{namedInsured.name || '—'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date of Birth:</span>
                  <div className="font-medium">{namedInsured.dob || '—'}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Coverage Status:</span>
                  <div className="font-medium">
                    {niHasMedicare && 'Medicare Parts A & B'}
                    {niHasMedicaid && (niHasMedicare ? ', ' : '') + 'Medicaid'}
                    {niHasQHC && ((niHasMedicare || niHasMedicaid) ? ', ' : '') + 'Qualified Health Coverage'}
                    {!niHasMedicare && !niHasMedicaid && !niHasQHC && 'No special coverage'}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Household Members:</span>
                  <div className="font-medium">{effMembers.length === 0 ? 'None' : effMembers.length}</div>
                </div>
              </div>
              
              {effMembers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-600 block mb-2">Household:</span>
                  <div className="space-y-1">
                    {effMembers.map((m, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{m.name || `Member ${i+1}`}</span>
                        {m.relationship && <span className="text-gray-500"> ({m.relationship})</span>}
                        {m.dob && <span className="text-gray-500"> - DOB: {m.dob}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 border-b pb-2">Eligible Coverage Options</h3>
              <div className="space-y-3">
                {Object.entries(PIP_OPTIONS).map(([num, opt]) => {
                  const n = parseInt(num);
                  const isEligible = elig[n];
                  const isSelected = selectedOption === n;
                  return (
                    <div key={num} className={`p-3 rounded-lg border-2 ${isSelected ? 'border-blue-500 bg-blue-50' : isEligible ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-60'}`}>
                      <div className="flex items-center gap-2">
                        {isSelected ? <CheckCircle className="w-5 h-5 text-blue-600" /> : isEligible ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-gray-400" />}
                        <span className={`font-semibold ${isSelected ? 'text-blue-800' : isEligible ? 'text-green-800' : 'text-gray-500'}`}>
                          Option {num}: {opt.limit}
                        </span>
                        {isSelected && <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded">SELECTED</span>}
                        {!isSelected && isEligible && <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded">ELIGIBLE</span>}
                      </div>
                      <p className="text-sm text-gray-600 ml-7">{opt.description}</p>
                      {rsns[n].length > 0 && (
                        <div className="text-xs text-gray-500 ml-7 mt-1">
                          {rsns[n].map((r, i) => <span key={i}>{i > 0 ? ' • ' : ''}{r}</span>)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedOption && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3 text-blue-800">Selected: Option {selectedOption} - {PIP_OPTIONS[selectedOption].limit}</h3>
                
                {selectedOption === 4 && excludedPersons.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium text-red-700">Excluded from PIP Medical:</span>
                    <ul className="list-disc ml-6 text-sm text-red-700">
                      {excludedPersons.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                    <p className="text-xs text-red-600 mt-1">⚠️ These persons will have NO PIP medical coverage under this policy.</p>
                  </div>
                )}

                {namedInsured.wantsCoordinated === 'yes' && (
                  <div className="mb-4">
                    <span className="text-sm font-medium">Coordination:</span>
                    <span className="text-sm ml-2">Health insurance pays PRIMARY for auto accident injuries</span>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-3 border-b pb-2">Required Documentation</h3>
              
              {[4, 5, 6].includes(selectedOption) && (
                <WarningBox type="danger" title="Documentation Required at EVERY Renewal">
                  Proof must be provided at issuance AND each renewal. Failure to provide documentation will result in coverage changes and adjusted premium.
                </WarningBox>
              )}

              {[4, 6].includes(selectedOption) && (
                <WarningBox type="warning" title="30-Day Notification Requirement">
                  If anyone loses QHC, you must notify your insurer within 30 days. Failure to obtain replacement coverage within 30 days means NO PIP medical benefits.
                </WarningBox>
              )}

              {docs.length === 0 ? (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded">
                  <CheckCircle className="w-5 h-5" />
                  <span>No special documentation required for this option.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {docs.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded border">
                      <input type="checkbox" className="mt-1" />
                      <div>
                        <div className="font-medium">{d.doc}</div>
                        <div className="text-sm text-gray-600">{d.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedOption === 6 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <h3 className="font-bold text-red-800 mb-2">Medicare Coverage Gaps Acknowledgment</h3>
                <p className="text-sm text-red-700 mb-3">By opting out of PIP medical, the applicant acknowledges Medicare typically does NOT cover:</p>
                <ul className="text-sm text-red-700 space-y-1 ml-4">
                  <li>• Transportation to/from medical appointments</li>
                  <li>• Vehicle modifications for disability</li>
                  <li>• Attendant care services</li>
                  <li>• Family-provided care compensation (up to 56 hrs/wk)</li>
                  <li>• Long-term custodial care</li>
                  <li>• Case management services</li>
                  <li>• Home accessibility modifications</li>
                </ul>
              </div>
            )}

            <div className="text-xs text-gray-500 p-4 bg-gray-50 rounded border">
              <strong>DISCLAIMER:</strong> This summary is for informational purposes only and does not constitute insurance or legal advice. 
              Coverage eligibility is subject to carrier underwriting and verification of all documentation. 
              The official DIFS PIP Selection Form must be completed and signed for coverage to be bound.
              Consumers should review their specific situation with a licensed insurance professional.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canAdvance = () => {
    switch(step) {
      case 0:
        return namedInsured.name && namedInsured.hasMedicareA && namedInsured.hasMedicareB && 
          namedInsured.hasMedicaid !== null && namedInsured.hasOtherHealth !== null;
      case 1:
        if (hasHouseholdMembers === null) return false;
        if (hasHouseholdMembers === 'no') return true;
        if (householdMembers.length === 0) return false;
        if (allSameHealth === null) return false;
        if (allSameHealth === false) return true;
        return true;
      case 2:
        return true;
      case 3:
        return selectedOption !== null;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-blue-900 text-white p-4 rounded-t-xl">
          <h1 className="text-xl font-bold">Michigan PIP Coverage Advisor</h1>
          <p className="text-blue-200 text-sm">Personal Injury Protection Eligibility & Selection Tool</p>
        </div>
        
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          {!showMedicareInterstitial && <StepIndicator currentStep={step} steps={steps} />}
          
          {renderStep()}

          {!showMedicareInterstitial && (
            <div className="flex justify-between mt-8 pt-4 border-t no-print">
              <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                className={`px-6 py-2 rounded-lg ${step === 0 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}>
                ← Back
              </button>
              
              {step < 4 ? (
                <button onClick={handleNextStep} disabled={!canAdvance()}
                  className={`px-6 py-2 rounded-lg ${canAdvance() ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400'}`}>
                  Continue →
                </button>
              ) : (
                <button onClick={() => { setStep(0); setSelectedOption(null); setExcludedPersons([]); }}
                  className="px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700">
                  Start Over
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-gray-500 no-print">
          Based on Michigan DIFS regulations • For professional use • Not insurance or legal advice
        </div>
      </div>
    </div>
  );
}
