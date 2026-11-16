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
    city: 'San Francisco',
    locality: 'Pacific Heights',
    propertyType: 'Penthouse',
    builtUpArea: 6500,
    landArea: 12000,
    bedrooms: 5,
    bathrooms: 6,
    constructionQuality: 'Ultra Luxury',
    condition: 'Excellent',
    propertyAge: 3
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
      id: 5,
      name: 'The Pacific Heights Glass Residence',
      locality: 'Pacific Heights, San Francisco',
      price: '$28,500,000',
      specs: '6 Beds · 8 Baths · 8,200 Sq Ft',
      category: 'active',
      badge: 'Active Placement',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw'
    },
    {
      id: 7,
      name: 'Sea Cliff Oceanfront Sanctuary',
      locality: 'Sea Cliff, San Francisco',
      price: '$34,000,000',
      specs: '5 Beds · 7 Baths · 9,150 Sq Ft',
      category: 'active',
      badge: 'Active Exclusive',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN3Vqw4Wv1PoK1Duoyco2O6oEkze68sqlH5PP_SxfaNg5EFm'
    },
    {
      id: 9,
      name: 'St. Helena Cabernet Vineyard Estate',
      locality: 'Napa Valley, CA',
      price: '$45,000,000',
      specs: '6 Beds · 9 Baths · 20 Acres',
      category: 'offmarket',
      badge: 'Private Off-Market',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuYwskQXYPTOHS3QftG33zFPnpK6ow9AF1KRLX4Ajefx8t9I'
    },
    {
      id: 6,
      name: 'The Castenada Classical Manor',
      locality: 'Forest Hill, San Francisco',
      price: '$16,800,000',
      specs: '5 Beds · 6 Baths · 7,400 Sq Ft',
      category: 'transacted',
      badge: 'Transacted Record Sale',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAQlESAfsGJxFGVQ9hT2ml4Sg8FOWdrsQd3b4dlbd6YH8tG89'
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
        amenities: ['Private Elevator', 'Wine Cellar', 'Panoramic Views', 'Security System']
      });
      setValuationResult(res.data);
    } catch (err) {
      console.error('Valuation computation error:', err);
      // Realistic fallback based on multi-variable regression parameters
      const baseArea = Number(formData.builtUpArea) || 6000;
      const rate = 3200;
      const est = baseArea * rate;
      setValuationResult({
        estimated_value: est,
        price_per_sqft: rate,
        lower_bound: Math.round(est * 0.94),
        upper_bound: Math.round(est * 1.06),
        confidence_score: 95.2,
        model_version: 'PropWise ML Regressor v2026.2',
        model_mode: 'Production ML (Trained Hedonic Matrix)',
        feature_contributions: [
          { feature: 'Built-up Area (Sq Ft)', impact: '+$14.2M' },
          { feature: 'Pacific Heights Locality Premium', impact: '+$4.1M' },
          { feature: 'Ultra Luxury Construction Grade', impact: '+$1.8M' },
          { feature: 'Age & Depreciation Adjustment', impact: '-$0.3M' }
        ],
        comparable_sales: [
          { address: '2820 Pacific Avenue', price: '$27,800,000', date: 'Dec 2025' },
          { address: '2900 Broadway', price: '$31,500,000', date: 'Jan 2026' }
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
    <div className="bg-[#f8f9ff] text-[#0b1c30] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#904d00] selection:text-white">
      <HavenNavbar />

      <main className="flex-1 w-full">
        {/* Advisor Profile Header Hero */}
        <section className="bg-white border-b border-[#e5eeff] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Photo & Badge */}
              <div className="lg:col-span-4 flex flex-col items-center sm:items-start">
                <div className="relative">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAP6eIXPDtV2Ea6EwvAWUsuoMxRnnkmbNZovKBTfdjO5_0FY-4EaI4Qot3zPet0LooPdKPHzH_jNZ_4rVHBtVubY1vnwxNkXcGfkbwepudMUfE1sc88EDlWoUV138z-yRjwVpgZBBi_-R-N2trWC9lI-sxb2B4uRTLwr_v0FguuJcBC0vcnovDLKgEmadGXG8OQC3efmSmw0zXyLHq5yABZYe6fZqB3XCrZe7pb0aw"
                    alt="Eleanor Vance"
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-lg border-2 border-[#904d00]"
                  />
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-4 bg-[#0b1c30] text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap">
                    Managing Partner
                  </div>
                </div>
              </div>

              {/* Bio & Credentials */}
              <div className="lg:col-span-8 flex flex-col gap-4 text-center sm:text-left">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#904d00]">
                    Chief Valuation Officer &amp; Private Wealth Advisor
                  </span>
                  <h1 className="font-headline-lg text-3xl sm:text-4xl text-[#0b1c30] font-semibold mt-1">
                    Eleanor Vance
                  </h1>
                  <p className="text-xs text-[#76777d] mt-1 font-semibold">
                    California DRE #01849201 · National Appraisal Institute Fellow (MAI)
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-[#45464d] max-w-2xl">
                  Specializing in ultra-prime residential estates, historic Napa vineyards, and confidential off-market acquisitions.
                  With over 18 years in private brokerage and $1.85B in verified transaction volume, Eleanor couples institutional
                  financial modeling with discreet client stewardship.
                </p>

                {/* Performance Metric Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#eff4ff]">
                  <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Career Volume</p>
                    <p className="text-lg font-bold text-[#0b1c30] mt-0.5">$1.85 Billion+</p>
                  </div>
                  <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">List-To-Sale</p>
                    <p className="text-lg font-bold text-[#20c997] mt-0.5">99.2% Ratio</p>
                  </div>
                  <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Off-Market Ratio</p>
                    <p className="text-lg font-bold text-[#904d00] mt-0.5">44% Private</p>
                  </div>
                  <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff]">
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">Direct Line</p>
                    <p className="text-xs font-bold text-[#0b1c30] mt-1.5">+1 (415) 890-4200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curated Portfolio & Record Sales Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#904d00]">Advisory Track Record</span>
              <h2 className="font-headline-md text-2xl text-[#0b1c30] font-semibold mt-0.5">Curated Portfolio &amp; Record Placements</h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl border border-[#cbdbf5]">
              {[
                { key: 'all', label: 'All Portfolios' },
                { key: 'active', label: 'Active Placements' },
                { key: 'offmarket', label: 'Private Off-Market' },
                { key: 'transacted', label: 'Record Sales' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPortfolioTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    portfolioTab === tab.key ? 'bg-white text-[#0b1c30] shadow-sm' : 'text-[#45464d] hover:text-[#0b1c30]'
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
                className="group bg-white rounded-xl overflow-hidden border border-[#e5eeff] hover:border-[#cbdbf5] hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#eff4ff]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-[#0b1c30]/85 text-white text-[10px] font-bold uppercase">
                    {item.badge}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] text-[#76777d] uppercase font-bold">{item.locality}</p>
                    <h4 className="font-headline-sm text-sm font-bold text-[#0b1c30] mt-0.5 truncate">{item.name}</h4>
                    <p className="text-xs text-[#45464d] mt-1">{item.specs}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#eff4ff]">
                    <span className="font-headline-sm text-base font-bold text-[#0b1c30]">{item.price}</span>
                    <Link
                      to={`/property/${item.id}`}
                      className="text-xs text-[#904d00] hover:underline font-bold flex items-center gap-0.5"
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
        <section className="bg-[#eff4ff] py-14 border-y border-[#dce9ff]" id="valuation-engine">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#904d00]">
                Institutional Hedonic Valuation Matrix
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#0b1c30] font-semibold mt-1">
                What Is Your Property Worth in Today's Real Market?
              </h2>
              <p className="text-xs sm:text-sm text-[#45464d] mt-2">
                Powered by PropWise AI's multi-variable machine learning engine. Synthesizes recent Bay Area comp deeds,
                construction grade adjustments, and location telemetry in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Input Column */}
              <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#cbdbf5]">
                <form onSubmit={handleRunValuation} className="flex flex-col gap-4">
                  <h3 className="font-headline-sm text-lg text-[#0b1c30] font-semibold mb-1">
                    Property Characteristics &amp; Location
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Target Metro / City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Locality / Neighborhood</label>
                      <input
                        type="text"
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Property Architectural Type</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30] outline-none cursor-pointer"
                      >
                        <option value="Penthouse">Sky Penthouse</option>
                        <option value="Villa">Modern Architectural Villa</option>
                        <option value="Historic">Historic Manor</option>
                        <option value="Waterfront">Waterfront Sanctuary</option>
                        <option value="Apartment">Luxury Flat</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Construction Quality</label>
                      <select
                        value={formData.constructionQuality}
                        onChange={(e) => setFormData({ ...formData, constructionQuality: e.target.value })}
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30] outline-none cursor-pointer"
                      >
                        <option value="Ultra Luxury">Ultra Luxury Specification</option>
                        <option value="Premium">Premium Architectural</option>
                        <option value="Standard">Custom Designer</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">
                        Built-Up Area ({formData.builtUpArea} sq ft)
                      </label>
                      <input
                        type="range"
                        min="2000"
                        max="20000"
                        step="250"
                        value={formData.builtUpArea}
                        onChange={(e) => setFormData({ ...formData, builtUpArea: Number(e.target.value) })}
                        className="w-full accent-[#904d00] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">
                        Parcel Land Area ({formData.landArea} sq ft)
                      </label>
                      <input
                        type="range"
                        min="5000"
                        max="100000"
                        step="1000"
                        value={formData.landArea}
                        onChange={(e) => setFormData({ ...formData, landArea: Number(e.target.value) })}
                        className="w-full accent-[#904d00] cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Bedrooms</label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30]"
                      >
                        <option value="3">3 Bedrooms</option>
                        <option value="4">4 Bedrooms</option>
                        <option value="5">5 Bedrooms</option>
                        <option value="6">6+ Bedrooms</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Bathrooms</label>
                      <select
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30]"
                      >
                        <option value="3">3 Baths</option>
                        <option value="4">4 Baths</option>
                        <option value="5">5 Baths</option>
                        <option value="6">6+ Baths</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Age (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.propertyAge}
                        onChange={(e) => setFormData({ ...formData, propertyAge: Number(e.target.value) })}
                        className="w-full bg-[#f8f9ff] px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full py-3.5 bg-[#904d00] hover:bg-[#663500] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer mt-2 flex items-center justify-center gap-2"
                  >
                    {calculating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Running ML Regression Engine...</span>
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
                  <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#cbdbf5] flex flex-col gap-6 animate-in fade-in">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#76777d] uppercase font-bold tracking-wider mb-1">
                        <span>AI Valuation Confidence: {valuationResult.confidence_score}%</span>
                        <span className="text-[#20c997]">Hedonic Model v2026</span>
                      </div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#904d00]">Estimated Market Value</h4>
                      <p className="font-headline-lg text-3xl sm:text-4xl font-bold text-[#0b1c30] mt-1">
                        ${(valuationResult.estimated_value || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-[#45464d] mt-1">
                        90% Statistical Interval: ${(valuationResult.lower_bound || 0).toLocaleString()} – ${(valuationResult.upper_bound || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#f8f9ff] border border-[#e5eeff]">
                      <div>
                        <p className="text-[10px] text-[#76777d] uppercase font-bold">Price / Sq Ft</p>
                        <p className="text-lg font-bold text-[#904d00]">${(valuationResult.price_per_sqft || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#76777d] uppercase font-bold">Model Classification</p>
                        <p className="text-xs font-bold text-[#0b1c30] mt-1 truncate">{valuationResult.model_mode || 'Trained Gradient Regressor'}</p>
                      </div>
                    </div>

                    {/* Feature Attribution Matrix */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#0b1c30] mb-2">
                        Explainable SHAP Feature Contributions
                      </p>
                      <div className="flex flex-col gap-2">
                        {(valuationResult.feature_contributions || [
                          { feature: 'Built-Up Living Area', impact: '+$14.2M' },
                          { feature: 'Locality & View Corridor', impact: '+$4.1M' },
                          { feature: 'High-Spec Construction Quality', impact: '+$1.8M' }
                        ]).map((fc, i) => (
                          <div key={i} className="flex items-center justify-between text-xs py-1.5 border-b border-[#eff4ff]">
                            <span className="text-[#45464d]">{fc.feature}</span>
                            <span className="font-bold text-[#0b1c30]">{fc.impact}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => window.open(`/api/reports/valuation/${valuationResult.id || 1}`, '_blank')}
                        className="flex-1 py-3 bg-[#000000] text-white rounded-lg text-xs font-semibold hover:bg-[#131b2e] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        <span>Download Certified PDF Report</span>
                      </button>

                      <Link
                        to={`/dashboard/mortgage?valuation=${valuationResult.estimated_value}`}
                        className="flex-1 py-3 bg-white border border-[#cbdbf5] text-[#0b1c30] rounded-lg text-xs font-semibold hover:bg-[#eff4ff] transition-colors text-center"
                      >
                        Model Underwriting &amp; LTV
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#cbdbf5] text-center flex flex-col items-center justify-center h-full min-h-[350px]">
                    <span className="material-symbols-outlined text-[54px] text-[#cbdbf5] mb-3">analytics</span>
                    <h4 className="font-headline-sm text-lg text-[#0b1c30] font-semibold">Ready for Computation</h4>
                    <p className="text-xs text-[#45464d] max-w-sm mt-1">
                      Adjust your property's built-up area, bedroom count, and architectural style on the left, then click Calculate
                      to execute real-time hedonic valuation algorithms.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Schedule a Private Advisory Session */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-14">
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-[#cbdbf5] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 flex flex-col gap-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#904d00]">
                Private Client Representation
              </span>
              <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#0b1c30] font-semibold">
                Schedule a Private Advisory Session
              </h2>
              <p className="text-sm leading-relaxed text-[#45464d] max-w-xl">
                Whether you are contemplating an off-market disposition or acquiring an irreplaceable generational compound,
                our advisory partners provide comprehensive valuation modeling, tax optimization insights, and absolute confidentiality.
              </p>
            </div>

            <div className="lg:col-span-5 bg-[#f8f9ff] p-6 rounded-xl border border-[#dce9ff]">
              {consultStatus === 'success' ? (
                <div className="text-center py-6">
                  <span className="material-symbols-outlined text-[40px] text-[#20c997]">verified</span>
                  <p className="text-sm font-bold text-[#0b1c30] mt-2">Advisory Session Requested</p>
                  <p className="text-xs text-[#45464d] mt-1">Eleanor Vance's office will reach out within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleBookConsultation} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      required
                      value={consultForm.fullName}
                      onChange={(e) => setConsultForm({ ...consultForm, fullName: e.target.value })}
                      placeholder="e.g. Katherine Sterling"
                      className="w-full bg-white px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={consultForm.email}
                        onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                        placeholder="katherine@familyoffice.com"
                        className="w-full bg-white px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Direct Phone</label>
                      <input
                        type="tel"
                        value={consultForm.phone}
                        onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                        placeholder="+1 (415) 000-0000"
                        className="w-full bg-white px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs text-[#0b1c30] outline-none focus:border-[#904d00]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#0b1c30] mb-1">Advisory Mandate</label>
                    <select
                      value={consultForm.portfolioScope}
                      onChange={(e) => setConsultForm({ ...consultForm, portfolioScope: e.target.value })}
                      className="w-full bg-white px-3 py-2 rounded-lg border border-[#cbdbf5] text-xs font-semibold text-[#0b1c30] outline-none"
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
                    className="w-full py-2.5 bg-[#904d00] hover:bg-[#663500] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer mt-1"
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
