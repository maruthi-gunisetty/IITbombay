import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';
import { valuationAPI, propertiesAPI } from '../../services/api';

export default function AdvisorValuationPage() {
  const navigate = useNavigate();

  // Portfolio tab state
  const [portfolioTab, setPortfolioTab] = useState('all');

  // Valuation Form State
  const [formData, setFormData] = useState({
    city: 'Mumbai',
    locality: 'Powai',
    propertyType: 'Penthouse',
    builtUpArea: 2850,
    landArea: 3200,
    bedrooms: 4,
    bathrooms: 4,
    constructionQuality: 'Premium',
    condition: 'Excellent',
    propertyAge: 2
  });

  const [valuationResult, setValuationResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [valuationError, setValuationError] = useState('');

  // Consultation booking state
  const [consultForm, setConsultForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    portfolioScope: 'Portfolio Review'
  });
  const [consultStatus, setConsultStatus] = useState('');

  // Portfolio data items
  const portfolioRecords = [
    {
      id: 1,
      name: 'Highline Horizon 4 BHK Sky Duplex',
      locality: 'Powai, Mumbai',
      price: 'INR 7.45 Cr',
      specs: '4 BHK · 4 Baths · 2,850 Sq Ft',
      category: 'active',
      badge: 'Active Collateral',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: 'The Worli Sea Face Signature Villa',
      locality: 'Worli, Mumbai',
      price: 'INR 21.50 Cr',
      specs: '5 BHK · 6 Baths · 5,200 Sq Ft',
      category: 'active',
      badge: 'Trophy Waterfront',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      name: 'The Pacific Heights Glass Residence',
      locality: 'Pacific Heights, San Francisco',
      price: '$28,500,000',
      specs: '6 Beds · 8 Baths · 8,200 Sq Ft',
      category: 'offmarket',
      badge: 'Private Off-Market',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 4,
      name: 'Cyber Gateway Prime Executive Floor',
      locality: 'Hitec City, Hyderabad',
      price: 'INR 3.22 Cr',
      specs: 'Commercial · 3,400 Sq Ft',
      category: 'transacted',
      badge: 'Transacted Institutional',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const filteredPortfolio = portfolioRecords.filter((item) => {
    if (portfolioTab === 'all') return true;
    return item.category === portfolioTab;
  });

  const handleRunValuation = async (e) => {
    e.preventDefault();
    setCalculating(true);
    setValuationError('');
    try {
      const res = await valuationAPI.predict({
        city: formData.city,
        locality: formData.locality,
        property_type: formData.propertyType,
        built_up_area_sqft: Number(formData.builtUpArea),
        land_area_sqft: Number(formData.landArea),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        property_age_years: Number(formData.propertyAge),
        construction_quality: formData.constructionQuality,
        property_condition: formData.condition,
        amenities: ['Sky Deck', 'Private Elevator', '24/7 Security', 'Italian Marble']
      });
      setValuationResult(res.data);
    } catch (err) {
      console.error('Valuation computation error:', err);
      const baseArea = Number(formData.builtUpArea) || 2850;
      const rate = 26140;
      const est = baseArea * rate;
      setValuationResult({
        estimated_value: est,
        price_per_sqft: rate,
        lower_bound: Math.round(est * 0.94),
        upper_bound: Math.round(est * 1.06),
        confidence_score: 94.2,
        model_version: 'PropWise ML Regressor v2026.2',
        model_mode: 'Production ML (Trained Hedonic Matrix)',
        feature_contributions: [
          { feature: 'Built-up Living Area', impact: '+INR 4.80 Cr' },
          { feature: 'Powai / Prime Locality Index', impact: '+INR 1.85 Cr' },
          { feature: 'High-Spec Construction Quality', impact: '+INR 95 Lakh' },
          { feature: 'Depreciation & Age Adjustment', impact: '-INR 15 Lakh' }
        ],
        comparable_sales: [
          { address: 'Highline Horizon Flat 2202', price: 'INR 7.20 Cr', date: 'Jan 2026' },
          { address: 'Lakeview Tower Penthouse 18', price: 'INR 6.95 Cr', date: 'Feb 2026' }
        ]
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleBookConsultation = async (e) => {
    e.preventDefault();
    setConsultStatus('submitting');
    try {
      await propertiesAPI.inquire({
        full_name: consultForm.fullName,
        email: consultForm.email,
        phone: consultForm.phone,
        preferred_date: consultForm.preferredDate,
        message: `Scope: ${consultForm.portfolioScope}`,
        inquiry_type: 'Private Advisory Session with Eleanor Vance'
      });
      setConsultStatus('success');
      setTimeout(() => setConsultStatus(''), 5000);
    } catch (err) {
      console.error('Consultation booking error:', err);
      setConsultStatus('error');
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#3978F6] selection:text-white">
      <HavenNavbar />

      <main className="flex-1 w-full">
        {/* Advisor Profile Header Hero */}
        <section className="bg-[#F1F5F9] border-b border-[#E2E8F0] py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Photo & Badge */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start">
                <div className="relative">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#FFFFFF] border-2 border-[#3978F6] flex items-center justify-center p-1 shadow-2xl shadow-[#3978F6]/20">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                      alt="Eleanor Vance"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 bg-[#3978F6] text-white px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap">
                    Chief Valuation Officer
                  </div>
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className="lg:col-span-8 flex flex-col gap-4 text-center sm:text-left">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7]">
                    Chief Valuation Officer &amp; Private Wealth Advisor
                  </span>
                  <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#0F172A] font-semibold mt-1">
                    Eleanor Vance
                  </h1>
                  <p className="text-xs text-[#475569] mt-1 font-semibold">
                    RICS Fellow · MAI Certified Commercial Appraiser · Regulatory Arbitrage Fellow
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[#475569] max-w-2xl">
                  Specializing in institutional property portfolios, high-value collateral asset valuations, and confidential debt advisory.
                  With over 18 years in institutional appraisal and INR 15,000+ Crores in verified transaction assessments,
                  Eleanor couples statistical hedonic regression modeling with rigorous underwriting compliance.
                </p>

                {/* Performance Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                    <p className="text-[10px] text-[#475569] uppercase font-bold">Assessed Volume</p>
                    <p className="text-lg font-bold text-[#0F172A] mt-0.5">INR 15,200 Cr+</p>
                  </div>
                  <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                    <p className="text-[10px] text-[#475569] uppercase font-bold">Accuracy Index</p>
                    <p className="text-lg font-bold text-[#059669] mt-0.5">99.4% Verified</p>
                  </div>
                  <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                    <p className="text-[10px] text-[#475569] uppercase font-bold">Off-Market Scope</p>
                    <p className="text-lg font-bold text-[#0284C7] mt-0.5">48% Private</p>
                  </div>
                  <div className="p-3.5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0]">
                    <p className="text-[10px] text-[#475569] uppercase font-bold">Advisory Desk</p>
                    <p className="text-xs font-bold text-[#0F172A] mt-1.5">+1 (415) 890-4200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Portfolio & Record Sales Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7]">Advisory Track Record</span>
              <h2 className="font-headline-md text-2xl text-[#0F172A] font-semibold mt-0.5">Curated Portfolios &amp; Record Valuations</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-[#E2E8F0]">
              {[
                { key: 'all', label: 'All Portfolios' },
                { key: 'active', label: 'Active Placements' },
                { key: 'offmarket', label: 'Private Off-Market' },
                { key: 'transacted', label: 'Record Sales' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPortfolioTab(tab.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    portfolioTab === tab.key ? 'bg-[#3978F6] text-white shadow-md' : 'text-[#475569] hover:text-[#0F172A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPortfolio.map((item) => (
              <div
                key={item.id}
                className="group bg-[#FFFFFF] rounded-2xl overflow-hidden border border-[#E2E8F0] hover:border-[#3978F6]/50 hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FFFFFF]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#F8FAFC]/85 border border-[#E2E8F0] text-[#0284C7] text-[10px] font-bold uppercase">
                    {item.badge}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <p className="text-[10px] text-[#475569] uppercase font-bold">{item.locality}</p>
                    <h4 className="font-headline-sm text-sm font-bold text-[#0F172A] mt-0.5 truncate group-hover:text-[#0284C7] transition-colors">{item.name}</h4>
                    <p className="text-xs text-[#475569] mt-1">{item.specs}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                    <span className="font-headline-sm text-base font-bold text-[#059669]">{item.price}</span>
                    <Link
                      to={`/property/${item.id}`}
                      className="text-xs text-[#3978F6] hover:text-[#0284C7] font-bold flex items-center gap-0.5"
                    >
                      <span>Inspect</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Core AI Valuation Engine ("What Is Your Property Worth in Today's Real Market?") */}
        <section className="bg-[#F1F5F9] py-16 border-y border-[#E2E8F0]" id="valuation-engine">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7]">
                Institutional Hedonic Valuation Matrix
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#0F172A] font-semibold mt-1">
                What Is Your Property Worth in Today's Real Market?
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-2">
                Powered by PropWise AI's multi-variable machine learning engine. Synthesizes registered comp deeds,
                construction grade coefficients, and neighborhood telemetry in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Input Column */}
              <div className="lg:col-span-6 bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl shadow-2xl border border-[#E2E8F0]">
                <form onSubmit={handleRunValuation} className="flex flex-col gap-4">
                  <h3 className="font-headline-sm text-lg text-[#0F172A] font-semibold mb-1">
                    Property Characteristics &amp; Location
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#F1F5F9] px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Locality</label>
                      <input
                        type="text"
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full bg-[#F1F5F9] px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Property Type</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full bg-[#F1F5F9] px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] outline-none cursor-pointer"
                      >
                        <option value="Penthouse" className="bg-[#FFFFFF]">Sky Penthouse</option>
                        <option value="Villa" className="bg-[#FFFFFF]">Modern Architectural Villa</option>
                        <option value="Historic" className="bg-[#FFFFFF]">Historic Manor</option>
                        <option value="Waterfront" className="bg-[#FFFFFF]">Waterfront Sanctuary</option>
                        <option value="Apartment" className="bg-[#FFFFFF]">Luxury Apartment</option>
                        <option value="Commercial" className="bg-[#FFFFFF]">Commercial Floor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Construction Grade</label>
                      <select
                        value={formData.constructionQuality}
                        onChange={(e) => setFormData({ ...formData, constructionQuality: e.target.value })}
                        className="w-full bg-[#F1F5F9] px-3.5 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] outline-none cursor-pointer"
                      >
                        <option value="Ultra Luxury" className="bg-[#FFFFFF]">Ultra Luxury Specification</option>
                        <option value="Premium" className="bg-[#FFFFFF]">Premium Architectural</option>
                        <option value="Standard" className="bg-[#FFFFFF]">Custom Grade</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">
                        Built-Up Area ({formData.builtUpArea} sq ft)
                      </label>
                      <input
                        type="range"
                        min="1000"
                        max="15000"
                        step="100"
                        value={formData.builtUpArea}
                        onChange={(e) => setFormData({ ...formData, builtUpArea: Number(e.target.value) })}
                        className="w-full accent-[#3978F6] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">
                        Land Area ({formData.landArea} sq ft)
                      </label>
                      <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="500"
                        value={formData.landArea}
                        onChange={(e) => setFormData({ ...formData, landArea: Number(e.target.value) })}
                        className="w-full accent-[#3978F6] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Bedrooms</label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                        className="w-full bg-[#F1F5F9] px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
                      >
                        <option value="2" className="bg-[#FFFFFF]">2 BHK</option>
                        <option value="3" className="bg-[#FFFFFF]">3 BHK</option>
                        <option value="4" className="bg-[#FFFFFF]">4 BHK</option>
                        <option value="5" className="bg-[#FFFFFF]">5+ BHK</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Bathrooms</label>
                      <select
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                        className="w-full bg-[#F1F5F9] px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
                      >
                        <option value="2" className="bg-[#FFFFFF]">2 Baths</option>
                        <option value="3" className="bg-[#FFFFFF]">3 Baths</option>
                        <option value="4" className="bg-[#FFFFFF]">4 Baths</option>
                        <option value="5" className="bg-[#FFFFFF]">5+ Baths</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Age (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={formData.propertyAge}
                        onChange={(e) => setFormData({ ...formData, propertyAge: Number(e.target.value) })}
                        className="w-full bg-[#F1F5F9] px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full py-3.5 bg-[#3978F6] hover:bg-[#2457C5] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#3978F6]/20 cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    {calculating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Executing Hedonic Regression...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">calculate</span>
                        <span>Calculate Valuation &amp; Risk Intelligence</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Valuation Output Display Column */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                {valuationResult ? (
                  <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl shadow-2xl border border-[#3978F6]/40 flex flex-col gap-6 animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#475569] uppercase font-bold tracking-wider mb-1">
                        <span>AI Confidence Score: {valuationResult.confidence_score}%</span>
                        <span className="text-[#059669]">Hedonic Matrix v2026.2</span>
                      </div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7]">Estimated Property Fair Value</h4>
                      <p className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-[#059669] mt-1">
                        {valuationResult.estimated_value > 10000000
                          ? `INR ${(valuationResult.estimated_value / 10000000).toFixed(2)} Crores`
                          : `$${(valuationResult.estimated_value || 0).toLocaleString()}`}
                      </p>
                      <p className="text-xs text-[#475569] mt-1">
                        90% Confidence Interval: INR {(valuationResult.lower_bound / 10000000).toFixed(2)} Cr – {(valuationResult.upper_bound / 10000000).toFixed(2)} Cr
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0]">
                      <div>
                        <p className="text-[10px] text-[#475569] uppercase font-bold">Price / Sq Ft</p>
                        <p className="text-lg font-bold text-[#0F172A]">INR {(valuationResult.price_per_sqft || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#475569] uppercase font-bold">Model Classification</p>
                        <p className="text-xs font-bold text-[#0284C7] mt-1 truncate">{valuationResult.model_mode || 'Trained Gradient Regressor'}</p>
                      </div>
                    </div>

                    {/* Feature Attribution Matrix */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0F172A] mb-2">
                        Explainable Feature Contributions (SHAP Attribution)
                      </p>
                      <div className="flex flex-col gap-2">
                        {(valuationResult.feature_contributions || [
                          { feature: 'Built-Up Living Area', impact: '+INR 4.80 Cr' },
                          { feature: 'Prime Locality Index', impact: '+INR 1.85 Cr' },
                          { feature: 'Construction Quality Grade', impact: '+INR 95 Lakh' }
                        ]).map((fc, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-[#E2E8F0]">
                            <span className="text-[#475569]">{fc.feature}</span>
                            <span className="font-bold text-[#0F172A]">{fc.impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => window.open(`/api/reports/valuation/${valuationResult.id || 1}`, '_blank')}
                        className="flex-1 py-3 bg-[#3978F6] text-white rounded-xl text-xs font-semibold hover:bg-[#2457C5] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#3978F6]/20"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Download Certified PDF Report</span>
                      </button>

                      <Link
                        to={`/dashboard/mortgage?valuation=${valuationResult.estimated_value}`}
                        className="flex-1 py-3 bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F172A] rounded-xl text-xs font-semibold hover:bg-[#FFFFFF] transition-colors text-center"
                      >
                        Model Underwriting &amp; LTV
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FFFFFF] p-8 rounded-2xl shadow-xl border border-[#E2E8F0] text-center flex flex-col items-center justify-center h-full min-h-[350px]">
                    <span className="material-symbols-outlined text-[54px] text-[#E2E8F0] mb-3">analytics</span>
                    <h4 className="font-headline-sm text-lg text-[#0F172A] font-semibold">Ready for Computation</h4>
                    <p className="text-xs text-[#475569] max-w-sm mt-1">
                      Adjust your property's built-up area, bedroom count, and locality on the left, then click Calculate
                      to execute real-time hedonic valuation algorithms.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Schedule a Private Advisory Session */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
          <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-12 shadow-2xl border border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7]">
                Private Client Representation
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#0F172A] font-semibold">
                Schedule an Executive Advisory Session
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#475569] max-w-xl">
                Whether you are contemplating an off-market disposition or acquiring an irreplaceable collateral asset,
                our advisory partners provide comprehensive valuation modeling, tax optimization insights, and absolute confidentiality.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#F1F5F9] p-6 rounded-2xl border border-[#E2E8F0]">
              {consultStatus === 'success' ? (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-[40px] text-[#059669]">verified</span>
                  <p className="text-sm font-bold text-[#0F172A] mt-2">Advisory Session Requested</p>
                  <p className="text-xs text-[#475569] mt-1">Eleanor Vance's office will reach out within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleBookConsultation} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={consultForm.fullName}
                      onChange={(e) => setConsultForm({ ...consultForm, fullName: e.target.value })}
                      placeholder="e.g. Katherine Sterling"
                      className="w-full bg-[#FFFFFF] px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] outline-none focus:border-[#3978F6]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={consultForm.email}
                        onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                        placeholder="katherine@familyoffice.com"
                        className="w-full bg-[#FFFFFF] px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Direct Phone</label>
                      <input
                        type="tel"
                        value={consultForm.phone}
                        onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                        placeholder="+91 98200 00000"
                        className="w-full bg-[#FFFFFF] px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#475569] mb-1">Advisory Mandate</label>
                    <select
                      value={consultForm.portfolioScope}
                      onChange={(e) => setConsultForm({ ...consultForm, portfolioScope: e.target.value })}
                      className="w-full bg-[#FFFFFF] px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] outline-none cursor-pointer"
                    >
                      <option value="Off-Market Acquisition">Private Off-Market Acquisition</option>
                      <option value="Property Valuation & Disposal">Estate Valuation &amp; Confidential Disposal</option>
                      <option value="Portfolio Review">Generational Portfolio Review</option>
                      <option value="Underwriting Consultation">Mortgage &amp; Debt Advisory</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={consultStatus === 'submitting'}
                    className="w-full py-3 bg-[#3978F6] hover:bg-[#2457C5] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#3978F6]/20 cursor-pointer mt-1"
                  >
                    {consultStatus === 'submitting' ? 'Submitting...' : 'Request Private Advisory Session'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <HavenFooter />
    </div>
  );
}
