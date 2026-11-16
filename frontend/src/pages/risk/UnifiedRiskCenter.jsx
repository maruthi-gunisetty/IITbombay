import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertCircle, RefreshCw, BarChart2,
  FileCheck2, Sliders, CheckCircle2, ChevronRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { riskAPI } from '../../services/api';

const UnifiedRiskCenter = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Simulator state
  const [simDTI, setSimDTI] = useState(42);
  const [simLTV, setSimLTV] = useState(65);
  const [simAge, setSimAge] = useState(3);
  const [simCondition, setSimCondition] = useState('Excellent');
  const [simCredit, setSimCredit] = useState(780);
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const res = await riskAPI.list();
        setAssessments(res.data || []);
        if (res.data?.length > 0) {
          setSelectedAssessment(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
    runSimulation();
  }, []);

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const res = await riskAPI.analyze({
        property_data: {
          property_age_years: simAge,
          property_condition: simCondition,
          construction_quality: "Premium"
        },
        borrower_data: {
          debt_to_income_ratio: simDTI,
          loan_to_value_ratio: simLTV,
          credit_score: simCredit
        }
      });
      setSimResult(res.data);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  const currentDisplay = selectedAssessment || simResult;

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'Low':
        return 'bg-[#059669]/15 text-[#059669] border-[#059669]/40';
      case 'Moderate':
        return 'bg-[#3978F6]/15 text-[#3978F6] border-[#3978F6]/40';
      case 'High':
        return 'bg-[#D97706]/15 text-[#D97706] border-[#D97706]/40';
      case 'Critical':
        return 'bg-[#DC2626]/15 text-[#DC2626] border-[#DC2626]/40';
      default:
        return 'bg-[#475569]/15 text-[#475569] border-[#475569]/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Unified Risk Intelligence</h2>
        <p className="text-xs text-[#475569]">
          Decoupled evaluation of Collateral Asset Risk (45%) versus Borrower Capacity Risk (55%) with explainable policy attribution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Risk Matrix Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {currentDisplay && (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] text-[#0284C7] uppercase tracking-wider font-semibold">
                    {currentDisplay.model_version || 'PropWise-RiskPolicy-v3.1'}
                  </span>
                  <h3 className="text-sm font-bold text-[#0F172A]">Decoupled Credit & Collateral Risk Vectors</h3>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-bold ${getCategoryBadge(currentDisplay.risk_category)}`}>
                  {currentDisplay.risk_category} Risk Category
                </div>
              </div>

              {/* Two Decoupled Risk Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#475569] uppercase block font-medium">Collateral Asset Risk</span>
                  <div className="text-2xl font-black text-[#0284C7]">
                    {currentDisplay.property_risk_score} <span className="text-xs text-[#475569]">/ 100</span>
                  </div>
                  <span className="text-[10px] text-[#059669] block">Weight: 45%</span>
                </div>

                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] text-[#475569] uppercase block font-medium">Borrower Repayment Risk</span>
                  <div className="text-2xl font-black text-[#3978F6]">
                    {currentDisplay.borrower_risk_score} <span className="text-xs text-[#475569]">/ 100</span>
                  </div>
                  <span className="text-[10px] text-[#059669] block">Weight: 55%</span>
                </div>

                <div className="p-4 bg-[#F1F5F9] rounded-xl border border-[#3978F6]/40 space-y-1">
                  <span className="text-[10px] text-[#475569] uppercase block font-medium">Composite Risk Score</span>
                  <div className="text-2xl font-black text-[#059669]">
                    {currentDisplay.overall_risk_score} <span className="text-xs text-[#475569]">/ 100</span>
                  </div>
                  <span className="text-[10px] text-[#0284C7] block">Policy Calibrated</span>
                </div>

              </div>

              {/* Recommendation Box */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-1.5">
                <span className="text-xs font-bold text-[#0F172A] block">Decision Support Recommendation:</span>
                <p className="leading-relaxed">{currentDisplay.recommendation}</p>
              </div>

              {/* Key Factors List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#0F172A] block">Observed Underwriting Risk Factors:</span>
                <ul className="space-y-1.5 text-xs text-[#475569]">
                  {(currentDisplay.key_risk_factors || []).map((factor, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <ChevronRight className="w-3.5 h-3.5 text-[#3978F6] flex-shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* Historical Assessment Dossiers */}
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Recorded Institutional Risk Dossiers ({assessments.length})
            </h3>
            <div className="divide-y divide-[#E2E8F0]">
              {assessments.length === 0 ? (
                <p className="text-xs text-[#475569] py-4 text-center">No assessments in portfolio.</p>
              ) : (
                assessments.map(a => (
                  <div
                    key={a.id}
                    onClick={() => setSelectedAssessment(a)}
                    className={`py-3 flex items-center justify-between cursor-pointer px-2 rounded-lg transition-colors ${
                      selectedAssessment?.id === a.id ? 'bg-[#F1F5F9]' : 'hover:bg-[#F1F5F9]/50'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0F172A]">Risk Dossier #{a.id}</span>
                      <p className="text-[10px] text-[#475569] mt-0.5">Overall Score: {a.overall_risk_score} / 100</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadge(a.risk_category)}`}>
                      {a.risk_category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Live Risk Policy Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#0284C7]" />
              <h3 className="text-sm font-bold text-[#0F172A]">Dynamic Policy Simulator</h3>
            </div>
            <button
              onClick={runSimulation}
              disabled={simulating}
              className="text-xs text-[#3978F6] hover:text-[#0284C7] flex items-center space-x-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
              <span>Recalculate</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            
            <div>
              <div className="flex justify-between text-[#0F172A] mb-1">
                <span>Debt-to-Income (DTI) Ratio</span>
                <span className="font-bold text-[#0284C7]">{simDTI}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                value={simDTI}
                onChange={(e) => {
                  setSimDTI(parseInt(e.target.value));
                  runSimulation();
                }}
                className="w-full accent-[#3978F6]"
              />
              <span className="text-[10px] text-[#475569] block mt-0.5">Benchmark limit: 45.0%</span>
            </div>

            <div>
              <div className="flex justify-between text-[#0F172A] mb-1">
                <span>Loan-to-Value (LTV) Ratio</span>
                <span className="font-bold text-[#0284C7]">{simLTV}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                value={simLTV}
                onChange={(e) => {
                  setSimLTV(parseInt(e.target.value));
                  runSimulation();
                }}
                className="w-full accent-[#3978F6]"
              />
              <span className="text-[10px] text-[#475569] block mt-0.5">Regulatory ceiling: 80.0%</span>
            </div>

            <div>
              <div className="flex justify-between text-[#0F172A] mb-1">
                <span>Borrower Credit Bureau Score</span>
                <span className="font-bold text-[#059669]">{simCredit}</span>
              </div>
              <input
                type="range"
                min="550"
                max="850"
                value={simCredit}
                onChange={(e) => {
                  setSimCredit(parseInt(e.target.value));
                  runSimulation();
                }}
                className="w-full accent-[#059669]"
              />
              <span className="text-[10px] text-[#475569] block mt-0.5">Prime grade benchmark: 750+</span>
            </div>

            <div>
              <div className="flex justify-between text-[#0F172A] mb-1">
                <span>Collateral Asset Age</span>
                <span className="font-bold text-[#D97706]">{simAge} Years</span>
              </div>
              <input
                type="range"
                min="0"
                max="35"
                value={simAge}
                onChange={(e) => {
                  setSimAge(parseInt(e.target.value));
                  runSimulation();
                }}
                className="w-full accent-[#D97706]"
              />
            </div>

            <div>
              <label className="block text-[#0F172A] font-semibold mb-1">Physical Asset Condition</label>
              <select
                value={simCondition}
                onChange={(e) => {
                  setSimCondition(e.target.value);
                  runSimulation();
                }}
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A]"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Needs Renovation">Needs Renovation</option>
              </select>
            </div>

          </div>

          {/* Simulation Output Card */}
          {simResult && (
            <div className="p-4 rounded-xl bg-[#F1F5F9] border border-[#3978F6]/40 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Simulated Risk Result:</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadge(simResult.risk_category)}`}>
                  {simResult.risk_category}
                </span>
              </div>
              <div className="text-xl font-black text-[#0F172A]">
                {simResult.overall_risk_score} <span className="text-xs text-[#475569]">/ 100</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default UnifiedRiskCenter;
