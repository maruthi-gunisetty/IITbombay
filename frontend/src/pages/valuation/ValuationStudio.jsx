import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calculator, Sparkles, TrendingUp, ShieldCheck, FileCheck2,
  AlertCircle, RefreshCw, ArrowRight, BarChart2, Layers
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { valuationAPI, reportsAPI } from '../../services/api';

const ValuationStudio = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    city: 'Mumbai',
    locality: 'worli',
    property_type: 'Penthouse',
    land_area_sqft: 2800,
    built_up_area_sqft: 2400,
    bedrooms: 4,
    bathrooms: 4,
    property_age_years: 3,
    construction_quality: 'Premium',
    property_condition: 'Excellent',
    parking_spaces: 2,
    amenities: ['Clubhouse', 'Gym', 'Sea View Deck', 'Power Backup']
  });

  const [loading, setLoading] = useState(false);
  const [valuationResult, setValuationResult] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handlePredict = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await valuationAPI.predict(formData);
      setValuationResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Valuation calculation failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!valuationResult) return;
    setGeneratingReport(true);
    try {
      const res = await reportsAPI.generate({
        report_type: 'Property Valuation Report',
        title: `Valuation Dossier: ${formData.locality.toUpperCase()}, ${formData.city.toUpperCase()}`,
        summary: `Automated ML valuation estimate computed at INR ${valuationResult.estimated_value.toLocaleString()} (${valuationResult.price_per_sqft} / sqft) with ${valuationResult.confidence_score * 100}% confidence interval.`,
        details: {
          locality: formData.locality,
          city: formData.city,
          property_type: formData.property_type,
          built_up_area_sqft: formData.built_up_area_sqft,
          estimated_value: `INR ${valuationResult.estimated_value.toLocaleString()}`,
          price_per_sqft: `INR ${valuationResult.price_per_sqft}`,
          lower_bound: `INR ${valuationResult.lower_bound.toLocaleString()}`,
          upper_bound: `INR ${valuationResult.upper_bound.toLocaleString()}`,
          model_version: valuationResult.model_version
        }
      });
      navigate('/dashboard/reports');
    } catch (err) {
      alert('Report generation failed: ' + err.message);
    } finally {
      setGeneratingReport(false);
    }
  };

  // Prepare Feature Contributions chart data
  const contributionData = valuationResult
    ? Object.entries(valuationResult.feature_contributions || {}).map(([key, val]) => ({
        feature: key,
        value: val,
        isPositive: val >= 0
      }))
    : [];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">AI Property Valuation Studio</h2>
        <p className="text-xs text-[#475569]">
          Execute multi-parameter automated valuation model (AVM) with explainable SHAP-style factor contributions and uncertainty bounds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Parameters Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E2E8F0]">
            <Calculator className="w-5 h-5 text-[#3978F6]" />
            <h3 className="text-sm font-bold text-[#0F172A]">Asset Appraisal Parameters</h3>
          </div>

          <form onSubmit={handlePredict} className="space-y-3.5 text-xs">
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">City</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Locality</label>
                <select
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                >
                  <option value="worli">Worli</option>
                  <option value="bandra west">Bandra West</option>
                  <option value="powai">Powai</option>
                  <option value="indiranagar">Indiranagar</option>
                  <option value="koramangala">Koramangala</option>
                  <option value="whitefield">Whitefield</option>
                  <option value="hitec city">Hitec City</option>
                  <option value="kothrud">Kothrud</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Property Category</label>
                <select
                  value={formData.property_type}
                  onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                >
                  <option value="Penthouse">Penthouse</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Built-up Area (sqft)</label>
                <input
                  type="number"
                  value={formData.built_up_area_sqft}
                  onChange={(e) => setFormData({ ...formData, built_up_area_sqft: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={formData.property_age_years}
                  onChange={(e) => setFormData({ ...formData, property_age_years: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Construction Grade</label>
                <select
                  value={formData.construction_quality}
                  onChange={(e) => setFormData({ ...formData, construction_quality: e.target.value })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                >
                  <option value="Premium">Premium</option>
                  <option value="A Grade">A Grade</option>
                  <option value="Standard">Standard</option>
                  <option value="Economy">Economy</option>
                </select>
              </div>
              <div>
                <label className="block text-[#0F172A] font-semibold mb-1">Physical Condition</label>
                <select
                  value={formData.property_condition}
                  onChange={(e) => setFormData({ ...formData, property_condition: e.target.value })}
                  className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl px-3 py-2 text-[#0F172A] focus:outline-none focus:border-[#3978F6]"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Renovation">Needs Renovation</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#3978F6] hover:bg-[#2457C5] text-white font-bold text-xs tracking-wide transition-all duration-200 shadow-lg shadow-[#3978F6]/25 disabled:opacity-50 flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Multi-Factor Regression...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate AI Valuation</span>
                </>
              )}
            </button>

          </form>

        </div>

        {/* Results & Explainability Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {!valuationResult ? (
            <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center text-[#3978F6] mb-4">
                <Calculator className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">Awaiting Input Parameters</h3>
              <p className="text-xs text-[#475569] max-w-sm mt-1 leading-relaxed">
                Configure property dimensions, locality benchmark, and quality parameters on the left to trigger the valuation regression engine.
              </p>
              <button
                onClick={handlePredict}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#3978F6] text-white text-xs font-semibold"
              >
                Run Sample Valuation
              </button>
            </div>
          ) : (
            <>
              {/* Valuation Summary Card */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
                  <div>
                    <span className="text-[10px] text-[#0284C7] uppercase tracking-wider font-semibold">
                      {valuationResult.model_version} • {valuationResult.model_mode}
                    </span>
                    <h3 className="text-xs font-bold text-[#475569]">Estimated Collateral Asset Valuation</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#059669]/15 border border-[#059669]/30 text-[10px] font-bold text-[#059669]">
                      {Math.round(valuationResult.confidence_score * 100)}% Model Confidence
                    </span>
                  </div>
                </div>

                <div className="py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl sm:text-4xl font-black text-[#059669] tracking-tight">
                      INR {(valuationResult.estimated_value / 10000000).toFixed(2)} Cr
                    </div>
                    <div className="text-xs text-[#475569] mt-1">
                      Unit Rate: <strong className="text-[#0F172A]">INR {valuationResult.price_per_sqft.toLocaleString()} / sqft</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Prudent Lower Bound:</span>
                      <span className="font-semibold text-[#0F172A]">INR {(valuationResult.lower_bound / 10000000).toFixed(2)} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#475569]">Upper Market Bound:</span>
                      <span className="font-semibold text-[#0F172A]">INR {(valuationResult.upper_bound / 10000000).toFixed(2)} Cr</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-[#475569]">
                    Evaluation Timestamp: {new Date(valuationResult.valuation_timestamp || Date.now()).toLocaleDateString()}
                  </div>
                  <button
                    onClick={handleGenerateReport}
                    disabled={generatingReport}
                    className="px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#059669]/80 text-[#F8FAFC] font-bold text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>{generatingReport ? 'Generating Dossier...' : 'Generate PDF Report'}</span>
                  </button>
                </div>
              </div>

              {/* Explainability Breakdown (SHAP-style Feature Contributions) */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">Explainable Feature Attribution (SHAP-style)</h3>
                    <p className="text-[11px] text-[#475569]">Incremental valuation impact attributed to individual physical and locality parameters</p>
                  </div>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={contributionData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                      <XAxis type="number" stroke="#475569" fontSize={10} tickFormatter={(v) => `INR ${(v / 100000).toFixed(0)}L`} />
                      <YAxis type="category" dataKey="feature" stroke="#475569" fontSize={10} tickLine={false} width={120} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#F1F5F9', borderColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px' }}
                        formatter={(val) => [`INR ${Number(val).toLocaleString()}`, 'Attribution Impact']}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {contributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isPositive ? '#3978F6' : '#DC2626'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569] flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span>
                    Transparent Attribution Notice: Locality base rates account for baseline collateral valuation; quality and condition multipliers apply calibrated non-linear premiums.
                  </span>
                </div>
              </div>

              {/* Comparable Sales */}
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-2xl p-6 shadow-xl space-y-3">
                <h3 className="text-sm font-bold text-[#0F172A]">Recent Local Cluster Comparables</h3>
                <div className="divide-y divide-[#E2E8F0]">
                  {(valuationResult.comparable_sales || []).map((c, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-[#0F172A] block">{c.reference} ({c.locality})</span>
                        <span className="text-[10px] text-[#475569]">{c.area_sqft} sqft • {c.sale_date}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#059669] block">INR {(c.sold_price / 10000000).toFixed(2)} Cr</span>
                        <span className="text-[10px] text-[#0284C7]">Match: {c.similarity_score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
};

export default ValuationStudio;
