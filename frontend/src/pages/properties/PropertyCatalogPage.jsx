import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import HavenNavbar from '../../components/haven/HavenNavbar';
import HavenFooter from '../../components/haven/HavenFooter';
import { propertiesAPI } from '../../services/api';

export default function PropertyCatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [searchTerm, setSearchTerm] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'all');
  const [priceRange, setPriceRange] = useState(searchParams.get('price') || 'all');
  const [minBeds, setMinBeds] = useState(searchParams.get('beds') || 'any');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [savedProperties, setSavedProperties] = useState([1, 2, 5]);
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [inquirySent, setInquirySent] = useState(false);

  // Fetch properties from backend
  const fetchProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await propertiesAPI.list();
      setProperties(res.data || []);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Unable to reach property service. Showing verified local catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const toggleSave = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (savedProperties.includes(id)) {
      setSavedProperties(savedProperties.filter((p) => p !== id));
    } else {
      setSavedProperties([...savedProperties, id]);
    }
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    if (!inquiryEmail) return;
    try {
      await propertiesAPI.inquire({
        full_name: 'Private Placement Buyer',
        email: inquiryEmail,
        message: inquiryNotes || 'Interested in private off-market acquisition placement.',
        inquiry_type: 'Off-Market Placement'
      });
      setInquirySent(true);
      setInquiryEmail('');
      setInquiryNotes('');
      setTimeout(() => setInquirySent(false), 5000);
    } catch (err) {
      console.error('Inquiry error:', err);
    }
  };

  // Filter and sort properties
  const filteredProperties = properties
    .filter((p) => {
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesLoc =
          (p.name && p.name.toLowerCase().includes(term)) ||
          (p.locality && p.locality.toLowerCase().includes(term)) ||
          (p.city && p.city.toLowerCase().includes(term)) ||
          (p.full_address && p.full_address.toLowerCase().includes(term));
        if (!matchesLoc) return false;
      }

      if (propertyType !== 'all') {
        const pType = (p.property_type || '').toLowerCase();
        const target = propertyType.toLowerCase();
        if (!pType.includes(target) && !target.includes(pType)) return false;
      }

      if (minBeds !== 'any') {
        const targetBeds = parseInt(minBeds, 10);
        if (targetBeds && (p.bedrooms || 0) < targetBeds) return false;
      }

      const price = p.estimated_value || 0;
      if (priceRange === '2-5' && (price < 2000000 || price > 5000000)) return false;
      if (priceRange === '5-10' && (price < 5000000 || price > 15000000)) return false;
      if (priceRange === '15-25' && (price < 15000000 || price > 25000000)) return false;
      if (priceRange === '25+' && price < 25000000) return false;

      if (searchParams.get('filter') === 'saved' && !savedProperties.includes(p.id)) return false;

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.estimated_value || 0) - (b.estimated_value || 0);
      if (sortBy === 'price_desc') return (b.estimated_value || 0) - (a.estimated_value || 0);
      if (sortBy === 'area_desc') return (b.built_up_area_sqft || 0) - (a.built_up_area_sqft || 0);
      return (b.id || 0) - (a.id || 0);
    });

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen flex flex-col font-body-md antialiased selection:bg-[#3978F6] selection:text-white">
      <HavenNavbar savedCount={savedProperties.length} />

      <main className="flex-1 w-full">
        <div className="flex flex-col w-full">
          {/* Sticky Context & Filter Control Suite */}
          <section className="sticky top-20 z-40 bg-[#F1F5F9]/95 backdrop-blur-md shadow-xl border-b border-[#E2E8F0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3.5 flex flex-col gap-3">
              {/* Top Primary Filtering Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-1 flex-wrap items-center gap-3 min-w-0">
                  {/* Keyword Search */}
                  <div className="relative flex items-center min-w-[240px] flex-1 max-w-sm bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] focus-within:border-[#3978F6] transition-colors shadow-inner">
                    <span className="material-symbols-outlined text-[#0284C7] pl-3 text-[20px]">search</span>
                    <input
                      className="w-full bg-transparent px-3 py-2 text-xs text-[#0F172A] outline-none placeholder:text-[#475569]"
                      placeholder="Search city, neighborhood, or title..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="pr-3 text-[#475569] hover:text-[#0F172A] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                      </button>
                    )}
                  </div>

                  {/* Property Type Dropdown */}
                  <div className="relative bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] px-3 py-1.5 shadow-inner flex items-center gap-2">
                    <span className="text-xs text-[#475569]">Type:</span>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#0F172A] outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#FFFFFF] text-[#0F172A]">All Property Types</option>
                      <option value="Penthouse" className="bg-[#FFFFFF] text-[#0F172A]">Sky Penthouse</option>
                      <option value="Villa" className="bg-[#FFFFFF] text-[#0F172A]">Modern Villa</option>
                      <option value="Historic" className="bg-[#FFFFFF] text-[#0F172A]">Historic Manor</option>
                      <option value="Waterfront" className="bg-[#FFFFFF] text-[#0F172A]">Waterfront Estate</option>
                      <option value="Apartment" className="bg-[#FFFFFF] text-[#0F172A]">Apartment Flat</option>
                      <option value="Commercial" className="bg-[#FFFFFF] text-[#0F172A]">Commercial Suite</option>
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="relative bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] px-3 py-1.5 shadow-inner flex items-center gap-2">
                    <span className="text-xs text-[#475569]">Scale:</span>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#059669] outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#FFFFFF] text-[#0F172A]">Any Valuation</option>
                      <option value="2-5" className="bg-[#FFFFFF] text-[#0F172A]">$2M – $5M / Cr 15–40</option>
                      <option value="5-10" className="bg-[#FFFFFF] text-[#0F172A]">$5M – $15M / Cr 40–120</option>
                      <option value="15-25" className="bg-[#FFFFFF] text-[#0F172A]">$15M – $25M / Cr 120–200</option>
                      <option value="25+" className="bg-[#FFFFFF] text-[#0F172A]">$25M+ (Trophy Estate)</option>
                    </select>
                  </div>

                  {/* Bedroom Selector Pills */}
                  <div className="flex items-center bg-[#F8FAFC] p-0.5 rounded-xl border border-[#E2E8F0]">
                    {['any', '2', '3', '4', '5'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setMinBeds(b)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          minBeds === b
                            ? 'bg-[#3978F6] text-white shadow-sm'
                            : 'text-[#475569] hover:text-[#0F172A]'
                        }`}
                      >
                        {b === 'any' ? 'Any Bed' : `${b}+ BHK`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View & Sort Utilities */}
                <div className="flex items-center gap-3">
                  {/* Sort By Dropdown */}
                  <div className="flex items-center bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] px-3 py-1.5 shadow-inner gap-2">
                    <span className="text-xs text-[#475569]">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-semibold text-[#0F172A] outline-none cursor-pointer"
                    >
                      <option value="newest" className="bg-[#FFFFFF] text-[#0F172A]">Newest Catalog</option>
                      <option value="price_asc" className="bg-[#FFFFFF] text-[#0F172A]">Price: Low to High</option>
                      <option value="price_desc" className="bg-[#FFFFFF] text-[#0F172A]">Price: High to Low</option>
                      <option value="area_desc" className="bg-[#FFFFFF] text-[#0F172A]">Size: Largest Living Area</option>
                    </select>
                  </div>

                  {/* View Mode Toggle: Grid vs Map */}
                  <div className="flex items-center bg-[#F8FAFC] p-0.5 rounded-xl border border-[#E2E8F0]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === 'grid' ? 'bg-[#FFFFFF] text-[#0284C7] shadow-sm' : 'text-[#475569]'
                      }`}
                      title="Grid View"
                    >
                      <span className="material-symbols-outlined text-[18px]">grid_view</span>
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === 'map' ? 'bg-[#FFFFFF] text-[#0284C7] shadow-sm' : 'text-[#475569]'
                      }`}
                      title="Map View"
                    >
                      <span className="material-symbols-outlined text-[18px]">map</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Tags Strip */}
              <div className="flex items-center justify-between text-xs text-[#475569]">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-semibold text-[#0284C7]">{filteredProperties.length} Properties Indexed</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]">
                      Location: {searchTerm}
                      <button onClick={() => setSearchTerm('')} className="hover:text-[#DC2626] ml-1">×</button>
                    </span>
                  )}
                  {propertyType !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]">
                      Type: {propertyType}
                      <button onClick={() => setPropertyType('all')} className="hover:text-[#DC2626] ml-1">×</button>
                    </span>
                  )}
                  {priceRange !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A]">
                      Scale: {priceRange}
                      <button onClick={() => setPriceRange('all')} className="hover:text-[#DC2626] ml-1">×</button>
                    </span>
                  )}
                  {(searchTerm || propertyType !== 'all' || priceRange !== 'all' || minBeds !== 'any') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setPropertyType('all');
                        setPriceRange('all');
                        setMinBeds('any');
                      }}
                      className="text-[#3978F6] hover:underline font-semibold ml-2 cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <Link
                  to="/valuation"
                  className="hidden md:inline-flex items-center gap-1 text-[#0284C7] hover:underline font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">calculate</span>
                  Instant AI Valuation Engine →
                </Link>
              </div>
            </div>
          </section>

          {/* Results Area */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 w-full">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 border-3 border-[#3978F6] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-[#0F172A]">Querying verified collateral registry...</p>
              </div>
            ) : viewMode === 'map' ? (
              /* Map View */
              <div className="w-full bg-[#FFFFFF] rounded-2xl shadow-2xl border border-[#E2E8F0] p-4 flex flex-col gap-4">
                <div className="h-[520px] w-full rounded-xl bg-[#FFFFFF] relative overflow-hidden flex items-center justify-center border border-[#E2E8F0]">
                  <iframe
                    title="Property Map Location"
                    className="w-full h-full border-0 filter invert-[0.9] hue-rotate-180 contrast-125"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-122.52%2C37.73%2C-122.38%2C37.82&amp;layer=mapnik"
                  />
                  <div className="absolute top-4 left-4 bg-[#F1F5F9]/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-[#E2E8F0] max-w-xs text-xs">
                    <p className="font-bold text-[#0F172A] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#0284C7]">satellite_alt</span>
                      GIS Location Telemetry
                    </p>
                    <p className="text-[#475569] mt-1.5">
                      {filteredProperties.length} Verified property parcels indexed with municipal geo-coordinates.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredProperties.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      to={`/property/${p.id}`}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#3978F6] transition-colors group"
                    >
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-20 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#0284C7]">{p.name}</p>
                        <p className="text-[11px] text-[#475569] truncate">{p.locality}, {p.city}</p>
                        <p className="text-xs font-bold text-[#059669] mt-0.5">
                          {p.estimated_value > 10000000
                            ? `INR ${(p.estimated_value / 10000000).toFixed(2)} Cr`
                            : `$${p.estimated_value.toLocaleString()}`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-24 text-center bg-[#FFFFFF] rounded-2xl border border-[#E2E8F0] p-8">
                <span className="material-symbols-outlined text-[48px] text-[#E2E8F0]">search_off</span>
                <h3 className="font-headline-sm text-lg text-[#0F172A] mt-3">No matching properties found</h3>
                <p className="text-xs text-[#475569] mt-1 max-w-md mx-auto">
                  Try adjusting your location search or removing price tier constraints to explore all registered assets.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setPropertyType('all');
                    setPriceRange('all');
                    setMinBeds('any');
                  }}
                  className="mt-4 px-5 py-2.5 bg-[#3978F6] text-white text-xs font-semibold rounded-lg hover:bg-[#2457C5] transition-colors shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Grid of Luxury Property Cards Matching Dashboard Design Exactly */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((p) => {
                  const isSaved = savedProperties.includes(p.id);
                  const priceDisplay =
                    p.estimated_value > 10000000
                      ? `INR ${(p.estimated_value / 10000000).toFixed(2)} Cr`
                      : `$${(p.estimated_value || 0).toLocaleString()}`;
                  const pricePerSqFt = p.built_up_area_sqft
                    ? Math.round(p.estimated_value / p.built_up_area_sqft)
                    : 2450;

                  return (
                    <div
                      key={p.id}
                      className="bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#3978F6]/50 rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 shadow-xl flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Banner */}
                        <div className="h-48 bg-[#FFFFFF] relative overflow-hidden">
                          <img
                            src={p.image_url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                            alt={p.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Property Type Badge */}
                          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#F8FAFC]/80 backdrop-blur-sm border border-[#E2E8F0] text-[10px] font-semibold text-[#0284C7]">
                            {p.property_type || 'Residential'}
                          </div>

                          {/* Status Badge */}
                          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-[#059669]/20 border border-[#059669]/40 text-[10px] font-bold text-[#059669]">
                            {p.status || 'Available'}
                          </div>

                          {/* Bookmark Toggle */}
                          <button
                            onClick={(e) => toggleSave(e, p.id)}
                            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#F8FAFC]/80 backdrop-blur-sm flex items-center justify-center text-[#475569] hover:text-[#DC2626] transition-colors border border-[#E2E8F0] cursor-pointer"
                            title={isSaved ? 'Remove from Saved' : 'Save Property'}
                          >
                            <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'text-[#DC2626]' : ''}`}>
                              {isSaved ? 'favorite' : 'favorite_border'}
                            </span>
                          </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 space-y-3">
                          <div>
                            <h3 className="text-sm font-bold text-[#0F172A] truncate group-hover:text-[#0284C7] transition-colors">
                              <Link to={`/property/${p.id}`}>{p.name}</Link>
                            </h3>
                            <div className="flex items-center space-x-1 text-xs text-[#475569] mt-1">
                              <span className="material-symbols-outlined text-[14px] text-[#3978F6]">location_on</span>
                              <span className="truncate">{p.locality}, {p.city}</span>
                            </div>
                          </div>

                          {/* Specs Bar matching dashboard exactly */}
                          <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E2E8F0] text-center text-xs text-[#475569]">
                            <div className="flex items-center justify-center space-x-1">
                              <span className="material-symbols-outlined text-[14px] text-[#0284C7]">bed</span>
                              <span>{p.bedrooms} BHK</span>
                            </div>
                            <div className="flex items-center justify-center space-x-1">
                              <span className="material-symbols-outlined text-[14px] text-[#0284C7]">bathtub</span>
                              <span>{p.bathrooms} Baths</span>
                            </div>
                            <div className="flex items-center justify-center space-x-1">
                              <span className="material-symbols-outlined text-[14px] text-[#0284C7]">directions_car</span>
                              <span>{p.parking_spaces || 2} Park</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[#475569]">Built-up Area:</span>
                            <span className="font-semibold text-[#0F172A]">{(p.built_up_area_sqft || 0).toLocaleString()} sqft</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[#475569]">Quality Grade:</span>
                            <span className="font-semibold text-[#059669]">{p.construction_quality || 'A Grade'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer with Valuation & Inspect Action */}
                      <div className="px-5 py-3.5 bg-[#F1F5F9] border-t border-[#E2E8F0] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#475569] uppercase block">Assessed ML Value</span>
                          <span className="text-base font-extrabold text-[#059669]">
                            {priceDisplay}
                          </span>
                        </div>
                        <Link
                          to={`/property/${p.id}`}
                          className="px-4 py-2 bg-[#3978F6] hover:bg-[#2457C5] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-[#3978F6]/20"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confidential Placements Section in Dark Theme */}
          <section className="w-full bg-[#F1F5F9] py-16 border-t border-[#E2E8F0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
              <div className="bg-[#FFFFFF] rounded-2xl p-8 sm:p-12 shadow-2xl border border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7]">
                    Confidential Acquisition Mandates
                  </span>
                  <h2 className="font-headline-lg text-2xl sm:text-3xl text-[#0F172A]">
                    Seeking Off-Market or Private Placements?
                  </h2>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#475569] max-w-xl">
                    Over 40% of our institutional transactions transpire strictly off-market without public listing indexing.
                    Register an institutional acquisition mandate to receive curated briefings directly from our advisory partners.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-[#F1F5F9] p-6 rounded-xl border border-[#E2E8F0]">
                  <form onSubmit={handleInquiry} className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                        Corporate or Private Email
                      </label>
                      <input
                        type="email"
                        required
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="e.g. principal@familyoffice.com"
                        className="w-full bg-[#FFFFFF] px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0F172A] mb-1">
                        Target Acquisition Scope (Optional)
                      </label>
                      <input
                        type="text"
                        value={inquiryNotes}
                        onChange={(e) => setInquiryNotes(e.target.value)}
                        placeholder="e.g. Worli Sea Face Villa or Penthouse INR 30-50 Cr"
                        className="w-full bg-[#FFFFFF] px-3.5 py-2.5 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] outline-none focus:border-[#3978F6]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#3978F6] hover:bg-[#2457C5] text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-[#3978F6]/20 cursor-pointer mt-1"
                    >
                      {inquirySent ? 'Mandate Registered ✓' : 'Register Private Placement Mandate'}
                    </button>
                    {inquirySent && (
                      <p className="text-[11px] text-[#059669] font-medium text-center">
                        Mandate received. An executive advisor will initiate a secure briefing.
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <HavenFooter />
    </div>
  );
}
